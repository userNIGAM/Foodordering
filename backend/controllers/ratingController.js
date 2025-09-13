import Rating from "../models/Rating.js";
import MenuItem from "../models/MenuItem.js";

// Submit or update a rating
export const rateProduct = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user._id; // assuming auth middleware sets req.user

    // Find if user already rated
    let userRating = await Rating.findOne({ user: userId, product: productId });

    if (userRating) {
      // Update existing rating
      const oldRating = userRating.rating;
      userRating.rating = rating;
      userRating.review = review || userRating.review;
      await userRating.save();

      // Update aggregate
      const product = await MenuItem.findById(productId);
      product.ratings.breakdown[oldRating] -= 1;
      product.ratings.breakdown[rating] += 1;

      // Recalculate average
      let total = 0;
      for (let star = 1; star <= 5; star++) {
        total += star * product.ratings.breakdown[star];
      }
      product.ratings.average = total / product.ratings.count;

      await product.save();
    } else {
      // New rating
      userRating = new Rating({
        user: userId,
        product: productId,
        rating,
        review,
      });
      await userRating.save();

      const product = await MenuItem.findById(productId);
      product.ratings.breakdown[rating] += 1;
      product.ratings.count += 1;

      // Recalculate average
      let total = 0;
      for (let star = 1; star <= 5; star++) {
        total += star * product.ratings.breakdown[star];
      }
      product.ratings.average = total / product.ratings.count;

      await product.save();
    }

    res.json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Rating error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit rating" });
  }
};

// Get all ratings for a product
export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ product: productId }).populate(
      "user",
      "name"
    );

    const product = await MenuItem.findById(productId).select("ratings");

    res.json({
      success: true,
      ratings,
      stats: product.ratings,
    });
  } catch (error) {
    console.error("Get ratings error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch ratings" });
  }
};

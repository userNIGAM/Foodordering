import Rating from "../models/Rating.js";
import MenuItem from "../models/MenuItem.js";

// Submit or update a rating
export const rateProduct = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user._id; // from auth middleware

    let userRating = await Rating.findOne({ user: userId, product: productId });
    const product = await MenuItem.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // ✅ Ensure breakdown has all 5 stars initialized
    if (!product.ratings.breakdown) {
      product.ratings.breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    if (userRating) {
      // ✅ Update existing rating
      const oldRating = userRating.rating;

      userRating.rating = rating;
      userRating.review = review || userRating.review;
      await userRating.save();

      // Update breakdown
      if (product.ratings.breakdown[oldRating] > 0) {
        product.ratings.breakdown[oldRating] -= 1;
      }
      product.ratings.breakdown[rating] += 1;

      // count stays the same ✅
    } else {
      // ✅ New rating
      userRating = new Rating({
        user: userId,
        product: productId,
        rating,
        review,
      });
      await userRating.save();

      product.ratings.breakdown[rating] += 1;
      product.ratings.count += 1;
    }

    // ✅ Recalculate average
    let total = 0;
    for (let star = 1; star <= 5; star++) {
      total += star * product.ratings.breakdown[star];
    }
    product.ratings.average =
      product.ratings.count > 0 ? total / product.ratings.count : 0;

    await product.save({ validateBeforeSave: false });

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
    const userId = req.user?._id;

    // Fetch ratings from Rating collection
    const ratings = await Rating.find({ product: productId }).populate(
      "user",
      "name"
    );

    const product = await MenuItem.findById(productId).select("ratings");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Compute stats live
    let average = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      average = sum / ratings.length;
    }

    // Get logged-in user's rating
    let userRating = null;
    if (userId) {
      const found = ratings.find(
        (r) => r.user._id.toString() === userId.toString()
      );
      if (found) {
        userRating = {
          rating: found.rating,
          review: found.review,
        };
      }
    }

    res.json({
      success: true,
      ratings,
      stats: {
        average,
        count: ratings.length,
      },
      userRating,
    });
  } catch (error) {
    console.error("Get ratings error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch ratings" });
  }
};

//Get menu Items
export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the menu item
    const item = await MenuItem.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // 2. Get all ratings for this product
    const ratings = await Rating.find({ product: id });

    // 3. Recalculate stats dynamically
    let count = ratings.length;
    let breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratings.forEach((r) => {
      breakdown[r.rating] += 1;
    });

    let total = Object.entries(breakdown).reduce(
      (sum, [star, num]) => sum + Number(star) * num,
      0
    );

    const average = count > 0 ? total / count : 0;

    // 4. Return item with fresh ratings
    res.json({
      success: true,
      data: {
        ...item.toObject(),
        ratings: { average, count, breakdown },
      },
    });
  } catch (error) {
    console.error("Get menu item error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch menu item" });
  }
};

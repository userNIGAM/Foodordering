// backend/controllers/kitchenController.js
import Kitchen from "../models/Kitchen.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * Create a new kitchen
 */
export const createKitchen = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      maxCapacity,
      avgPrepTime,
      specializations,
      operatingHours,
    } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Kitchen name and location are required",
      });
    }

    const kitchen = await Kitchen.create({
      name,
      location,
      address,
      maxCapacity: maxCapacity || 50,
      avgPrepTime: avgPrepTime || 30,
      specializations: specializations || [],
      operatingHours: operatingHours || {
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Kitchen created successfully",
      data: kitchen,
    });
  } catch (error) {
    console.error("Create Kitchen Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all kitchens
 */
export const getAllKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find()
      .populate("chefs.userId", "name email phoneNumber completedOrders chefRating currentCapacity maxCapacity")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: kitchens.length,
      data: kitchens,
    });
  } catch (error) {
    console.error("Get All Kitchens Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get kitchen by ID
 */
export const getKitchenById = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const kitchen = await Kitchen.findById(kitchenId)
      .populate("chefs.userId", "name email phoneNumber completedOrders chefRating currentCapacity maxCapacity")
      .lean();

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: kitchen,
    });
  } catch (error) {
    console.error("Get Kitchen Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update kitchen details
 */
export const updateKitchen = async (req, res) => {
  try {
    const { kitchenId } = req.params;
    const updates = req.body;

    // Prevent updating chefs array directly
    delete updates.chefs;

    const kitchen = await Kitchen.findByIdAndUpdate(kitchenId, updates, {
      new: true,
      runValidators: true,
    });

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Kitchen updated successfully",
      data: kitchen,
    });
  } catch (error) {
    console.error("Update Kitchen Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Assign chef to kitchen
 */
export const assignChefToKitchen = async (req, res) => {
  try {
    const { kitchenId } = req.params;
    const { chefId } = req.body;

    // Validate inputs
    if (!chefId) {
      return res.status(400).json({
        success: false,
        message: "Chef ID is required",
      });
    }

    // Get kitchen
    const kitchen = await Kitchen.findById(kitchenId);
    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Get chef
    const chef = await User.findById(chefId);
    if (!chef || chef.role !== "chef") {
      return res.status(404).json({
        success: false,
        message: "Chef not found or not a valid chef",
      });
    }

    // Check if chef is already in kitchen
    const alreadyAssigned = kitchen.chefs.some(
      (c) => c.userId.toString() === chefId.toString()
    );
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Chef already assigned to this kitchen",
      });
    }

    // Add chef to kitchen
    kitchen.chefs.push({
      userId: chefId,
      isActive: true,
    });

    // Update chef's kitchen reference
    chef.kitchenId = kitchenId;
    await chef.save();

    await kitchen.save();

    // Send notification to chef
    await sendEmail({
      to: chef.email,
      subject: "You've been assigned to a Kitchen - FoodOrdering",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Kitchen Assignment</h2>
          <p>Hi ${chef.name},</p>
          <p>You have been assigned to <strong>${kitchen.name}</strong></p>
          <p><strong>Location:</strong> ${kitchen.location}</p>
          <p>Please log in to your dashboard to start receiving orders.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Chef assigned to kitchen successfully",
      data: kitchen,
    });
  } catch (error) {
    console.error("Assign Chef Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Remove chef from kitchen
 */
export const removeChefFromKitchen = async (req, res) => {
  try {
    const { kitchenId, chefId } = req.params;

    const kitchen = await Kitchen.findById(kitchenId);
    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Remove chef from kitchen
    kitchen.chefs = kitchen.chefs.filter(
      (c) => c.userId.toString() !== chefId.toString()
    );

    // Update chef's kitchen reference
    await User.findByIdAndUpdate(chefId, { kitchenId: null });

    await kitchen.save();

    return res.status(200).json({
      success: true,
      message: "Chef removed from kitchen successfully",
      data: kitchen,
    });
  } catch (error) {
    console.error("Remove Chef Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get kitchen status and current load
 */
export const getKitchenStatus = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const kitchen = await Kitchen.findById(kitchenId)
      .populate("chefs.userId", "name currentCapacity maxCapacity chefRating completedOrders status");

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Calculate kitchen stats
    const chefStats = kitchen.chefs.map((c) => ({
      chefId: c.userId._id,
      chefName: c.userId.name,
      currentCapacity: c.userId.currentCapacity,
      maxCapacity: c.userId.maxCapacity,
      rating: c.userId.chefRating,
      completedOrders: c.userId.completedOrders,
      status: c.userId.status,
      availableSlots: c.userId.maxCapacity - c.userId.currentCapacity,
    }));

    const totalCapacity = chefStats.reduce((sum, c) => sum + c.availableSlots, 0);
    const utilizationPercent = ((kitchen.currentLoad / kitchen.maxCapacity) * 100).toFixed(2);

    return res.status(200).json({
      success: true,
      data: {
        kitchenId: kitchen._id,
        kitchenName: kitchen.name,
        isOpen: kitchen.operatingHours.isOpen,
        currentLoad: kitchen.currentLoad,
        maxCapacity: kitchen.maxCapacity,
        utilizationPercent,
        totalAvailableSlots: totalCapacity,
        chefCount: kitchen.chefs.length,
        chefStats,
        avgPrepTime: kitchen.avgPrepTime,
      },
    });
  } catch (error) {
    console.error("Get Kitchen Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Delete kitchen
 */
export const deleteKitchen = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const kitchen = await Kitchen.findByIdAndDelete(kitchenId);

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Remove kitchen reference from all chefs
    await User.updateMany(
      { kitchenId },
      { kitchenId: null }
    );

    return res.status(200).json({
      success: true,
      message: "Kitchen deleted successfully",
    });
  } catch (error) {
    console.error("Delete Kitchen Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  createKitchen,
  getAllKitchens,
  getKitchenById,
  updateKitchen,
  assignChefToKitchen,
  removeChefFromKitchen,
  getKitchenStatus,
  deleteKitchen,
};

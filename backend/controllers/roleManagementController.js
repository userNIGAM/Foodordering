// backend/controllers/roleManagementController.js
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

/**
 * Get all pending chef registrations
 */
export const getPendingChefs = async (req, res) => {
  try {
    const chefs = await User.find({
      role: "chef",
      status: "pending",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: chefs.length,
      data: chefs,
    });
  } catch (error) {
    console.error("Get Pending Chefs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all pending delivery person registrations
 */
export const getPendingDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await User.find({
      role: "delivery_person",
      status: "pending",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: deliveryPersons.length,
      data: deliveryPersons,
    });
  } catch (error) {
    console.error("Get Pending Delivery Persons Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Approve chef registration
 */
export const approveChef = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { kitchenId } = req.body;

    const chef = await User.findById(chefId);
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    if (chef.role !== "chef") {
      return res.status(400).json({
        success: false,
        message: "User is not a chef",
      });
    }

    // Update chef status
    chef.status = "approved";
    if (kitchenId) {
      chef.kitchenId = kitchenId;
    }
    await chef.save();

    // Send approval email
    await sendEmail({
      to: chef.email,
      subject: "Chef Account Approved - FoodOrdering",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Congratulations, ${chef.name}!</h2>
          <p>Your chef account has been approved and activated.</p>
          <p>You can now log in and start receiving orders.</p>
          <p>Max Capacity: ${chef.maxCapacity} orders</p>
          <p>If you have any questions, please contact support.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Chef approved successfully",
      data: chef,
    });
  } catch (error) {
    console.error("Approve Chef Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Reject chef registration
 */
export const rejectChef = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { reason } = req.body;

    const chef = await User.findById(chefId);
    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    if (chef.role !== "chef") {
      return res.status(400).json({
        success: false,
        message: "User is not a chef",
      });
    }

    // Delete the chef account or mark as rejected
    chef.status = "rejected";
    await chef.save();

    // Send rejection email
    await sendEmail({
      to: chef.email,
      subject: "Chef Account Application - Not Approved",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Application Status</h2>
          <p>Dear ${chef.name},</p>
          <p>Unfortunately, your chef account application was not approved.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p>Please contact support for more information or reapply in the future.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Chef rejected successfully",
    });
  } catch (error) {
    console.error("Reject Chef Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Approve delivery person registration
 */
export const approveDeliveryPerson = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { deliveryZone } = req.body;

    const deliveryPerson = await User.findById(deliveryId);
    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    if (deliveryPerson.role !== "delivery_person") {
      return res.status(400).json({
        success: false,
        message: "User is not a delivery person",
      });
    }

    // Update delivery person status
    deliveryPerson.status = "approved";
    if (deliveryZone) {
      deliveryPerson.deliveryZone = deliveryZone;
    }
    await deliveryPerson.save();

    // Send approval email
    await sendEmail({
      to: deliveryPerson.email,
      subject: "Delivery Account Approved - FoodOrdering",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Congratulations, ${deliveryPerson.name}!</h2>
          <p>Your delivery account has been approved and activated.</p>
          <p>You can now log in and start accepting deliveries.</p>
          ${
            deliveryZone
              ? `<p>Assigned Zone: ${deliveryZone}</p>`
              : ""
          }
          <p>If you have any questions, please contact support.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery person approved successfully",
      data: deliveryPerson,
    });
  } catch (error) {
    console.error("Approve Delivery Person Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Reject delivery person registration
 */
export const rejectDeliveryPerson = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { reason } = req.body;

    const deliveryPerson = await User.findById(deliveryId);
    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    if (deliveryPerson.role !== "delivery_person") {
      return res.status(400).json({
        success: false,
        message: "User is not a delivery person",
      });
    }

    // Mark as rejected
    deliveryPerson.status = "rejected";
    await deliveryPerson.save();

    // Send rejection email
    await sendEmail({
      to: deliveryPerson.email,
      subject: "Delivery Account Application - Not Approved",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Application Status</h2>
          <p>Dear ${deliveryPerson.name},</p>
          <p>Unfortunately, your delivery account application was not approved.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p>Please contact support for more information or reapply in the future.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery person rejected successfully",
    });
  } catch (error) {
    console.error("Reject Delivery Person Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all approved chefs
 */
export const getApprovedChefs = async (req, res) => {
  try {
    const chefs = await User.find({
      role: "chef",
      status: "approved",
    })
      .select("-password")
      .populate("kitchenId");

    return res.status(200).json({
      success: true,
      count: chefs.length,
      data: chefs,
    });
  } catch (error) {
    console.error("Get Approved Chefs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all approved delivery persons
 */
export const getApprovedDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await User.find({
      role: "delivery_person",
      status: "approved",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: deliveryPersons.length,
      data: deliveryPersons,
    });
  } catch (error) {
    console.error("Get Approved Delivery Persons Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update chef status (activate/deactivate)
 */
export const updateChefStatus = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { status } = req.body; // "active", "inactive", "on_break"

    const validStatuses = ["active", "inactive", "on_break"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const chef = await User.findByIdAndUpdate(chefId, { status }, { new: true });

    if (!chef) {
      return res.status(404).json({
        success: false,
        message: "Chef not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chef status updated",
      data: chef,
    });
  } catch (error) {
    console.error("Update Chef Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update delivery person status (activate/deactivate)
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body; // "active", "inactive", "on_break"

    const validStatuses = ["active", "inactive", "on_break"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const deliveryPerson = await User.findByIdAndUpdate(deliveryId, { status }, { new: true });

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery person status updated",
      data: deliveryPerson,
    });
  } catch (error) {
    console.error("Update Delivery Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default {
  getPendingChefs,
  getPendingDeliveryPersons,
  approveChef,
  rejectChef,
  approveDeliveryPerson,
  rejectDeliveryPerson,
  getApprovedChefs,
  getApprovedDeliveryPersons,
  updateChefStatus,
  updateDeliveryStatus,
};

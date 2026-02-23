// socket.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

let io;
const connectedUsers = new Map(); // Map of userId -> socketId

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://foodordering-q4rq.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware: Authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication failed: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role name email");

      if (!user) {
        return next(new Error("Authentication failed: User not found"));
      }

      socket.userId = user._id;
      socket.userRole = user.role;
      socket.userName = user.name;
      socket.userEmail = user.email;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  // Connection management
  io.on("connection", (socket) => {
    console.log(
      `✅ User connected: ${socket.userId} (${socket.userRole}) - ${socket.id}`
    );
    connectedUsers.set(socket.userId.toString(), socket.id);

    // ═══════════════════════════════════════════════════════════════
    // 👨‍💼 ADMIN ROOM MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    if (socket.userRole === "admin") {
      socket.join("admin");
      console.log(`Admin ${socket.userId} joined admin room`);
    }

    // 🍳 CHEF ROOM MANAGEMENT
    if (socket.userRole === "chef") {
      socket.join(`chef:${socket.userId}`);
      socket.on("join_kitchen", (kitchenId) => {
        socket.join(`kitchen:${kitchenId}`);
        console.log(`Chef ${socket.userId} joined kitchen ${kitchenId}`);
      });
    }

    // 🚚 DELIVERY PERSON ROOM MANAGEMENT
    if (socket.userRole === "delivery_person") {
      socket.join(`delivery:${socket.userId}`);
    }

    // 👨‍🍳 CUSTOMER ROOM MANAGEMENT
    if (socket.userRole === "user") {
      socket.join(`customer:${socket.userId}`);
    }

    // ═══════════════════════════════════════════════════════════════
    // 📋 ORDER STATUS EVENTS
    // ═══════════════════════════════════════════════════════════════

    // Order verified
    socket.on("order:verified", (orderData) => {
      io.to("admin").emit("order:verified", orderData);
      io.to(`kitchen:${orderData.kitchenId}`).emit("order:verified", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:verified", orderData);
    });

    // Order assigned to chef
    socket.on("order:assigned_to_kitchen", (orderData) => {
      io.to(`chef:${orderData.chefId}`).emit("order:assigned_to_kitchen", orderData);
      io.to(`kitchen:${orderData.kitchenId}`).emit("order:assigned_to_kitchen", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:assigned_to_kitchen", orderData);
    });

    // Chef confirms order
    socket.on("order:confirmed", (orderData) => {
      io.to("admin").emit("order:confirmed", orderData);
      io.to(`kitchen:${orderData.kitchenId}`).emit("order:confirmed", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:confirmed", orderData);
    });

    // Chef starts preparing
    socket.on("order:preparing", (orderData) => {
      io.to("admin").emit("order:preparing", orderData);
      io.to(`kitchen:${orderData.kitchenId}`).emit("order:preparing", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:preparing", {
        orderId: orderData.orderId,
        status: "preparing",
        estimatedTime: orderData.estimatedPrepTime,
      });
    });

    // Chef marks prepared
    socket.on("order:prepared", (orderData) => {
      io.to("admin").emit("order:prepared", orderData);
      io.to(`kitchen:${orderData.kitchenId}`).emit("order:prepared", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:prepared", orderData);
    });

    // Order assigned to delivery
    socket.on("order:assigned_to_delivery", (orderData) => {
      io.to(`delivery:${orderData.deliveryPersonId}`).emit("order:assigned_to_delivery", orderData);
      io.to("admin").emit("order:assigned_to_delivery", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:assigned_to_delivery", orderData);
    });

    // Delivery person picks up
    socket.on("order:picked_up", (orderData) => {
      io.to("admin").emit("order:picked_up", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:picked_up", orderData);
    });

    // Delivery in transit
    socket.on("order:in_transit", (orderData) => {
      io.to("admin").emit("order:in_transit", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:in_transit", orderData);
    });

    // Order delivered
    socket.on("order:delivered", (orderData) => {
      io.to("admin").emit("order:delivered", orderData);
      io.to(`customer:${orderData.customerId}`).emit("order:delivered", orderData);
    });

    // Issue reported
    socket.on("order:issue", (orderData) => {
      io.to("admin").emit("order:issue", orderData);
      if (orderData.chefId) {
        io.to(`chef:${orderData.chefId}`).emit("order:issue", orderData);
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 📍 DELIVERY LOCATION TRACKING
    // ═══════════════════════════════════════════════════════════════

    socket.on("delivery:location_update", (locationData) => {
      const { orderId, deliveryPersonId, latitude, longitude, address } =
        locationData;

      // Broadcast to admin
      io.to("admin").emit("delivery:location_update", locationData);

      // Broadcast to customer
      io.to(`customer:${locationData.customerId}`).emit(
        "delivery:location_update",
        {
          orderId,
          latitude,
          longitude,
          address,
          timestamp: new Date(),
        }
      );

      // Store for persistence
      console.log(`📍 Location update for order ${orderId}: ${latitude}, ${longitude}`);
    });

    // ═══════════════════════════════════════════════════════════════
    // 🍳 KITCHEN DISPLAY SYSTEM (KDS)
    // ═══════════════════════════════════════════════════════════════

    socket.on("kitchen:request_status", (kitchenId) => {
      socket.join(`kitchen:${kitchenId}`);
      // Kitchen display joins and requests current orders
      socket.emit("kitchen:status_requested", { kitchenId });
    });

    socket.on("kitchen:order_queue_update", (queueData) => {
      io.to(`kitchen:${queueData.kitchenId}`).emit(
        "kitchen:order_queue_update",
        queueData
      );
    });

    // ═══════════════════════════════════════════════════════════════
    // 👨‍💻 ADMIN DASHBOARD EVENTS
    // ═══════════════════════════════════════════════════════════════

    socket.on("admin:request_stats", () => {
      if (socket.userRole === "admin") {
        socket.emit("admin:stats_update", {
          timestamp: new Date(),
          // Stats will be populated by controller
        });
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 💬 NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════

    socket.on("notification:send", (notificationData) => {
      const { userId, type, message, data } = notificationData;
      io.to(`customer:${userId}`).emit("notification:received", {
        type,
        message,
        data,
        timestamp: new Date(),
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // 💬 REAL-TIME CHAT (Optional)
    // ═══════════════════════════════════════════════════════════════

    socket.on("chat:send", (messageData) => {
      const { orderId, message, senderId, senderRole } = messageData;
      io.to(`order:${orderId}`).emit("chat:message", {
        orderId,
        message,
        senderId,
        senderRole,
        timestamp: new Date(),
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // DISCONNECTION
    // ═══════════════════════════════════════════════════════════════

    socket.on("disconnect", () => {
      connectedUsers.delete(socket.userId.toString());
      console.log(
        `❌ User disconnected: ${socket.userId} (${socket.userRole}) - ${socket.id}`
      );

      // Notify admin when chef/delivery goes offline
      if (socket.userRole === "chef" || socket.userRole === "delivery_person") {
        io.to("admin").emit("user:offline", {
          userId: socket.userId,
          role: socket.userRole,
          name: socket.userName,
        });
      }
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

// Helper function to get user's socket ID
export function getUserSocketId(userId) {
  return connectedUsers.get(userId.toString());
}

// Helper function to broadcast to specific user
export function notifyUser(userId, eventName, data) {
  const socketId = getUserSocketId(userId);
  if (socketId && io) {
    io.to(socketId).emit(eventName, data);
  }
}

// Helper function to broadcast to all admins
export function notifyAdmins(eventName, data) {
  if (io) {
    io.to("admin").emit(eventName, data);
  }
}

// Helper function to broadcast to all chefs in kitchen
export function notifyKitchen(kitchenId, eventName, data) {
  if (io) {
    io.to(`kitchen:${kitchenId}`).emit(eventName, data);
  }
}

// Helper function to broadcast to customer
export function notifyCustomer(userId, eventName, data) {
  if (io) {
    io.to(`customer:${userId}`).emit(eventName, data);
  }
}

// Helper function to broadcast to delivery person
export function notifyDelivery(userId, eventName, data) {
  if (io) {
    io.to(`delivery:${userId}`).emit(eventName, data);
  }
}

export default { initSocket, getIO };

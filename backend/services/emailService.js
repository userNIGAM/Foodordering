import nodemailer from "nodemailer";

// Create a transporter (using Gmail as an example)
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order confirmation to customer
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order has been received and is being processed.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Order Total:</strong> $${order.total}</p>
        <h3>Items Ordered:</h3>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.name} - $${item.price} x ${item.quantity}</li>
          `
            )
            .join("")}
        </ul>
        <h3>Delivery Information:</h3>
        <p><strong>Name:</strong> ${order.customer.name}</p>
        <p><strong>Address:</strong> ${order.customer.address}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p>We will notify you when your order is on its way!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to:", order.customer.email);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

// Send notification to admin
export const sendAdminNotificationEmail = async (order) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Order Received - ${order.orderId}`,
      html: `
        <h2>New Order Notification</h2>
        <p>A new order has been placed on your website.</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Order Total:</strong> $${order.total}</p>
        <p><strong>Customer:</strong> ${order.customer.name}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <h3>Items Ordered:</h3>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.name} - $${item.price} x ${item.quantity}</li>
          `
            )
            .join("")}
        </ul>
        <p>Please check the admin dashboard for more details.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent to:", adminEmail);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};

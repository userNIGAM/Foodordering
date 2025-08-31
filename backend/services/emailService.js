import nodemailer from "nodemailer";

// Create a transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B2635;">Thank you for your order!</h2>
          <p>Your order has been received and is being processed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2E3532; margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Total:</strong> $${order.total}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
          </div>
          
          <h3 style="color: #2E3532;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #88A096; color: white;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                    item.name
                  }</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
                    item.quantity
                  }</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(
                    item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">$${
                  order.total
                }</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h3 style="color: #2E3532; margin-top: 0;">Delivery Information:</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            ${
              order.customer.specialInstructions
                ? `<p><strong>Special Instructions:</strong> ${order.customer.specialInstructions}</p>`
                : ""
            }
          </div>
          
          <p style="margin-top: 20px;">We will notify you when your order is on its way!</p>
          <p>If you have any questions, please contact us at ${
            process.env.ADMIN_EMAIL || process.env.EMAIL_USER
          }</p>
        </div>
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B2635;">New Order Notification</h2>
          <p>A new order has been placed on your website.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2E3532; margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Total:</strong> $${order.total}</p>
            <p><strong>Order Date:</strong> ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
          </div>
          
          <h3 style="color: #2E3532;">Customer Information:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            ${
              order.customer.specialInstructions
                ? `<p><strong>Special Instructions:</strong> ${order.customer.specialInstructions}</p>`
                : ""
            }
          </div>
          
          <h3 style="color: #2E3532;">Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #88A096; color: white;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                    item.name
                  }</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
                    item.quantity
                  }</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(
                    item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">$${
                  order.total
                }</td>
              </tr>
            </tfoot>
          </table>
          
          <p>Please check the admin dashboard for more details.</p>
        </div>
      `,
    };
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Error with email transporter configuration:", error);
      } else {
        console.log("Email server is ready to send messages");
      }
    });
    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent to:", adminEmail);
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};

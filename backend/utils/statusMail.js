import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendStatusEmail = async ({ to, name, oldStatus, newStatus, subject }) => {
  const mailOptions = {
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Status Update</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your status has been updated.</p>
        <p><b>Previous:</b> ${oldStatus}</p>
        <p><b>Current:</b> ${newStatus}</p>
        <br/>
        <p>If you did not request this, please contact support.</p>
        <br/>
        <p>— Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// You can use Mailtrap or Gmail SMTP. Configure via .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587/25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const fromName = process.env.FROM_NAME || "Auth Demo";
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
  });

  return info;
};

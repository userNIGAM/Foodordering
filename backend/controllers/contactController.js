import feedback from "../models/contactForm.js";
import {
  adminNotificationEmail,
  userThankYouEmail,
} from "../services/emailTemplates.js";
import { sendEmail } from "../utils/mailer.js";

export const contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Save feedback
    const Feedback = await feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // console.log("✅ Feedback saved:", Feedback);

    // Send Thank You email
    const thankYou = userThankYouEmail(name, message);
    await sendEmail({ to: email, ...thankYou });
    // console.log("✅ Thank You email sent");

    // Send Admin email
    const adminMail = adminNotificationEmail(name, email, subject, message);
    await sendEmail({ to: process.env.ADMIN_EMAIL, ...adminMail });
    // console.log("✅ Admin notification sent");

    return res.status(201).json({ message: "Feedback received & email sent" });
  } catch (err) {
    // console.error("❌ Contact error details:", err); // <-- full stack trace
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

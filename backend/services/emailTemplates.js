export const userThankYouEmail = (name, message) => ({
  subject: `Thanks for contacting us, ${name}!`,
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="color:#ff6600;">Hello ${name},</h2>
      <p>Thank you for reaching out. We’ve received your message:</p>
      <blockquote style="border-left:4px solid #ff6600;padding-left:10px;margin:10px 0;">
        ${sanitize(message)}
      </blockquote>
      <p>We’ll get back to you soon!</p>
      <br/>
      <p style="color:#ff6600;font-weight:bold;">— ORDER Team</p>
    </div>
  `,
});

export const adminNotificationEmail = (name, email, subject, message) => ({
  subject: `New Contact Form Submission: ${subject}`,
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h3>📩 New Contact Submission</h3>
      <p><strong>Name:</strong> ${sanitize(name)}</p>
      <p><strong>Email:</strong> ${sanitize(email)}</p>
      <p><strong>Subject:</strong> ${sanitize(subject)}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:4px solid #ccc;padding-left:10px;margin:10px 0;">
        ${sanitize(message)}
      </blockquote>
    </div>
  `,
});

/**
 * Simple sanitization to prevent HTML injection in emails
 */
const sanitize = (str = "") =>
  String(str).replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"));

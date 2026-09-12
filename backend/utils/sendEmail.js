const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(
    process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_SERVICE
  );
}

function buildTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

/**
 * Sends the "new contact message" notification email.
 * Never throws — if email isn't configured or sending fails, it logs a
 * warning and resolves, because the contact form must still succeed and
 * save to MongoDB either way.
 */
async function sendContactNotification(contact) {
  if (!isEmailConfigured()) {
    console.warn(
      "[email] Skipping notification email — EMAIL_SERVICE/EMAIL_USER/EMAIL_PASSWORD not set."
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    const transporter = buildTransporter();
    const to = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: contact.email,
      subject: `New message received from your portfolio: ${contact.subject}`,
      text: [
        "New message received from your portfolio.",
        "",
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        `Subject: ${contact.subject}`,
        `Date: ${new Date(contact.createdAt || Date.now()).toLocaleString()}`,
        "",
        "Message:",
        contact.message,
      ].join("\n"),
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New message received from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p>
          <p><strong>Date:</strong> ${new Date(
            contact.createdAt || Date.now()
          ).toLocaleString()}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(contact.message)}</p>
        </div>
      `,
    });

    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send notification:", err.message);
    return { sent: false, reason: "send_failed" };
  }
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { sendContactNotification, isEmailConfigured };

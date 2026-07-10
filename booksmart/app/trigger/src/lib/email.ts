import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SES_HOST!,
  port: parseInt(process.env.SES_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SES_USER!,
    pass: process.env.SES_PASS!,
  },
});

const FROM = process.env.EMAIL_FROM || "noreply@booksmart.app";

interface AppointmentData {
  id: string;
  startTime: Date;
  endTime: Date;
  client: { name: string; email: string; phone?: string };
  business: { name: string; address?: string; phone?: string };
  service?: { name: string; duration: number };
  staff?: { name: string };
}

function baseHtml(html: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${html}
      </body>
    </html>
  `;
}

export async function sendConfirmationEmail(appointment: AppointmentData): Promise<void> {
  const html = baseHtml(`
    <h1>Appointment Confirmed</h1>
    <p>Hi ${appointment.client.name},</p>
    <p>Your appointment with <strong>${appointment.business.name}</strong> has been confirmed.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleDateString()}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleTimeString()} – ${appointment.endTime.toLocaleTimeString()}</td></tr>
      ${appointment.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.service.name}</td></tr>` : ""}
      ${appointment.staff ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Staff:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.staff.name}</td></tr>` : ""}
      ${appointment.business.address ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.business.address}</td></tr>` : ""}
    </table>
    <p style="margin-top: 20px;">Need to reschedule? Contact the business at ${appointment.business.phone || appointment.business.name}.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: appointment.client.email,
    subject: `Appointment Confirmed – ${appointment.business.name}`,
    html,
  });
}

export async function sendReminder48hEmail(appointment: AppointmentData): Promise<void> {
  const html = baseHtml(`
    <h1>Reminder: Appointment in 48 Hours</h1>
    <p>Hi ${appointment.client.name},</p>
    <p>This is a friendly reminder that your appointment at <strong>${appointment.business.name}</strong> is in 2 days.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleDateString()}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleTimeString()}</td></tr>
      ${appointment.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.service.name}</td></tr>` : ""}
    </table>
    <p>Please arrive on time. To cancel or reschedule, contact the business.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: appointment.client.email,
    subject: `Reminder: Your Appointment in 48 Hours – ${appointment.business.name}`,
    html,
  });
}

export async function sendReminder24hEmail(appointment: AppointmentData): Promise<void> {
  const html = baseHtml(`
    <h1>Reminder: Appointment Tomorrow</h1>
    <p>Hi ${appointment.client.name},</p>
    <p>This is a reminder that your appointment at <strong>${appointment.business.name}</strong> is tomorrow.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleDateString()}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.startTime.toLocaleTimeString()}</td></tr>
      ${appointment.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${appointment.service.name}</td></tr>` : ""}
    </table>
    <p>See you soon! To cancel or reschedule, please contact the business.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: appointment.client.email,
    subject: `Reminder: Your Appointment Tomorrow – ${appointment.business.name}`,
    html,
  });
}

export async function sendReviewRequestEmail(appointment: AppointmentData, reviewUrls: { google?: string; yelp?: string }): Promise<void> {
  const reviewLinks = Object.entries(reviewUrls)
    .filter(([, url]) => url)
    .map(([platform, url]) => `<a href="${url}" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px;">Leave a ${platform === "google" ? "Google" : "Yelp"} Review</a>`)
    .join(" ");

  const html = baseHtml(`
    <h1>How Was Your Visit?</h1>
    <p>Hi ${appointment.client.name},</p>
    <p>We hope you enjoyed your appointment at <strong>${appointment.business.name}</strong>.</p>
    <p>We'd love to hear about your experience! Please leave us a review:</p>
    <div style="text-align: center; margin: 30px 0;">
      ${reviewLinks || "<p>Review links not available.</p>"}
    </div>
    <p>Thank you for choosing ${appointment.business.name}!</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: appointment.client.email,
    subject: `How Was Your Visit? Review ${appointment.business.name}`,
    html,
  });
}

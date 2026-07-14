import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

const FROM = process.env.EMAIL_FROM || process.env.SMTP_USER!;

export async function sendEmail(to: string, subject: string, html: string) {
  return getTransporter().sendMail({ from: FROM, to, subject, html });
}

function textToHtml(text: string): string {
  return text.replace(/\n/g, "<br>");
}

export function baseHtml(body: string): string {
  const content = textToHtml(body);
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:1.5; color:#222222; font-weight:normal;">
${content}
  </body>
</html>`;
}

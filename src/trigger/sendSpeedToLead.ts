import { task } from "@trigger.dev/sdk/v3"
import { sendEmail } from "./sendEmail"

interface SpeedToLeadPayload {
  name: string
  email: string
  service: string
  leadId: string
  businessName: string
}

function buildSpeedToLeadHtml(name: string, businessName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:40px 16px;">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
    <tr><td style="background:#fff;border-radius:12px;padding:40px 32px;">
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Thanks for reaching out!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.6;">
      Hi ${name}, we got your request. We're on it and someone will be in touch shortly.
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#71717a;">Need immediate help? Call us.</p>
    <p style="margin:0;font-size:13px;color:#71717a;">&mdash; ${businessName}</p>
    </td></tr>
    <tr><td align="center" style="padding:24px 16px 0;">
    <p style="margin:0;font-size:12px;color:#a1a1aa;">${businessName}</p>
    </td></tr>
    </table>
    </td></tr>
    </table>
    </body>
    </html>`
}

export const sendSpeedToLead = task({
  id: "send-speed-to-lead",
  run: async (payload: SpeedToLeadPayload) => {
    const { name, email, service, leadId, businessName } = payload

    const result = await sendEmail.triggerAndWait({
      to: email,
      subject: `Thanks for reaching out to ${businessName}!`,
      html: buildSpeedToLeadHtml(name, businessName),
      leadId,
      emailType: "speed-to-lead",
      businessName,
    })

    if (!result.ok) throw new Error("Speed-to-lead email failed")

    return { sent: true }
  },
})

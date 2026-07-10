import { task } from "@trigger.dev/sdk/v3"
import { createClient } from "@insforge/sdk"

interface SendEmailPayload {
  to: string
  subject: string
  html: string
  leadId?: string
  clientId?: string
  emailType: string
  businessName: string
}

export const sendEmail = task({
  id: "send-email",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    factor: 2,
    randomize: true,
  },
  run: async (payload: SendEmailPayload) => {
    const { to, subject, html, leadId, clientId, emailType, businessName } = payload

    const insforge = createClient({
      baseUrl: process.env.INSFORGE_URL!,
      anonKey: process.env.INSFORGE_ANON_KEY!,
    })

    const { error } = await insforge.emails.send({
      to,
      subject,
      html,
      from: `"${businessName}" <noreply@luminadental.com>`,
    })

    if (leadId) {
      await insforge.database.from("email_logs").insert([{
        lead_id: leadId,
        client_id: clientId || null,
        email_type: emailType,
        subject,
        recipient_email: to,
        status: error ? "failed" : "sent",
        sent_at: new Date().toISOString(),
      }])
    }

    if (error) throw new Error(`Email send failed: ${error.message}`)

    return { sent: true, to, emailType }
  },
})

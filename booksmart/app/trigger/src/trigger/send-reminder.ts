import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";
import { sendReminder48hEmail, sendReminder24hEmail } from "../lib/email";

export const sendReminder = task({
  id: "send-reminder-email",
  run: async (payload: { appointmentId: string; reminderType: "48h" | "24h" }) => {
    const { appointmentId, reminderType } = payload;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        business: true,
        service: true,
        staff: true,
      },
    });

    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    if (appointment.status === "cancelled" || appointment.status === "no-show") {
      return { success: false, reason: "Appointment cancelled or no-show" };
    }

    const emailData = {
      id: appointment.id,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      client: {
        name: appointment.client.name,
        email: appointment.client.email,
        phone: appointment.client.phone || undefined,
      },
      business: {
        name: appointment.business.name,
        address: appointment.business.address || undefined,
        phone: appointment.business.phone || undefined,
      },
      service: appointment.service
        ? { name: appointment.service.name, duration: appointment.service.duration }
        : undefined,
      staff: appointment.staff
        ? { name: appointment.staff.name }
        : undefined,
    };

    if (reminderType === "48h") {
      await sendReminder48hEmail(emailData);
    } else {
      await sendReminder24hEmail(emailData);
    }

    await prisma.emailLog.create({
      data: {
        appointmentId: appointment.id,
        type: `reminder-${reminderType}`,
        recipient: appointment.client.email,
        sentAt: new Date(),
        status: "sent",
      },
    });

    return { success: true, appointmentId, reminderType };
  },
});

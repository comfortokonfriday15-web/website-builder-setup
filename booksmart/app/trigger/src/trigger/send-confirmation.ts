import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";
import { sendConfirmationEmail } from "../lib/email";

export const sendConfirmation = task({
  id: "send-confirmation-email",
  run: async (payload: { appointmentId: string }) => {
    const { appointmentId } = payload;

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

    await sendConfirmationEmail({
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
    });

    await prisma.emailLog.create({
      data: {
        appointmentId: appointment.id,
        type: "confirmation",
        recipient: appointment.client.email,
        sentAt: new Date(),
        status: "sent",
      },
    });

    return { success: true, appointmentId };
  },
});

import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";
import { sendReviewRequestEmail } from "../lib/email";

export const sendReviewRequest = task({
  id: "send-review-request",
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

    if (appointment.status !== "completed") {
      return { success: false, reason: "Appointment not completed" };
    }

    const reviewUrls: { google?: string; yelp?: string } = {};
    if (appointment.business.googleReviewUrl) {
      reviewUrls.google = appointment.business.googleReviewUrl;
    }
    if (appointment.business.yelpReviewUrl) {
      reviewUrls.yelp = appointment.business.yelpReviewUrl;
    }

    await sendReviewRequestEmail(
      {
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
      },
      reviewUrls
    );

    await prisma.reviewRequest.create({
      data: {
        appointmentId: appointment.id,
        sentAt: new Date(),
        status: "sent",
      },
    });

    await prisma.emailLog.create({
      data: {
        appointmentId: appointment.id,
        type: "review-request",
        recipient: appointment.client.email,
        sentAt: new Date(),
        status: "sent",
      },
    });

    return { success: true, appointmentId };
  },
});

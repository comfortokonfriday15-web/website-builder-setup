import { task } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";

export const scheduler = task({
  id: "scheduler",
  cron: "0 * * * *",
  run: async () => {
    const now = new Date();

    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const remind48hWindow = new Date(in48h.getTime() + 60 * 60 * 1000);
    const remind24hWindow = new Date(in24h.getTime() + 60 * 60 * 1000);
    const completedWindow = new Date(twoHoursAgo.getTime() + 60 * 60 * 1000);

    const [appointments48h, appointments24h, completedAppointments] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          status: "confirmed",
          startTime: { gte: in48h, lt: remind48hWindow },
        },
        select: { id: true },
      }),
      prisma.appointment.findMany({
        where: {
          status: "confirmed",
          startTime: { gte: in24h, lt: remind24hWindow },
        },
        select: { id: true },
      }),
      prisma.appointment.findMany({
        where: {
          status: "completed",
          endTime: { gte: twoHoursAgo, lt: completedWindow },
        },
        select: { id: true },
      }),
    ]);

    const { triggerClient } = await import("../lib/trigger-client");

    const events: Array<{ name: string; payload: any }> = [];

    for (const apt of appointments48h) {
      events.push({
        name: "send-reminder-email",
        payload: { appointmentId: apt.id, reminderType: "48h" },
      });
    }

    for (const apt of appointments24h) {
      events.push({
        name: "send-reminder-email",
        payload: { appointmentId: apt.id, reminderType: "24h" },
      });
    }

    for (const apt of completedAppointments) {
      events.push({
        name: "send-review-request",
        payload: { appointmentId: apt.id },
      });
    }

    for (const event of events) {
      try {
        await triggerClient.sendEvent(event);
      } catch (err) {
        console.error(`Failed to send event ${event.name} for appointment:`, err);
      }
    }

    return {
      reminders48h: appointments48h.length,
      reminders24h: appointments24h.length,
      reviewRequests: completedAppointments.length,
    };
  },
});

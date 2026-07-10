import { useCallback } from "react";
import { useBookingContext } from "@/lib/booking-store";
import { post } from "@/lib/api";
import type { CreateAppointmentPayload } from "@/lib/api";

export function useBooking() {
  const ctx = useBookingContext();

  const submitAppointment = useCallback(async () => {
    const { state } = ctx;
    if (!state.service || !state.staff || !state.dateTime || !state.client) {
      throw new Error("Incomplete booking state");
    }

    const payload: CreateAppointmentPayload = {
      business_id: state.service.business_id,
      staff_id: state.staff.id,
      service_id: state.service.id,
      start_time: `${state.dateTime.date}T${state.dateTime.startTime}`,
      end_time: `${state.dateTime.date}T${state.dateTime.endTime}`,
      client_name: state.client.name,
      client_email: state.client.email,
      client_phone: state.client.phone || undefined,
      intake_answers: state.intakeAnswers as Record<string, unknown>,
      waiver_signature: state.signature || undefined,
    };

    return post<{ id: string }>("/appointments", payload);
  }, [ctx]);

  const isStepComplete = useCallback(
    (step: number): boolean => {
      const { state } = ctx;
      switch (step) {
        case 0:
          return !!state.service;
        case 1:
          return !!state.staff;
        case 2:
          return !!state.dateTime;
        case 3:
          return !!state.client?.name && !!state.client?.email;
        case 4:
          return true;
        case 5:
          return !!state.signature;
        default:
          return false;
      }
    },
    [ctx]
  );

  return {
    ...ctx,
    submitAppointment,
    isStepComplete,
  };
}

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CheckCircle, Calendar, Home } from "lucide-react";
import { useBookingContext } from "@/lib/booking-store";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function generateIcsContent(
  startTime: string,
  endTime: string,
  summary: string,
  description: string,
  location: string
): string {
  const formatIcal = (d: string) => {
    const dt = new Date(d);
    return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BookSmart//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatIcal(startTime)}`,
    `DTEND:${formatIcal(endTime)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingConfirmation() {
  const { state, reset } = useBookingContext();
  const navigate = useNavigate();
  const { businessSlug } = useParams<{ businessSlug: string }>();

  useEffect(() => {
    if (!state.service || !state.staff || !state.dateTime) {
      navigate(`/book/${businessSlug}`, { replace: true });
    }
  }, []);

  if (!state.service || !state.staff || !state.dateTime || !state.client) {
    return null;
  }

  const startDateTime = `${state.dateTime.date}T${state.dateTime.startTime}`;
  const endDateTime = `${state.dateTime.date}T${state.dateTime.endTime}`;

  const handleAddToCalendar = () => {
    const icsContent = generateIcsContent(
      startDateTime,
      endDateTime,
      `${state.service.name} at ${state.business?.name || "Appointment"}`,
      `Appointment with ${state.staff.name}\nService: ${state.service.name}`,
      state.business?.address || ""
    );

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointment.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReturnHome = () => {
    reset(businessSlug);
    navigate(`/book/${businessSlug}`, { replace: true });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center py-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your appointment has been scheduled successfully.
        </p>
      </motion.div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Appointment Details
            </h3>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {format(parseISO(startDateTime), "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500">
                  {format(parseISO(startDateTime), "h:mm a")} &mdash;{" "}
                  {format(parseISO(endDateTime), "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-primary-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{state.service.name}</p>
                <p className="text-sm text-gray-500">
                  {state.service.duration_minutes} min
                  {state.service.price_cents != null &&
                    ` · $${(state.service.price_cents / 100).toFixed(2)}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar
                src={state.staff.photo_url}
                name={state.staff.name}
                size="sm"
              />
              <div>
                <p className="font-medium text-gray-900">{state.staff.name}</p>
                {state.staff.title && (
                  <p className="text-sm text-gray-500">{state.staff.title}</p>
                )}
              </div>
            </div>

            {state.business?.address && (
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-600">{state.business.address}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Confirmation sent to
            </h3>
            <p className="text-sm text-gray-700">{state.client.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={handleAddToCalendar} className="flex-1">
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
        <Button onClick={handleReturnHome} className="flex-1">
          <Home className="mr-2 h-4 w-4" />
          Book Another
        </Button>
      </div>
    </div>
  );
}

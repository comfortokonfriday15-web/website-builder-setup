export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  NO_SHOW: "no_show",
  CANCELLED: "cancelled",
  BLOCKED: "blocked",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const APPOINTMENT_LENGTH_MINUTES = [15, 30, 45, 60, 90, 120] as const;

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  checked_in: "bg-indigo-100 text-indigo-800 border-indigo-300",
  in_progress: "bg-cyan-100 text-cyan-800 border-cyan-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  no_show: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
  blocked: "bg-orange-100 text-orange-800 border-orange-300",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  in_progress: "In Progress",
  completed: "Completed",
  no_show: "No-Show",
  cancelled: "Cancelled",
  blocked: "Blocked",
};

export const BOOKING_STEPS = [
  "Service",
  "Staff",
  "Date & Time",
  "Your Info",
  "Intake Form",
  "Signature",
  "Confirmation",
] as const;

export const BUSINESS_HOURS_DEFAULTS = {
  start: "09:00",
  end: "17:00",
  days: [1, 2, 3, 4, 5],
};

export const CANCELLATION_WINDOW_MINUTES = 60;

export const REMINDER_TIMING_HOURS = [24, 2, 1] as const;

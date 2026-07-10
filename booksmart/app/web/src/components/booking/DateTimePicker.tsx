import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDays,
  startOfWeek,
  format,
  isSameDay,
  addWeeks,
  subWeeks,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useBookingContext } from "@/lib/booking-store";
import { useAvailability } from "@/hooks/useAvailability";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DateTimePicker() {
  const { state, selectTime, nextStep, prevStep } = useBookingContext();
  const { slots, loading: slotsLoading, fetchAvailability } = useAvailability();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const weeksToShow = 4;

  useEffect(() => {
    if (state.staff && selectedDate) {
      fetchAvailability(
        state.staff.id,
        selectedDate,
        state.service?.duration_minutes || 60
      );
    }
  }, [state.staff, selectedDate, state.service?.duration_minutes, fetchAvailability]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getDatesForWeek = (weekStart: Date) =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const visibleWeeks = Array.from({ length: weeksToShow }, (_, i) =>
    addDays(currentWeekStart, i * 7)
  );

  const isDateDisabled = (date: Date) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return date < todayStart;
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
  };

  const handleTimeSelect = (date: string, startTime: string, endTime: string) => {
    selectTime(date, startTime, endTime);
    nextStep();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Select Date & Time</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pick a date and available time slot.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, weeksToShow))}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {format(visibleWeeks[0], "MMM d")} &ndash;{" "}
              {format(addDays(visibleWeeks[visibleWeeks.length - 1], 6), "MMM d, yyyy")}
            </span>
            <button
              onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, weeksToShow))}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWeekStart.toISOString()}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-1"
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
                {visibleWeeks.flatMap((weekStart) => {
                  const days = getDatesForWeek(weekStart);
                  return days.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const disabled = isDateDisabled(date);
                    const isSelected = selectedDate === dateStr;
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        key={dateStr}
                        disabled={disabled}
                        onClick={() => handleDateSelect(dateStr)}
                        className={`rounded-lg py-2 text-sm transition-all ${
                          disabled
                            ? "cursor-not-allowed text-gray-300"
                            : isSelected
                              ? "bg-primary-600 text-white shadow-sm"
                              : isToday
                                ? "bg-primary-50 text-primary-700 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {format(date, "d")}
                      </button>
                    );
                  });
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Available times for {format(parseISO(selectedDate), "EEEE, MMMM d")}
            </h3>
            {slotsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
              </div>
            ) : slots.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No available times for this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => {
                  const isAvailable = slot.available;
                  return (
                    <button
                      key={`${slot.start_time}-${slot.staff_id}`}
                      disabled={!isAvailable}
                      onClick={() =>
                        handleTimeSelect(selectedDate, slot.start_time, slot.end_time)
                      }
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                        isAvailable
                          ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100 hover:border-green-400"
                          : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {slot.start_time.slice(0, 5)}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={prevStep}
          className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}

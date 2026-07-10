import { useState, useEffect } from "react";
import { format, parseISO, addDays, startOfWeek } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Ban,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { get, put } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import type { Appointment, BookingStatus } from "@/lib/api";

type ViewMode = "day" | "week" | "month";

const statusActions: { status: BookingStatus; label: string; icon: React.ReactNode }[] = [
  { status: "checked_in", label: "Check In", icon: <UserCheck className="h-4 w-4" /> },
  { status: "no_show", label: "Mark No-Show", icon: <Ban className="h-4 w-4" /> },
  { status: "completed", label: "Complete", icon: <Check className="h-4 w-4" /> },
  { status: "cancelled", label: "Cancel", icon: <X className="h-4 w-4" /> },
];

export function SchedulePage() {
  const [view, setView] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const dateStr = format(currentDate, "yyyy-MM-dd");
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);

        let endpoint = `/appointments?`;
        if (view === "day") {
          endpoint += `date=${dateStr}`;
        } else if (view === "week") {
          endpoint += `date_from=${format(weekStart, "yyyy-MM-dd")}&date_to=${format(weekEnd, "yyyy-MM-dd")}`;
        } else {
          const monthStart = format(currentDate, "yyyy-MM") + "-01";
          const monthEnd = format(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
            "yyyy-MM-dd"
          );
          endpoint += `date_from=${monthStart}&date_to=${monthEnd}`;
        }

        const data = await get<Appointment[]>(endpoint);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [view, currentDate]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await put(`/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selectedAppointment?.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const navigate = (direction: "prev" | "next") => {
    const multiplier = direction === "next" ? 1 : -1;
    if (view === "day") {
      setCurrentDate((d) => addDays(d, multiplier));
    } else if (view === "week") {
      setCurrentDate((d) => addDays(d, multiplier * 7));
    } else {
      setCurrentDate(
        (d) => new Date(d.getFullYear(), d.getMonth() + multiplier, 1)
      );
    }
  };

  const getHeaderLabel = () => {
    switch (view) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "week":
        const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700">{getHeaderLabel()}</span>
        <Button variant="outline" size="sm" onClick={() => navigate("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              No appointments found.
            </p>
          ) : (
            <div className="space-y-2">
              {appointments
                .sort(
                  (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                )
                .map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className="flex w-full items-center gap-4 rounded-lg border border-gray-100 p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-[80px] text-center">
                      <p className="text-sm font-bold text-gray-900">
                        {format(parseISO(apt.start_time), "h:mm a")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(apt.end_time), "h:mm a")}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {apt.client_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {apt.client_email}
                      </p>
                    </div>
                    <Badge
                      className={STATUS_COLORS[apt.status as BookingStatus]}
                    >
                      {STATUS_LABELS[apt.status as BookingStatus]}
                    </Badge>
                  </button>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>
            {selectedAppointment && (
              <span>
                {format(parseISO(selectedAppointment.start_time), "MMMM d, yyyy")} at{" "}
                {format(parseISO(selectedAppointment.start_time), "h:mm a")}
              </span>
            )}
          </DialogDescription>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.client_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.client_email}
                  </p>
                </div>
                {selectedAppointment.client_phone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.client_phone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Status</p>
                  <Badge
                    className={STATUS_COLORS[selectedAppointment.status as BookingStatus]}
                  >
                    {STATUS_LABELS[selectedAppointment.status as BookingStatus]}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.intake_answers &&
                Object.keys(selectedAppointment.intake_answers).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Intake Answers
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      {Object.entries(selectedAppointment.intake_answers).map(
                        ([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key}:</span>{" "}
                            {Array.isArray(value) ? value.join(", ") : String(value)}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}

              {selectedAppointment.waiver_signature_url && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Waiver</p>
                  <a
                    href={selectedAppointment.waiver_signature_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    View signed waiver
                  </a>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {statusActions.map((action) => (
                  <Button
                    key={action.status}
                    size="sm"
                    variant={
                      action.status === "completed"
                        ? "primary"
                        : action.status === "cancelled" || action.status === "no_show"
                          ? "danger"
                          : "outline"
                    }
                    onClick={() =>
                      handleStatusChange(selectedAppointment.id, action.status)
                    }
                    disabled={selectedAppointment.status === action.status}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

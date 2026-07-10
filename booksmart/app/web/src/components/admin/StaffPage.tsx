import { useState, useEffect } from "react";
import { Plus, Clock } from "lucide-react";
import { useStaff } from "@/hooks/useStaff";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import type { Staff } from "@/lib/api";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const defaultWeeklyHours: Record<string, { start: string; end: string } | null> = {
  monday: { start: "09:00", end: "17:00" },
  tuesday: { start: "09:00", end: "17:00" },
  wednesday: { start: "09:00", end: "17:00" },
  thursday: { start: "09:00", end: "17:00" },
  friday: { start: "09:00", end: "17:00" },
  saturday: null,
  sunday: null,
};

const sampleBusinessId = "current";

export function StaffPage() {
  const { staffList, loading, fetchStaff, createStaff, updateStaff, deleteStaff } =
    useStaff(sampleBusinessId);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    photo_url: "",
    is_active: true,
    weekly_hours: { ...defaultWeeklyHours },
    buffer_minutes: 0,
    blackout_dates: [] as string[],
  });
  const { toast } = useToast();

  const openCreate = () => {
    setEditingStaff(null);
    setForm({
      name: "",
      title: "",
      email: "",
      phone: "",
      photo_url: "",
      is_active: true,
      weekly_hours: { ...defaultWeeklyHours },
      buffer_minutes: 0,
      blackout_dates: [],
    });
    setShowModal(true);
  };

  const openEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setForm({
      name: staff.name,
      title: staff.title || "",
      email: staff.email || "",
      phone: staff.phone || "",
      photo_url: staff.photo_url || "",
      is_active: staff.is_active,
      weekly_hours: staff.weekly_hours || { ...defaultWeeklyHours },
      buffer_minutes: staff.buffer_minutes,
      blackout_dates: staff.blackout_dates || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast("Staff name is required", undefined, "error");
      return;
    }
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, form);
        toast("Staff updated", undefined, "success");
      } else {
        await createStaff(form);
        toast("Staff created", undefined, "success");
      }
      setShowModal(false);
      fetchStaff();
    } catch {
      toast("Failed to save staff", undefined, "error");
    }
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      weekly_hours: {
        ...f.weekly_hours,
        [day]: f.weekly_hours[day] ? null : { start: "09:00", end: "17:00" },
      },
    }));
  };

  const updateDayHours = (day: string, field: "start" | "end", value: string) => {
    const current = form.weekly_hours[day];
    if (current) {
      setForm((f) => ({
        ...f,
        weekly_hours: {
          ...f.weekly_hours,
          [day]: { ...current, [field]: value },
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your team members.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : staffList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-gray-500">No staff members yet. Add your team.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staffList.map((staff) => (
            <Card key={staff.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={staff.photo_url}
                    name={staff.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{staff.name}</h3>
                    {staff.title && (
                      <p className="text-sm text-gray-500 truncate">{staff.title}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        variant={staff.is_active ? "success" : "default"}
                      >
                        {staff.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {staff.buffer_minutes} min buffer
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(staff)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (confirm("Remove this staff member?")) {
                        try {
                          await deleteStaff(staff.id);
                          toast("Staff removed", undefined, "success");
                        } catch {
                          toast("Failed to remove staff", undefined, "error");
                        }
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            {editingStaff ? "Edit Staff" : "Add Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {editingStaff ? "Update the staff details below." : "Enter the details for the new staff member."}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Title"
              placeholder="e.g. Senior Dentist"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="Photo URL"
              value={form.photo_url}
              onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Buffer Time (minutes)
              </label>
              <Input
                type="number"
                min="0"
                max="60"
                value={form.buffer_minutes}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    buffer_minutes: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Weekly Hours
              </label>
              <div className="space-y-2">
                {WEEKDAYS.map((day) => {
                  const hours = form.weekly_hours[day];
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`shrink-0 rounded px-2 py-1 text-xs font-medium capitalize ${
                          hours
                            ? "bg-primary-100 text-primary-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                      {hours ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateDayHours(day, "start", e.target.value)}
                            className="h-8 w-20 rounded border border-gray-300 px-2 text-xs"
                          />
                          <span className="text-xs text-gray-400">to</span>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateDayHours(day, "end", e.target.value)}
                            className="h-8 w-20 rounded border border-gray-300 px-2 text-xs"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Day off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingStaff ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

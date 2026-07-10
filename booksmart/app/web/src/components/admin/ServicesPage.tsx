import { useState } from "react";
import { Plus, Clock, DollarSign, ToggleLeft, ToggleRight } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { APPOINTMENT_LENGTH_MINUTES } from "@/lib/constants";
import type { Service } from "@/lib/api";

const sampleBusinessId = "current";

export function ServicesPage() {
  const { services, loading, fetchServices, createService, updateService, deleteService } =
    useServices(sampleBusinessId);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: 60,
    price_cents: 0,
    is_active: true,
  });
  const { toast } = useToast();

  const openCreate = () => {
    setEditingService(null);
    setForm({ name: "", description: "", duration_minutes: 60, price_cents: 0, is_active: true });
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || "",
      duration_minutes: service.duration_minutes,
      price_cents: service.price_cents || 0,
      is_active: service.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast("Service name is required", undefined, "error");
      return;
    }
    try {
      if (editingService) {
        await updateService(editingService.id, form);
        toast("Service updated", undefined, "success");
      } else {
        await createService(form);
        toast("Service created", undefined, "success");
      }
      setShowModal(false);
      fetchServices();
    } catch {
      toast("Failed to save service", undefined, "error");
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { is_active: !service.is_active });
      fetchServices();
    } catch {
      toast("Failed to update service", undefined, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your service offerings.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-gray-500">No services yet. Create your first service.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{service.name}</h3>
                    {service.description && (
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration_minutes} min
                      </span>
                      {service.price_cents != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          ${(service.price_cents / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`p-1 rounded ${
                      service.is_active ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {service.is_active ? (
                      <ToggleRight className="h-6 w-6" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (confirm("Delete this service?")) {
                        try {
                          await deleteService(service.id);
                          toast("Service deleted", undefined, "success");
                        } catch {
                          toast("Failed to delete service", undefined, "error");
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {service.intake_template && service.intake_template.length > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    {service.intake_template.length} intake field(s)
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogTitle>
            {editingService ? "Edit Service" : "Add Service"}
          </DialogTitle>
          <DialogDescription>
            {editingService
              ? "Update the service details below."
              : "Fill in the details for your new service."}
          </DialogDescription>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Service Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="flex min-h-[60px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <Select
                  value={String(form.duration_minutes)}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, duration_minutes: Number(val) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_LENGTH_MINUTES.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                label="Price ($)"
                type="number"
                min="0"
                step="0.01"
                value={form.price_cents > 0 ? (form.price_cents / 100).toFixed(2) : ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price_cents: Math.round(parseFloat(e.target.value || "0") * 100),
                  }))
                }
              />
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
                {editingService ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { z } from "zod";
import { useBookingContext } from "@/lib/booking-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { get } from "@/lib/api";
import type { Client } from "@/lib/api";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export function ClientInfoForm() {
  const { state, setClient, setMatchingClient, nextStep, prevStep } = useBookingContext();
  const [form, setForm] = useState<ClientFormData>({
    name: state.client?.name || "",
    email: state.client?.email || "",
    phone: state.client?.phone || "",
    address: state.client?.address || "",
    dateOfBirth: state.client?.dateOfBirth || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    if (!form.email || form.email === state.client?.email) return;
    const timer = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const clients = await get<Client[]>(`/clients?email=${encodeURIComponent(form.email)}`);
        if (clients.length > 0) {
          setMatchingClient(clients[0]);
          setForm({
            name: clients[0].name,
            email: clients[0].email,
            phone: clients[0].phone || "",
            address: clients[0].address || "",
            dateOfBirth: clients[0].date_of_birth || "",
          });
        } else {
          setMatchingClient(null);
        }
      } catch {
        setMatchingClient(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.email, state.client?.email, setMatchingClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = clientSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ClientFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ClientFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setClient(form);
    nextStep();
  };

  const updateField = (field: keyof ClientFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          We need a few details to confirm your booking.
        </p>
      </div>

      {state.matchingClient && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
          Welcome back, {state.matchingClient.name}! We've pre-filled your details.
        </div>
      )}

      <Input
        label="Full Name"
        required
        placeholder="John Doe"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        error={errors.name}
      />

      <Input
        label="Email Address"
        type="email"
        required
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        error={errors.email}
      />
      {checkingEmail && (
        <p className="text-xs text-gray-400">Checking for existing account...</p>
      )}

      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        error={errors.phone}
      />

      <Input
        label="Address"
        placeholder="123 Main St, City, State"
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
        error={errors.address}
      />

      <Input
        label="Date of Birth"
        type="date"
        value={form.dateOfBirth}
        onChange={(e) => updateField("dateOfBirth", e.target.value)}
        error={errors.dateOfBirth}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          Back
        </Button>
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
}

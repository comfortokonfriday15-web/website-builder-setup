import { useState, useEffect } from "react";
import { get, put } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Business, SubscriptionInfo } from "@/lib/api";

export function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    timezone: "America/New_York",
    logo_url: "",
    reminder_timing_hours: "24,2,1",
    cancellation_window_minutes: "60",
    review_links_google: "",
    review_links_yelp: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const biz = await get<Business>("/businesses/current");
        setBusiness(biz);
        setForm({
          name: biz.name,
          address: biz.address || "",
          phone: biz.phone || "",
          email: biz.email || "",
          timezone: biz.timezone,
          logo_url: biz.logo_url || "",
          reminder_timing_hours:
            biz.booking_settings?.reminder_timing_hours.join(",") || "24,2,1",
          cancellation_window_minutes:
            String(biz.booking_settings?.cancellation_window_minutes || 60),
          review_links_google: biz.review_links?.google || "",
          review_links_yelp: biz.review_links?.yelp || "",
        });

        try {
          const sub = await get<SubscriptionInfo>("/subscription");
          setSubscription(sub);
        } catch {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address || null,
        phone: form.phone || null,
        email: form.email || null,
        timezone: form.timezone,
        logo_url: form.logo_url || null,
        booking_settings: {
          reminder_timing_hours: form.reminder_timing_hours
            .split(",")
            .map((h) => parseInt(h.trim()))
            .filter((n) => !isNaN(n)),
          cancellation_window_minutes: parseInt(form.cancellation_window_minutes) || 60,
        },
        review_links: {
          google: form.review_links_google || undefined,
          yelp: form.review_links_yelp || undefined,
        },
      };

      await put("/businesses/current", payload);
      toast("Settings saved", "Your business settings have been updated.", "success");
    } catch {
      toast("Failed to save", "Something went wrong while saving settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your business profile and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Profile</CardTitle>
            <CardDescription>
              Your business information displayed to clients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Business Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <Input
              label="Logo URL"
              placeholder="https://example.com/logo.png"
              value={form.logo_url}
              onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
            />
            {form.logo_url && (
              <img
                src={form.logo_url}
                alt="Logo preview"
                className="h-16 rounded-lg border object-contain"
              />
            )}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Settings</CardTitle>
            <CardDescription>
              Configure reminders, cancellation policy, and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Reminder Timing (hours before, comma-separated)"
              placeholder="24, 2, 1"
              value={form.reminder_timing_hours}
              onChange={(e) =>
                setForm((f) => ({ ...f, reminder_timing_hours: e.target.value }))
              }
            />
            <Input
              label="Cancellation Window (minutes before appointment)"
              type="number"
              min="0"
              value={form.cancellation_window_minutes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  cancellation_window_minutes: e.target.value,
                }))
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review Links</CardTitle>
            <CardDescription>
              Links for clients to leave reviews after their appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Google Review URL"
              placeholder="https://g.page/r/..."
              value={form.review_links_google}
              onChange={(e) =>
                setForm((f) => ({ ...f, review_links_google: e.target.value }))
              }
            />
            <Input
              label="Yelp Review URL"
              placeholder="https://yelp.com/biz/..."
              value={form.review_links_yelp}
              onChange={(e) =>
                setForm((f) => ({ ...f, review_links_yelp: e.target.value }))
              }
            />
          </CardContent>
        </Card>

        {subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription</CardTitle>
              <CardDescription>
                Your current plan and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Plan</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {subscription.plan}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize text-green-600">
                    {subscription.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Billing Amount</p>
                  <p className="font-medium text-gray-900">
                    ${(subscription.billing_amount_cents / 100).toFixed(2)}/mo
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Current Period End</p>
                  <p className="font-medium text-gray-900">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

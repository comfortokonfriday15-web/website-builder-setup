import { useState, useEffect } from "react";
import { get } from "@/lib/api";
import type { Business, Service, Staff } from "@/lib/api";

export function useBusiness(slug: string | undefined) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function fetchBusiness() {
      try {
        setLoading(true);
        setError(null);

        const [biz, svcs, staff] = await Promise.all([
          get<Business>(`/businesses/slug/${slug}`),
          get<Service[]>(`/businesses/slug/${slug}/services`),
          get<Staff[]>(`/businesses/slug/${slug}/staff`),
        ]);

        if (!cancelled) {
          setBusiness(biz);
          setServices(svcs.filter((s) => s.is_active));
          setStaffList(staff.filter((s) => s.is_active));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load business");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBusiness();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { business, services, staffList, loading, error };
}

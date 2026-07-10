import { useState, useCallback } from "react";
import { get, post, put, del } from "@/lib/api";
import type { Service } from "@/lib/api";

export function useServices(businessId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await get<Service[]>(`/businesses/${businessId}/services`);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const createService = useCallback(
    async (payload: Partial<Service>) => {
      if (!businessId) return;
      const created = await post<Service>(`/businesses/${businessId}/services`, payload);
      setServices((prev) => [...prev, created]);
      return created;
    },
    [businessId]
  );

  const updateService = useCallback(
    async (id: string, payload: Partial<Service>) => {
      const updated = await put<Service>(`/services/${id}`, payload);
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    },
    []
  );

  const deleteService = useCallback(async (id: string) => {
    await del(`/services/${id}`);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
}

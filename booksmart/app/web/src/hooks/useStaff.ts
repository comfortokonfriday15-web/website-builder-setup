import { useState, useCallback } from "react";
import { get, post, put, del } from "@/lib/api";
import type { Staff } from "@/lib/api";

export function useStaff(businessId?: string) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await get<Staff[]>(`/businesses/${businessId}/staff`);
      setStaffList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const createStaff = useCallback(
    async (payload: Partial<Staff>) => {
      if (!businessId) return;
      const created = await post<Staff>(`/businesses/${businessId}/staff`, payload);
      setStaffList((prev) => [...prev, created]);
      return created;
    },
    [businessId]
  );

  const updateStaff = useCallback(
    async (id: string, payload: Partial<Staff>) => {
      const updated = await put<Staff>(`/staff/${id}`, payload);
      setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    },
    []
  );

  const deleteStaff = useCallback(async (id: string) => {
    await del(`/staff/${id}`);
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    staffList,
    loading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
}

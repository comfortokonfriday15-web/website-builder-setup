import { useState, useCallback } from "react";
import { get } from "@/lib/api";
import type { TimeSlot } from "@/lib/api";

export function useAvailability() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(
    async (staffId: string, date: string, serviceDuration: number) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          staff_id: staffId,
          date,
          duration_minutes: String(serviceDuration),
        });
        const data = await get<TimeSlot[]>(`/availability?${params}`);
        setSlots(data);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load availability");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    slots,
    loading,
    error,
    fetchAvailability,
  };
}

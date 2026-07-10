import { useState, useCallback } from "react";
import { get, post, del } from "@/lib/api";
import type { Client, PaginatedResponse } from "@/lib/api";

interface UseClientsOptions {
  page?: number;
  perPage?: number;
  search?: string;
}

export function useClients(options?: UseClientsOptions) {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(
    async (opts?: UseClientsOptions) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (opts?.page) params.set("page", String(opts.page));
        if (opts?.perPage) params.set("per_page", String(opts.perPage));
        if (opts?.search) params.set("search", opts.search);

        const res = await get<PaginatedResponse<Client>>(`/clients?${params}`);
        setClients(res.data);
        setTotal(res.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load clients");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteClient = useCallback(async (id: string) => {
    await del(`/clients/${id}`);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const mergeClients = useCallback(async (targetId: string, sourceId: string) => {
    await post(`/clients/${targetId}/merge`, { source_id: sourceId });
    await fetchClients(options);
  }, [fetchClients, options]);

  return {
    clients,
    total,
    loading,
    error,
    fetchClients,
    deleteClient,
    mergeClients,
  };
}

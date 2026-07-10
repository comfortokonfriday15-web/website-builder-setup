import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { Search, ArrowUpDown } from "lucide-react";
import { get, del } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import type { Client, PaginatedResponse } from "@/lib/api";

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [mergeTarget, setMergeTarget] = useState("");
  const { toast } = useToast();
  const perPage = 20;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });
      if (search) params.set("search", search);

      const res = await get<PaginatedResponse<Client>>(`/clients?${params}`);
      setClients(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    try {
      await del(`/clients/${id}`);
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast("Client deleted", undefined, "success");
    } catch {
      toast("Failed to delete client", undefined, "error");
    }
  };

  const handleMerge = async () => {
    if (!selectedClient || !mergeTarget) return;
    try {
      const { post } = await import("@/lib/api");
      await post(`/clients/${selectedClient.id}/merge`, {
        source_id: mergeTarget,
      });
      toast("Clients merged", undefined, "success");
      setMergeTarget("");
      fetchClients();
    } catch {
      toast("Failed to merge clients", undefined, "error");
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">{total} total clients</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : clients.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No clients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Name <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Phone</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Last Visit</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Visits</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={client.name} size="sm" />
                          <span className="font-medium text-gray-900">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{client.email}</td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {client.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {client.updated_at
                          ? format(parseISO(client.updated_at), "MMM d, yyyy")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">—</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            client.tags.map((tag) => (
                              <Badge key={tag} variant="default">
                                {tag}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Client Details</DialogTitle>
          <DialogDescription>View and manage client information.</DialogDescription>

          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar name={selectedClient.name} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedClient.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedClient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{selectedClient.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{selectedClient.address || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {selectedClient.date_of_birth
                      ? format(parseISO(selectedClient.date_of_birth), "MMM d, yyyy")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Client Since</p>
                  <p className="font-medium">
                    {format(parseISO(selectedClient.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Merge Duplicate Clients
                </h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter client ID to merge into this record"
                    value={mergeTarget}
                    onChange={(e) => setMergeTarget(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMerge}
                    disabled={!mergeTarget}
                  >
                    Merge
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(selectedClient.id)}
                >
                  Delete Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

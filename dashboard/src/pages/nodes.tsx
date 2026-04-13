import { useEffect, useMemo, useState } from "react";
import { Cloud, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddCloudNodeSheet } from "@/components/nodes/add-cloud-node-sheet";
import { NodeCard } from "@/components/nodes/node-card";
import { useClusters } from "@/context/cluster-context";
import { useClusterNodes } from "@/hooks/use-cluster-nodes";
import { api } from "@/lib/api";
import type { Node, NodeStatus } from "@/types";

type StatusFilter = "all" | NodeStatus;

export function NodesPage() {
  const { currentCluster, loading: clustersLoading } = useClusters();
  const clusterId = currentCluster?.id ?? null;
  const { nodes, loading, error, refresh, setNodes } =
    useClusterNodes(clusterId);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setQuery("");
    setStatus("all");
  }, [clusterId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nodes.filter((n) => {
      if (status !== "all" && n.status !== status) return false;
      if (!q) return true;
      return (
        n.name.toLowerCase().includes(q) ||
        n.region.toLowerCase().includes(q) ||
        n.provider.toLowerCase().includes(q) ||
        (n.ip_address?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [nodes, query, status]);

  const handleDrain = async (node: Node) => {
    if (!clusterId) return;
    try {
      const updated = await api.drainNode(clusterId, node.id);
      setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (node: Node) => {
    if (!clusterId) return;
    try {
      await api.removeNode(clusterId, node.id);
      setNodes((prev) => prev.filter((n) => n.id !== node.id));
    } catch (e) {
      console.error(e);
    }
  };

  if (clustersLoading) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
        Loading clusters…
      </div>
    );
  }

  if (!currentCluster) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
        No cluster selected. Create one from the cluster switcher.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Nodes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compute nodes joined to{" "}
            <span className="font-mono text-foreground">
              {currentCluster.name}
            </span>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="size-4" /> Register existing machine
          </Button>
          <Button onClick={() => setSheetOpen(true)}>
            <Cloud className="size-4" /> Add cloud node
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
          {error}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name, region, provider, or IP…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="draining">Draining</SelectItem>
            <SelectItem value="provisioning">Provisioning</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto font-mono text-[11px] text-muted-foreground">
          {filtered.length} of {nodes.length}
        </div>
      </div>

      {/* Node list */}
      <div className="flex flex-col gap-3">
        {loading && nodes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
            Loading nodes…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
            {nodes.length === 0
              ? "This cluster has no nodes yet. Add one to get started."
              : "No nodes match the current filter."}
          </div>
        ) : (
          filtered.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              onDrain={handleDrain}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      <AddCloudNodeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        clusterId={clusterId}
        onProvisioned={refresh}
      />
    </div>
  );
}

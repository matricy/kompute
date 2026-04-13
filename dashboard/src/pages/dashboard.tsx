import { Activity, Box, Cpu, MemoryStick, Server } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ClusterHealth } from "@/components/dashboard/cluster-health";
import { StatCard } from "@/components/dashboard/stat-card";
import { useClusters } from "@/context/cluster-context";
import { useActivity } from "@/hooks/use-activity";
import { useClusterNodes } from "@/hooks/use-cluster-nodes";

export function DashboardPage() {
  const { currentCluster, loading: clustersLoading } = useClusters();
  const { nodes, loading: nodesLoading, error } = useClusterNodes(
    currentCluster?.id ?? null
  );
  const {
    entries: activityEntries,
    loading: activityLoading,
    error: activityError,
  } = useActivity(currentCluster?.id ?? null);

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

  const totalNodes = nodes.length;
  const activeWorkloads = nodes.reduce((sum, n) => sum + n.workload_count, 0);
  const liveNodes = nodes.filter(
    (n) => n.status === "online" || n.status === "draining"
  );
  const cpuAvg =
    liveNodes.length === 0
      ? 0
      : liveNodes.reduce((s, n) => s + n.cpu_percent, 0) / liveNodes.length;
  const memTotal = nodes.reduce((s, n) => s + n.memory_gb, 0);
  const memUsed = nodes.reduce((s, n) => s + n.memory_used_gb, 0);
  const onlineCount = nodes.filter((n) => n.status === "online").length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time status of your self-hosted compute fleet.
          </p>
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          cluster · {currentCluster.name}
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Nodes"
          value={nodesLoading ? "…" : totalNodes.toString()}
          icon={Server}
          trend={`${onlineCount} online`}
          trendDirection="up"
        />
        <StatCard
          label="Active Workloads"
          value={nodesLoading ? "…" : activeWorkloads.toString()}
          icon={Box}
          trend="+2 in the last hour"
          trendDirection="up"
        />
        <StatCard
          label="CPU Utilization"
          value={nodesLoading ? "…" : cpuAvg.toFixed(1)}
          unit="%"
          icon={Cpu}
          trend="avg across online nodes"
        />
        <StatCard
          label="Memory Used"
          value={nodesLoading ? "…" : memUsed.toFixed(1)}
          unit={`/ ${memTotal.toFixed(0)} GB`}
          icon={MemoryStick}
          trend={
            memTotal > 0
              ? `${((memUsed / memTotal) * 100).toFixed(1)}% of pool`
              : "no memory reported"
          }
        />
      </div>

      {/* Cluster health */}
      <Card>
        <CardContent className="p-5">
          <ClusterHealth nodeCount={totalNodes} />
        </CardContent>
      </Card>

      {/* Activity */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Activity className="size-4 text-muted-foreground" />
            Recent activity
          </CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground">
            {activityEntries.length > 0
              ? `${activityEntries.length} entries`
              : ""}
          </span>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            entries={activityEntries}
            loading={activityLoading}
            error={activityError}
          />
        </CardContent>
      </Card>
    </div>
  );
}

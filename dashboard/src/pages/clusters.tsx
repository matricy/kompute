import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Plus, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClusters } from "@/context/cluster-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ClusterStatus } from "@/types";

const statusLabels: Record<ClusterStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  provisioning: "Provisioning",
};

const statusDot: Record<ClusterStatus, string> = {
  healthy: "bg-primary",
  degraded: "bg-yellow-500",
  down: "bg-destructive",
  provisioning: "bg-blue-500",
};

export function ClustersPage() {
  const { clusters, currentClusterId, setCurrentClusterId, loading } =
    useClusters();
  const [nodeCounts, setNodeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        clusters.map(async (c) => {
          try {
            const nodes = await api.listNodes(c.id);
            return [c.id, nodes.length] as const;
          } catch {
            return [c.id, 0] as const;
          }
        })
      );
      if (!cancelled) {
        setNodeCounts(Object.fromEntries(entries));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clusters]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Clusters
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every Kompute cluster you manage from this dashboard.
          </p>
        </div>
        <Button>
          <Plus className="size-4" /> New cluster
        </Button>
      </header>

      {loading && clusters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
          Loading clusters…
        </div>
      ) : clusters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
          No clusters yet. Create your first one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {clusters.map((c) => {
            const isCurrent = c.id === currentClusterId;
            const count = nodeCounts[c.id] ?? 0;
            return (
              <Card
                key={c.id}
                className={cn(
                  "transition-colors",
                  isCurrent && "border-primary/40"
                )}
              >
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            statusDot[c.status]
                          )}
                        />
                        <span className="truncate text-[15px] font-semibold text-foreground">
                          {c.name}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {c.version}
                      </div>
                    </div>
                    <Badge variant="secondary">{statusLabels[c.status]}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Server className="size-3.5" />
                      {count} node{count === 1 ? "" : "s"}
                    </span>
                    {c.control_plane_endpoint && (
                      <span className="truncate font-mono text-[11px]">
                        {c.control_plane_endpoint}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary">
                        <Check className="size-3.5" /> Current
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentClusterId(c.id)}
                      >
                        Switch to
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <Link to="/nodes">
                        Nodes <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

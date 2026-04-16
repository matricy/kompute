import { useState } from "react";
import { Check, Plus, Server, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddClusterSheet } from "@/components/clusters/add-cluster-sheet";
import { useClusters } from "@/context/cluster-context";
import { formatRelativeTime } from "@/lib/utils";

export function ClustersPage() {
  const {
    clusters,
    currentClusterId,
    setCurrentClusterId,
    deleteCluster,
    loading,
  } = useClusters();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteCluster(id);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

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
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" /> New cluster
        </Button>
      </header>

      {loading && clusters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
          Loading clusters…
        </div>
      ) : clusters.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center">
          <Server className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No clusters yet. Create your first one to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clusters.map((c) => {
            const isCurrent = c.id === currentClusterId;
            return (
              <Card
                key={c.id}
                className="flex items-center gap-4 border-border bg-surface p-4"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                  <Server className="size-4 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                        <Check className="size-3" /> Current
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="font-mono">{c.id}</span>
                    <span>Created {formatRelativeTime(c.created_at)}</span>
                  </div>
                </div>

                {!isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentClusterId(c.id)}
                  >
                    Switch to
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  disabled={deleting === c.id}
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <AddClusterSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}

interface ClusterHealthProps {
  nodeCount: number;
  version?: string;
}

export function ClusterHealth({
  nodeCount,
  version = "k3s v1.28.5+k3s1",
}: ClusterHealthProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex size-2.5 items-center justify-center">
          <div className="pulse-green absolute inset-0 rounded-full bg-primary" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            Cluster healthy
          </div>
          <div className="text-xs text-muted-foreground">
            {nodeCount} node{nodeCount === 1 ? "" : "s"} reporting · control
            plane reachable
          </div>
        </div>
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">
        {version}
      </span>
    </div>
  );
}

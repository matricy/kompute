import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import type { Node } from "@/types";

interface UseClusterNodesResult {
  nodes: Node[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export function useClusterNodes(
  clusterId: string | null
): UseClusterNodesResult {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = useCallback(
    async (id: string) => {
      const mine = ++reqId.current;
      setLoading(true);
      try {
        const next = await api.listNodes(id);
        if (reqId.current === mine) {
          setNodes(next);
          setError(null);
        }
      } catch (e) {
        if (reqId.current === mine) {
          setError(e instanceof Error ? e.message : "failed to load nodes");
        }
      } finally {
        if (reqId.current === mine) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (clusterId === null) {
      setNodes([]);
      setError(null);
      return;
    }
    void load(clusterId);
  }, [clusterId, load]);

  const refresh = useCallback(async () => {
    if (clusterId === null) return;
    await load(clusterId);
  }, [clusterId, load]);

  return { nodes, loading, error, refresh, setNodes };
}

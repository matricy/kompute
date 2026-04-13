import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import type { ActivityEntry } from "@/types";

interface UseActivityResult {
  entries: ActivityEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useActivity(clusterId: string | null): UseActivityResult {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = useCallback(async (id: string) => {
    const mine = ++reqId.current;
    setLoading(true);
    try {
      const next = await api.listActivity(id);
      if (reqId.current === mine) {
        setEntries(next);
        setError(null);
      }
    } catch (e) {
      if (reqId.current === mine) {
        setError(e instanceof Error ? e.message : "failed to load activity");
      }
    } finally {
      if (reqId.current === mine) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (clusterId === null) {
      setEntries([]);
      setError(null);
      return;
    }
    void load(clusterId);
  }, [clusterId, load]);

  const refresh = useCallback(async () => {
    if (clusterId === null) return;
    await load(clusterId);
  }, [clusterId, load]);

  return { entries, loading, error, refresh };
}

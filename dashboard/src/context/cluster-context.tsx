import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { api, type CreateClusterRequest } from "@/lib/api";
import type { Cluster } from "@/types";

const STORAGE_KEY = "kompute.currentClusterId";

interface ClusterContextValue {
  clusters: Cluster[];
  currentCluster: Cluster | null;
  currentClusterId: string | null;
  loading: boolean;
  error: string | null;
  setCurrentClusterId: (id: string) => void;
  refresh: () => Promise<void>;
  createCluster: (req: CreateClusterRequest) => Promise<Cluster>;
  deleteCluster: (id: string) => Promise<void>;
}

const ClusterContext = createContext<ClusterContextValue | null>(null);

function readStoredId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [currentClusterId, setCurrentClusterIdState] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const setCurrentClusterId = useCallback((id: string) => {
    setCurrentClusterIdState(id);
    writeStoredId(id);
  }, []);

  const applyClusters = useCallback((next: Cluster[]) => {
    setClusters(next);
    setCurrentClusterIdState((cur) => {
      const stored = cur ?? readStoredId();
      if (stored && next.some((c) => c.id === stored)) return stored;
      const fallback = next[0]?.id ?? null;
      writeStoredId(fallback);
      return fallback;
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      const next = await api.listClusters();
      applyClusters(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load clusters");
    }
  }, [applyClusters]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const createCluster = useCallback(
    async (req: CreateClusterRequest) => {
      const cluster = await api.createCluster(req);
      setClusters((prev) => [...prev, cluster]);
      setCurrentClusterId(cluster.id);
      return cluster;
    },
    [setCurrentClusterId]
  );

  const deleteCluster = useCallback(async (id: string) => {
    await api.deleteCluster(id);
    setClusters((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setCurrentClusterIdState((cur) => {
        if (cur !== id) return cur;
        const fallback = next[0]?.id ?? null;
        writeStoredId(fallback);
        return fallback;
      });
      return next;
    });
  }, []);

  const currentCluster = useMemo(
    () => clusters.find((c) => c.id === currentClusterId) ?? null,
    [clusters, currentClusterId]
  );

  const value = useMemo<ClusterContextValue>(
    () => ({
      clusters,
      currentCluster,
      currentClusterId,
      loading,
      error,
      setCurrentClusterId,
      refresh,
      createCluster,
      deleteCluster,
    }),
    [
      clusters,
      currentCluster,
      currentClusterId,
      loading,
      error,
      setCurrentClusterId,
      refresh,
      createCluster,
      deleteCluster,
    ]
  );

  return (
    <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
  );
}

export function useClusters() {
  const ctx = useContext(ClusterContext);
  if (ctx === null) {
    throw new Error("useClusters must be used within a ClusterProvider");
  }
  return ctx;
}

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { ProviderOption } from "@/types";

interface UseProvidersResult {
  providers: ProviderOption[];
  loading: boolean;
  error: string | null;
}

export function useProviders(enabled: boolean = true): UseProvidersResult {
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const next = await api.listProviders();
        if (!cancelled) {
          setProviders(next);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "failed to load providers");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { providers, loading, error };
}

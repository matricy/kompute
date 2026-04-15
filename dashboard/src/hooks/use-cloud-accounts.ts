import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import type { CloudAccountRef } from "@/types";

interface UseCloudAccountsResult {
  accounts: CloudAccountRef[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCloudAccounts(): UseCloudAccountsResult {
  const [accounts, setAccounts] = useState<CloudAccountRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  const load = useCallback(async () => {
    const mine = ++reqId.current;
    setLoading(true);
    try {
      const next = await api.listCloudAccounts();
      if (reqId.current === mine) {
        setAccounts(next);
        setError(null);
      }
    } catch (e) {
      if (reqId.current === mine) {
        setError(
          e instanceof Error ? e.message : "failed to load cloud accounts"
        );
      }
    } finally {
      if (reqId.current === mine) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return { accounts, loading, error, refresh };
}

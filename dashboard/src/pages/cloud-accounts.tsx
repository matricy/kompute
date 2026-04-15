import { useState } from "react";
import { KeyRound, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddCloudAccountSheet } from "@/components/cloud-accounts/add-cloud-account-sheet";
import { ProviderMark } from "@/components/cloud-accounts/provider-mark";
import { useCloudAccounts } from "@/hooks/use-cloud-accounts";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import type { CloudAccountRef, CloudProvider } from "@/types";

const providerLabels: Record<CloudProvider, string> = {
  digital_ocean: "DigitalOcean",
  hetzner: "Hetzner",
  aws: "AWS",
};

export function CloudAccountsPage() {
  const { accounts, loading, error, refresh } = useCloudAccounts();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (account: CloudAccountRef) => {
    setDeleting(account.id);
    try {
      await api.deleteCloudAccount(account.id);
      await refresh();
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
            Cloud Accounts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Provider credentials used to provision and manage cloud nodes.
          </p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" /> Add account
        </Button>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive-foreground">
          {error}
        </div>
      )}

      {loading && accounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center text-sm text-muted-foreground">
          Loading accounts…
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface/60 p-12 text-center">
          <KeyRound className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No cloud accounts connected yet. Add one to start provisioning
            nodes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="flex items-center gap-4 border-border bg-surface p-4"
            >
              <ProviderMark provider={account.provider} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {account.name}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {providerLabels[account.provider]}
                  </Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="font-mono">{account.id}</span>
                  <span>Added {formatRelativeTime(account.created_at)}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                disabled={deleting === account.id}
                onClick={() => handleDelete(account)}
              >
                <Trash2 className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <AddCloudAccountSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onCreated={refresh}
      />
    </div>
  );
}

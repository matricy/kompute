import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, Database, Settings } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { ClusterProvider } from "@/context/cluster-context";
import { CloudAccountsPage } from "@/pages/cloud-accounts";
import { ClustersPage } from "@/pages/clusters";
import { DashboardPage } from "@/pages/dashboard";
import { NodesPage } from "@/pages/nodes";
import { PlaceholderPage } from "@/pages/placeholder";

export default function App() {
  return (
    <BrowserRouter>
      <ClusterProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clusters" element={<ClustersPage />} />
            <Route path="/nodes" element={<NodesPage />} />
            <Route
              path="/cloud-accounts"
              element={<CloudAccountsPage />}
            />
            <Route
              path="/workloads"
              element={
                <PlaceholderPage
                  title="Workloads"
                  description="Services and jobs scheduled across your nodes."
                  icon={Box}
                />
              }
            />
            <Route
              path="/volumes"
              element={
                <PlaceholderPage
                  title="Volumes"
                  description="Persistent volumes attached to workloads."
                  icon={Database}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <PlaceholderPage
                  title="Settings"
                  description="Cluster-wide configuration and preferences."
                  icon={Settings}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </ClusterProvider>
    </BrowserRouter>
  );
}

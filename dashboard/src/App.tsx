import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, Database, Key, Settings } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { ClusterProvider } from "@/context/cluster-context";
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
              path="/tokens"
              element={
                <PlaceholderPage
                  title="Tokens"
                  description="API tokens for CLI and programmatic access."
                  icon={Key}
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

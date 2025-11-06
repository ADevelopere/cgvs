"use client";

import React from "react";
import DashboardLayout from "@/client/views/dashboard/layout/DashboardLayout";
import DashboardEndActions from "@/client/views/dashboard/layout/DashboardEndActions";
import { DashboardLayoutProvider } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { TableLocaleProvider } from "@/client/components/Table/contexts/TableLocaleContext";

const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayoutProvider
      initialSlots={{
        endActions: <DashboardEndActions />,
      }}
    >
      <AdminLayoutContent>
        <TableLocaleProvider>{children}</TableLocaleProvider>
      </AdminLayoutContent>
    </DashboardLayoutProvider>
  );
};

export default AdminLayout;

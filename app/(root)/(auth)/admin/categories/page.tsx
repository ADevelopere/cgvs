import { TemplateCategoryManagementProvider } from "@/client/views/(root)/(auth)/admin/categories/categories.context";
import TemplateCategoryManagement from "@/client/views/(root)/(auth)/admin/categories/CategoryManagement";
import React from "react";

export default function Page() {
  return (
    <TemplateCategoryManagementProvider>
      <TemplateCategoryManagement />
    </TemplateCategoryManagementProvider>
  );
}

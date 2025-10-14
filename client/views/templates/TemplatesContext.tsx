"use client";

/**
 * Templates Page Context
 *
 * Architecture:
 * - UI State: Managed by Zustand (useTemplatesPageStore) with automatic persistence
 * - Business Logic: Managed by React Context (this file)
 * - Data: Fetched directly by components using useQuery
 *
 * Benefits:
 * - State persists across page navigation automatically
 * - Clean separation of concerns
 * - Components fetch their own data
 */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";
import { NavigationPageItem } from "@/client/contexts/adminLayout.types";
import { useTemplatesPageStore } from "./templatesPage.store";

/**
 * Context provides ONLY business logic functions
 * Components fetch their own data using useQuery directly
 * UI state is managed by Zustand store
 */
type TemplatesPageContextType = {
  // Navigation
  manageTemplate: (templateId: number) => void;
};

const TemplatesPageContext = React.createContext<
  TemplatesPageContextType | undefined
>(undefined);

/**
 * Hook that combines context (business logic) with Zustand store (UI state)
 * Components only use this hook - Zustand is an implementation detail
 */
export const useTemplatesList = () => {
  const context = React.useContext(TemplatesPageContext);
  const uiStore = useTemplatesPageStore();

  if (context === undefined) {
    throw new Error(
      "useTemplatesList must be used within a TemplatesPageProvider",
    );
  }

  // Combine context data with UI store state
  return {
    ...context,
    ...uiStore,
  };
};

export const TemplatesPageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const { setNavigation } = useDashboardLayout();

  // Update navigation
  useEffect(() => {
    setNavigation((prevNav) => {
      if (!prevNav) return prevNav;
      return prevNav.map((item) => {
        if ("id" in item && item.id === "templates") {
          return { ...item, segment: "admin/templates" } as NavigationPageItem;
        }
        return item;
      });
    });
  }, [setNavigation]);

  const manageTemplate = React.useCallback(
    (templateId: number) => {
      router.push(`/admin/templates/${templateId}/manage`);
    },
    [router],
  );

  const value = React.useMemo(
    () => ({
      manageTemplate,
    }),
    [manageTemplate],
  );

  return (
    <TemplatesPageContext.Provider value={value}>
      {children}
    </TemplatesPageContext.Provider>
  );
};

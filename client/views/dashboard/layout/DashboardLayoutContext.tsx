"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  DashboardLayoutProviderProps,
  DashboardLayoutSlots,
  SidebarState,
  SIDEBAR_STATE_STORAGE_KEY,
  SlotName,
  DashboardLayoutContextProps,
  Title,
} from "./types";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { useNavigationStateStore } from "./useNavigationStateStore";

const DashboardLayoutContext = createContext<
  DashboardLayoutContextProps | undefined
>(undefined);

export const DashboardLayoutProvider: React.FC<
  DashboardLayoutProviderProps
> = ({ initialTitle, initialNavigation, initialSlots, children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Navigation state store
  const {
    savePageState,
    saveLastVisitedChild,
    clearLastVisitedChild,
    restoreLastVisitedChild,
  } = useNavigationStateStore();

  const [slots, setSlots] = useState<DashboardLayoutSlots>({
    ...initialSlots,
  });

  const [titleState, setTitleState] = useState<Title | undefined>(
    initialTitle || undefined
  );

  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    const saved = loadFromLocalStorage(SIDEBAR_STATE_STORAGE_KEY);

    return (saved as SidebarState) || "expanded";
  });

  // Compute navigation with dynamic segments based on current path and saved state
  const computedNavigation = useMemo(() => {
    if (!initialNavigation) {
      return initialNavigation;
    }

    const normalizedPathname = pathname.replace(/\/$/, "");

    return initialNavigation.map(navItem => {
      // Skip non-page items (headers and dividers)
      if (navItem.kind === "header" || navItem.kind === "divider") {
        return navItem;
      }

      // If no segment property, skip (shouldn't happen for page items but be safe)
      if (!("segment" in navItem) || !navItem.segment) {
        return navItem;
      }

      const baseSegment = navItem.segment || "";
      const basePath = baseSegment.startsWith("/")
        ? baseSegment
        : `/${baseSegment}`;

      // If we're currently on this exact parent path, use base segment (keep original)
      if (normalizedPathname === basePath) {
        return navItem; // Keep original segment
      }

      // If we're on a child of this path, update segment to current pathname (without leading slash for consistency)
      if (normalizedPathname.startsWith(basePath + "/")) {
        const newSegment = normalizedPathname.substring(1); // Remove leading slash
        return {
          ...navItem,
          segment: newSegment,
        };
      }

      // Otherwise, check if there's a saved child path
      const savedChild = restoreLastVisitedChild(basePath);

      if (savedChild) {
        // Remove leading slash from savedChild if it exists
        const childSegment = savedChild.startsWith("/")
          ? savedChild.substring(1)
          : savedChild;

        return {
          ...navItem,
          segment: childSegment,
        };
      }

      // Default to base path (keep original segment)
      return navItem; // Keep original segment
    });
  }, [initialNavigation, pathname, restoreLastVisitedChild]);

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [sideBarToggleWidth, setSideBarToggleWidth] = useState<number>(0);
  const [sideBarWidth, setSideBarWidth] = useState<number>(0);

  // ============================================================================
  // EFFECT 1: Continuously save current page state to store
  // ============================================================================
  useEffect(() => {
    const paramsString = searchParams.toString();

    // Always save current state to store
    savePageState(pathname, paramsString);

    // Also update parent segment's "last visited child" for sidebar
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 2) {
      // Has sub-pages (e.g., /admin/templates/15/manage)
      const parentPath = `/${segments.slice(0, 2).join("/")}`; // e.g., /admin/templates
      const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;

      saveLastVisitedChild(parentPath, fullPath);
    } else if (segments.length === 2) {
      // User navigated to a parent path (e.g., /admin/templates)
      // Clear any saved child path for this parent since user explicitly went to the base page
      const parentPath = `/${segments.join("/")}`;

      // Clear the saved child completely
      clearLastVisitedChild(parentPath);
    }
  }, [
    pathname,
    searchParams,
    savePageState,
    saveLastVisitedChild,
    clearLastVisitedChild,
  ]);

  const toggleSidebar = useCallback(() => {
    setSidebarState(current => {
      const newState = current === "expanded" ? "collapsed" : "expanded";

      localStorage.setItem(SIDEBAR_STATE_STORAGE_KEY, newState);
      return newState;
    });
  }, []);

  const setDashboardSlot = useCallback(
    (slotName: SlotName, component: React.ReactNode | null) => {
      setSlots(prevSlots => {
        const newSlots = {
          ...prevSlots,
          [slotName]: component || undefined,
        };

        return newSlots;
      });

      return () => {
        setSlots(prevSlots => {
          const { [slotName]: _, ...rest } = prevSlots;
          return rest;
        });
      };
    },
    []
  );

  const resetSlots = useCallback(() => {
    setSlots(prevSlots => {
      const newSlots = { ...prevSlots };

      Object.keys(newSlots).forEach(key => {
        newSlots[key as SlotName] = undefined;
      });

      return newSlots;
    });
  }, []);

  const setTitleSlot = useCallback((slot: React.ReactNode) => {
    setSlots(prevSlots => {
      const newSlots = {
        ...prevSlots,
        titleRenderer: slot,
      };

      return newSlots;
    });

    return () => {
      setSlots(prevSlots => {
        const { titleRenderer: _, ...rest } = prevSlots;
        return rest;
      });
    };
  }, []);

  const setTitle = useCallback((newTitle: Title) => {
    return () => {
      setTitleState(prev => {
        const updatedTitle = { ...prev, ...newTitle };
        return updatedTitle;
      });
    };
  }, []);

  const value = useMemo(() => {
    const contextValue = {
      navigation: computedNavigation,
      slots,
      title: titleState,
      sidebarState,
      setDashboardSlot,
      resetSlots,
      setTitleSlot,
      setTitle,
      setSidebarState,
      toggleSidebar,
      //
      headerHeight,
      setHeaderHeight,
      sideBarToggleWidth,
      setSideBarToggleWidth,
      sideBarWidth,
      setSideBarWidth,
      // Navigation state store methods
      restoreLastVisitedChild,
    };

    return contextValue;
  }, [
    computedNavigation,
    slots,
    titleState,
    sidebarState,
    setDashboardSlot,
    resetSlots,
    setTitleSlot,
    setTitle,
    setSidebarState,
    toggleSidebar,
    headerHeight,
    setHeaderHeight,
    sideBarToggleWidth,
    setSideBarToggleWidth,
    sideBarWidth,
    setSideBarWidth,
    restoreLastVisitedChild,
  ]);

  return (
    <DashboardLayoutContext.Provider value={value}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};

export const useDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error(
      "useDashboardLayout must be used within a DashboardLayoutProvider"
    );
  }
  return context;
};

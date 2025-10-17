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
import logger from "@/lib/logger";

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
  logger.log("[DashboardLayoutProvider] Component rendering with props:", {
    initialTitle,
    initialNavigation,
    initialSlots,
    children: typeof children,
  });

  const pathname = usePathname();
  const searchParams = useSearchParams();

  logger.log("[DashboardLayoutProvider] Current URL state:", {
    pathname,
    searchParams: searchParams.toString(),
  });

  // Navigation state store
  const {
    savePageState,
    saveLastVisitedChild,
    clearLastVisitedChild,
    restoreLastVisitedChild,
  } = useNavigationStateStore();

  logger.log("[DashboardLayoutProvider] Navigation state store methods:", {
    savePageState: typeof savePageState,
    saveLastVisitedChild: typeof saveLastVisitedChild,
    clearLastVisitedChild: typeof clearLastVisitedChild,
    restoreLastVisitedChild: typeof restoreLastVisitedChild,
  });

  const [slots, setSlots] = useState<DashboardLayoutSlots>({
    ...initialSlots,
  });
  logger.log("[DashboardLayoutProvider] Initial slots state:", slots);

  const [titleState, setTitleState] = useState<Title | undefined>(
    initialTitle || undefined,
  );
  logger.log("[DashboardLayoutProvider] Initial title state:", titleState);

  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    const saved = loadFromLocalStorage(SIDEBAR_STATE_STORAGE_KEY);
    logger.log(
      "[DashboardLayoutProvider] Loading sidebar state from localStorage:",
      {
        saved,
        key: SIDEBAR_STATE_STORAGE_KEY,
      },
    );
    return (saved as SidebarState) || "expanded";
  });
  logger.log("[DashboardLayoutProvider] Initial sidebar state:", sidebarState);

  // Compute navigation with dynamic segments based on current path and saved state
  const computedNavigation = useMemo(() => {
    if (!initialNavigation) {
      logger.log(
        "[DashboardLayoutProvider] No initialNavigation, returning undefined",
      );
      return initialNavigation;
    }

    const normalizedPathname = pathname.replace(/\/$/, "");
    logger.log("[DashboardLayoutProvider] Computing navigation:", {
      pathname,
      normalizedPathname,
      navigationItemCount: initialNavigation.length,
    });

    return initialNavigation.map((navItem, index) => {
      // Skip non-page items (headers and dividers)
      if (navItem.kind === "header" || navItem.kind === "divider") {
        logger.log(
          `[DashboardLayoutProvider] Item ${index}: Skipping ${navItem.kind} item`,
        );
        return navItem;
      }

      // If no segment property, skip (shouldn't happen for page items but be safe)
      if (!("segment" in navItem) || !navItem.segment) {
        logger.log(
          `[DashboardLayoutProvider] Item ${index}: Skipping item without segment`,
        );
        return navItem;
      }

      const baseSegment = navItem.segment || "";
      const basePath = baseSegment.startsWith("/")
        ? baseSegment
        : `/${baseSegment}`;

      logger.log(
        `[DashboardLayoutProvider] Item ${index} (${navItem.title}):`,
        {
          baseSegment,
          basePath,
          normalizedPathname,
          isExactMatch: normalizedPathname === basePath,
          isChildPath: normalizedPathname.startsWith(basePath + "/"),
        },
      );

      // If we're currently on this exact parent path, use base segment (keep original)
      if (normalizedPathname === basePath) {
        logger.log(
          `[DashboardLayoutProvider] Item ${index}: On parent path, keeping original`,
        );
        return navItem; // Keep original segment
      }

      // If we're on a child of this path, update segment to current pathname (without leading slash for consistency)
      if (normalizedPathname.startsWith(basePath + "/")) {
        const newSegment = normalizedPathname.substring(1); // Remove leading slash
        logger.log(
          `[DashboardLayoutProvider] Item ${index}: On child path, updating to:`,
          newSegment,
        );
        return {
          ...navItem,
          segment: newSegment,
        };
      }

      // Otherwise, check if there's a saved child path
      const savedChild = restoreLastVisitedChild(basePath);
      logger.log(
        `[DashboardLayoutProvider] Item ${index}: Checking saved child for ${basePath}:`,
        savedChild,
      );

      if (savedChild) {
        // Remove leading slash from savedChild if it exists
        const childSegment = savedChild.startsWith("/")
          ? savedChild.substring(1)
          : savedChild;
        logger.log(
          `[DashboardLayoutProvider] Item ${index}: Using saved child:`,
          childSegment,
        );
        return {
          ...navItem,
          segment: childSegment,
        };
      }

      // Default to base path (keep original segment)
      logger.log(
        `[DashboardLayoutProvider] Item ${index}: No match, keeping original segment:`,
        navItem.segment,
      );
      return navItem; // Keep original segment
    });
  }, [initialNavigation, pathname, restoreLastVisitedChild]);

  logger.log(
    "[DashboardLayoutProvider] Computed navigation:",
    computedNavigation?.map((item) => ({
      kind: item.kind,
      title: "title" in item ? item.title : "N/A",
      segment: "segment" in item ? item.segment : "N/A",
    })),
  );

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [sideBarToggleWidth, setSideBarToggleWidth] = useState<number>(0);
  const [sideBarWidth, setSideBarWidth] = useState<number>(0);

  logger.log("[DashboardLayoutProvider] Layout dimensions state:", {
    headerHeight,
    sideBarToggleWidth,
    sideBarWidth,
  });

  // ============================================================================
  // EFFECT 1: Continuously save current page state to store
  // ============================================================================
  useEffect(() => {
    logger.log(
      "[DashboardLayoutProvider] EFFECT 1: Saving page state - triggered by:",
      {
        pathname,
        searchParams: searchParams.toString(),
        timestamp: new Date().toISOString(),
      },
    );

    const paramsString = searchParams.toString();

    // Always save current state to store
    logger.log(
      "[DashboardLayoutProvider] EFFECT 1: Saving page state to store:",
      {
        pathname,
        paramsString,
      },
    );
    savePageState(pathname, paramsString);

    // Also update parent segment's "last visited child" for sidebar
    const segments = pathname.split("/").filter(Boolean);
    logger.log("[DashboardLayoutProvider] EFFECT 1: Path segments:", {
      segments,
      segmentCount: segments.length,
    });

    if (segments.length > 2) {
      // Has sub-pages (e.g., /admin/templates/15/manage)
      const parentPath = `/${segments.slice(0, 2).join("/")}`; // e.g., /admin/templates
      const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;

      logger.log(
        "[DashboardLayoutProvider] EFFECT 1: Saving last visited child:",
        {
          parentPath,
          fullPath,
          hasSubPages: true,
        },
      );

      saveLastVisitedChild(parentPath, fullPath);
    } else if (segments.length === 2) {
      // User navigated to a parent path (e.g., /admin/templates)
      // Clear any saved child path for this parent since user explicitly went to the base page
      const parentPath = `/${segments.join("/")}`;

      logger.log(
        "[DashboardLayoutProvider] EFFECT 1: User navigated to parent path, clearing saved child:",
        {
          parentPath,
          pathname,
          clearingChild: true,
        },
      );

      // Clear the saved child completely
      clearLastVisitedChild(parentPath);
    } else {
      logger.log(
        "[DashboardLayoutProvider] EFFECT 1: No sub-pages detected, skipping last visited child save",
      );
    }
  }, [
    pathname,
    searchParams,
    savePageState,
    saveLastVisitedChild,
    clearLastVisitedChild,
  ]);

  const toggleSidebar = useCallback(() => {
    logger.log("[DashboardLayoutProvider] toggleSidebar called");
    setSidebarState((current) => {
      const newState = current === "expanded" ? "collapsed" : "expanded";
      logger.log("[DashboardLayoutProvider] toggleSidebar state change:", {
        from: current,
        to: newState,
        storageKey: SIDEBAR_STATE_STORAGE_KEY,
      });
      localStorage.setItem(SIDEBAR_STATE_STORAGE_KEY, newState);
      return newState;
    });
  }, []);

  const setDashboardSlot = useCallback(
    (slotName: SlotName, component: React.ReactNode | null) => {
      logger.log("[DashboardLayoutProvider] setDashboardSlot called:", {
        slotName,
        hasComponent: !!component,
        componentType: typeof component,
      });

      setSlots((prevSlots) => {
        const newSlots = {
          ...prevSlots,
          [slotName]: component || undefined,
        };
        logger.log(
          "[DashboardLayoutProvider] setDashboardSlot updating slots:",
          {
            slotName,
            prevSlots,
            newSlots,
          },
        );
        return newSlots;
      });

      return () => {
        logger.log(
          "[DashboardLayoutProvider] setDashboardSlot cleanup function called for:",
          slotName,
        );
        setSlots((prevSlots) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [slotName]: _, ...rest } = prevSlots;
          logger.log(
            "[DashboardLayoutProvider] setDashboardSlot cleanup removing slot:",
            {
              slotName,
              prevSlots,
              newSlots: rest,
            },
          );
          return rest;
        });
      };
    },
    [],
  );

  const resetSlots = useCallback(() => {
    logger.log("[DashboardLayoutProvider] resetSlots called");
    setSlots((prevSlots) => {
      const newSlots = { ...prevSlots };
      logger.log(
        "[DashboardLayoutProvider] resetSlots before reset:",
        prevSlots,
      );

      Object.keys(newSlots).forEach((key) => {
        newSlots[key as SlotName] = undefined;
      });

      logger.log("[DashboardLayoutProvider] resetSlots after reset:", newSlots);
      return newSlots;
    });
  }, []);

  const setTitleSlot = useCallback((slot: React.ReactNode) => {
    logger.log("[DashboardLayoutProvider] setTitleSlot called:", {
      hasSlot: !!slot,
      slotType: typeof slot,
    });

    setSlots((prevSlots) => {
      const newSlots = {
        ...prevSlots,
        titleRenderer: slot,
      };
      logger.log("[DashboardLayoutProvider] setTitleSlot updating slots:", {
        prevSlots,
        newSlots,
      });
      return newSlots;
    });

    return () => {
      logger.log(
        "[DashboardLayoutProvider] setTitleSlot cleanup function called",
      );
      setSlots((prevSlots) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { titleRenderer: _, ...rest } = prevSlots;
        logger.log(
          "[DashboardLayoutProvider] setTitleSlot cleanup removing titleRenderer:",
          {
            prevSlots,
            newSlots: rest,
          },
        );
        return rest;
      });
    };
  }, []);

  const setTitle = useCallback(
    (newTitle: Title) => {
      logger.log("[DashboardLayoutProvider] setTitle called:", {
        newTitle,
        currentTitle: titleState,
      });

      return () => {
        logger.log(
          "[DashboardLayoutProvider] setTitle updater function called",
        );
        setTitleState((prev) => {
          const updatedTitle = { ...prev, ...newTitle };
          logger.log("[DashboardLayoutProvider] setTitle updating title:", {
            prev,
            newTitle,
            updatedTitle,
          });
          return updatedTitle;
        });
      };
    },
    [titleState],
  );

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

    logger.log("[DashboardLayoutProvider] Context value memoized:", {
      navigation: computedNavigation?.map((item) => ({
        kind: item.kind,
        id: "id" in item ? item.id : "N/A",
        segment: "segment" in item ? item.segment : "N/A",
        title: "title" in item ? item.title : "N/A",
      })),
      slots,
      title: titleState,
      sidebarState,
      headerHeight,
      sideBarToggleWidth,
      sideBarWidth,
    });

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

  logger.log(
    "[DashboardLayoutProvider] Rendering provider with context value:",
    {
      hasValue: !!value,
      navigationCount: value.navigation?.length || 0,
      slotsCount: Object.keys(value.slots || {}).length,
      hasTitle: !!value.title,
      sidebarState: value.sidebarState,
    },
  );

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
      "useDashboardLayout must be used within a DashboardLayoutProvider",
    );
  }
  return context;
};

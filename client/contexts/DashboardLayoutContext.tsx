"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { usePathname, useSearchParams } from 'next/navigation';

import {
    DashboardLayoutProviderProps,
    DashboardLayoutSlots,
    SidebarState,
    SIDEBAR_STATE_STORAGE_KEY,
    SlotName,
    DashboardLayoutContextProps,
    Title,
    Navigation,
} from "./adminLayout.types";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { useNavigationStateStore } from "./navigation/useNavigationStateStore";

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
        restoreLastVisitedChild 
    } = useNavigationStateStore();
    
    const [slots, setSlots] = useState<DashboardLayoutSlots>({
        ...initialSlots,
    });
    const [titleState, setTitleState] = useState<Title | undefined>(
        initialTitle || undefined,
    );

    const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
        const saved = loadFromLocalStorage(SIDEBAR_STATE_STORAGE_KEY);
        return (saved as SidebarState) || "expanded";
    });
    
    // Dynamic navigation that gets updated based on saved state
    const [navigation, setNavigation] = useState<Navigation | undefined>(
        initialNavigation,
    );

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
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 2) { // Has sub-pages (e.g., /admin/templates/15/manage)
            const parentPath = `/${segments.slice(0, 2).join('/')}`; // e.g., /admin/templates
            const fullPath = paramsString ? `${pathname}?${paramsString}` : pathname;
            saveLastVisitedChild(parentPath, fullPath);
        }
    }, [pathname, searchParams, savePageState, saveLastVisitedChild]);
    
    // ============================================================================
    // EFFECT 2: Update navigation items with saved state
    // ============================================================================
    useEffect(() => {
        if (!initialNavigation) return;
        
        const updatedNavigation = initialNavigation.map(navItem => {
            if (navItem.kind === 'header' || navItem.kind === 'divider') {
                return navItem;
            }
            
            // Only process page items that have segments
            if ('segment' in navItem && navItem.segment) {
                // Get the saved last visited child for this navigation item
                const savedChild = restoreLastVisitedChild(navItem.segment);
                
                if (savedChild) {
                    // Update the segment to point to the last visited child
                    return {
                        ...navItem,
                        segment: savedChild,
                    };
                }
            }
            
            return navItem;
        });
        
        setNavigation(updatedNavigation);
    }, [initialNavigation, restoreLastVisitedChild]);

    const toggleSidebar = useCallback(() => {
        setSidebarState((current) => {
            const newState = current === "expanded" ? "collapsed" : "expanded";
            localStorage.setItem(SIDEBAR_STATE_STORAGE_KEY, newState);
            return newState;
        });
    }, []);

    const setDashboardSlot = useCallback(
        (slotName: SlotName, component: React.ReactNode | null) => {
            setSlots((prevSlots) => ({
                ...prevSlots,
                [slotName]: component || undefined,
            }));

            return () => {
                setSlots((prevSlots) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [slotName]: _, ...rest } = prevSlots;
                    return rest;
                });
            };
        },
        [],
    );

    const resetSlots = useCallback(() => {
        setSlots((prevSlots) => {
            const newSlots = { ...prevSlots };
            Object.keys(newSlots).forEach((key) => {
                newSlots[key as SlotName] = undefined;
            });
            return newSlots;
        });
    }, []);

    const setTitleSlot = useCallback((slot: React.ReactNode) => {
        setSlots((prevSlots) => ({
            ...prevSlots,
            titleRenderer: slot,
        }));

        return () => {
            setSlots((prevSlots) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { titleRenderer: _, ...rest } = prevSlots;
                return rest;
            });
        };
    }, []);

    const setTitle = useCallback((newTitle: Title) => {
        return () => setTitleState((prev) => ({ ...prev, ...newTitle }));
    }, []);

    const value = useMemo(() => {
        return {
            navigation,
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
        };
    }, [
        navigation,
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
            "useDashboardLayout must be used within a DashboardLayoutProvider",
        );
    }
    return context;
};

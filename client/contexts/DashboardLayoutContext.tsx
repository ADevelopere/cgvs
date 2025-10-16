"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";

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
import { AutomatedNavigationProvider } from "./navigation/AutomatedNavigationProvider";

const DashboardLayoutContext = createContext<
    DashboardLayoutContextProps | undefined
>(undefined);

export const DashboardLayoutProvider: React.FC<
    DashboardLayoutProviderProps
> = ({ initialTitle, initialNavigation, initialSlots, children }) => {
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
    const [navigation] = useState<Navigation | undefined>(
        initialNavigation,
    );

    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [sideBarToggleWidth, setSideBarToggleWidth] = useState<number>(0);
    const [sideBarWidth, setSideBarWidth] = useState<number>(0);

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
        <AutomatedNavigationProvider>
            <DashboardLayoutContext.Provider value={value}>
                {children}
            </DashboardLayoutContext.Provider>
        </AutomatedNavigationProvider>
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

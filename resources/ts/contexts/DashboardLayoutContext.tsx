import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
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
} from "@/contexts/adminLayout.types";

const DashboardLayoutContext = createContext<
    DashboardLayoutContextProps | undefined
>(undefined);

export const DashboardLayoutProvider: React.FC<
    DashboardLayoutProviderProps
> = ({ initialTitle, initialNavigation, initialSlots, children }) => {
    const [slots, setSlots] = useState<DashboardLayoutSlots>({
        ...initialSlots,
    });
    const [title, setTitleState] = useState<Title | undefined>(
        initialTitle || undefined,
    );

    const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
        const saved = localStorage.getItem(SIDEBAR_STATE_STORAGE_KEY);
        return (saved as SidebarState) || "expanded";
    });
    const [navigation, setNavigation] = useState<Navigation | undefined>(
        initialNavigation,
    );

    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [sideBarToggleWidth, setSideBarToggleWidth] = useState<number>(0);

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
                [slotName]: component ? component : undefined,
            }));

            return () => {
                setSlots((prevSlots) => {
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
            setNavigation,
            slots,
            title,
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
        };
    }, [
        navigation,
        setNavigation,
        slots,
        title,
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

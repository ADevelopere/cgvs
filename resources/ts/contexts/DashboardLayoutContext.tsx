import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import {
    Branding,
    DashboardLayoutProviderProps,
    DashboardLayoutSlots,
    Navigation,
    SidebarState,
    SIDEBAR_STATE_STORAGE_KEY,
} from "@/components/admin/layout/adminLayout.types";

type SlotName = keyof DashboardLayoutSlots;

interface DashboardLayoutContextProps {
    branding?: Branding;
    navigation?: Navigation;
    slots: DashboardLayoutSlots;
    sidebarState: SidebarState;
    setSidebarState: (state: SidebarState) => void;
    toggleSidebar: () => void;
    setSlot: (slotName: SlotName, component: React.ReactNode) => () => void;
    resetSlot: (slotName: SlotName) => void;
    hideTitle: () => void;
    showTitle: () => void;
}

const DashboardLayoutContext = createContext<
    DashboardLayoutContextProps | undefined
>(undefined);

export const DashboardLayoutProvider: React.FC<
    DashboardLayoutProviderProps
> = ({ branding, navigation, slots: initialSlots, children }) => {
    const [brandingState, setBranding] = useState<Branding | undefined>(
        branding,
    );
    const [navigationState, setNavigation] = useState<Navigation | undefined>(
        navigation,
    );
    const [slots, setSlots] = useState<DashboardLayoutSlots>({
        ...initialSlots,
    });
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
        const saved = localStorage.getItem(SIDEBAR_STATE_STORAGE_KEY);
        return (saved as SidebarState) || "expanded";
    });

    const toggleSidebar = useCallback(() => {
        setSidebarState((current) => {
            const newState = current === "expanded" ? "collapsed" : "expanded";
            localStorage.setItem(SIDEBAR_STATE_STORAGE_KEY, newState);
            return newState;
        });
    }, []);

    const hideTitle = useCallback(() => {
        setIsTitleVisible(false);
    }, []);
    const showTitle = useCallback(() => {
        setIsTitleVisible(true);
    }, []);

    const setSlot = useCallback(
        (slotName: SlotName, component: React.ReactNode) => {
            setSlots((prevSlots) => ({
                ...prevSlots,
                [slotName]: component,
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

    const clearSlot = useCallback((slotName: SlotName) => {
        setSlots((prevSlots) => {
            const { [slotName]: _, ...rest } = prevSlots;
            return rest;
        });
    }, []);

    const value = useMemo(() => {
        return {
            branding: brandingState,
            navigation: navigationState,
            slots,
            sidebarState,
            setSidebarState,
            toggleSidebar,
            setSlot,
            resetSlot: clearSlot,
            hideTitle,
            showTitle,
        };
    }, [
        brandingState,
        navigationState,
        slots,
        sidebarState,
        setSidebarState,
        toggleSidebar,
        setSlot,
        clearSlot,
        hideTitle,
        showTitle,
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

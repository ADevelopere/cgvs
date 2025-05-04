import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { JSXElementConstructor } from "react";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { Box } from "@mui/material";

/**
 * DashboardLayout Context provides a way to dynamically manage layout slots in the dashboard.
 *
 * Available slots:
 * - appTitle: Appears in the top-left of the dashboard
 * - toolbarActions: Appears in the top-right toolbar area
 * - sidebarFooter: Appears at the bottom of the sidebar
 *
 * Usage examples:
 *
 * 1. Basic slot management:
 * ```tsx
 * const MyComponent = () => {
 *   // Use the hook to set a slot - automatically cleans up on unmount
 *   useDashboardSlot('appTitle', MyCustomTitle);
 *   return <div>Content</div>;
 * };
 * ```
 *
 * 2. Toolbar with ThemeSwitcher:
 * ```tsx
 * const MyPage = () => {
 *   // Adds your toolbar actions alongside ThemeSwitcher
 *   useToolbarWithThemeSwitcher(MyToolbarActions);
 *   return <div>Page content</div>;
 * };
 * ```
 *
 * 3. Manual slot control:
 * ```tsx
 * const MyComponent = () => {
 *   const { setSlot, clearSlot } = useDashboardLayout();
 *
 *   useEffect(() => {
 *     // Set the slot and get cleanup function
 *     const cleanup = setSlot('sidebarFooter', FooterComponent);
 *     return cleanup;
 *   }, []);
 *
 *   // Or clear manually when needed
 *   const handleClose = () => {
 *     clearSlot('sidebarFooter');
 *   };
 *
 *   return <div>Content</div>;
 * };
 * ```
 *
 * Notes:
 * - Slots are automatically cleared when components unmount
 * - ThemeSwitcher is always available in the toolbar by default
 * - Use useToolbarWithThemeSwitcher to add actions alongside ThemeSwitcher
 * - Components can only set one slot at a time
 */

interface DashboardLayoutSlots {
    appTitle?: JSXElementConstructor<{}>;
    toolbarActions?: JSXElementConstructor<{}>;
    sidebarFooter?: JSXElementConstructor<{}>;
}

type SlotName = keyof DashboardLayoutSlots;

interface DashboardLayoutContextProps {
    slots: DashboardLayoutSlots;
    setSlot: (
        slotName: SlotName,
        component: JSXElementConstructor<{}>,
    ) => () => void;
    clearSlot: (slotName: SlotName) => void;
    setToolbarWithThemeSwitcher: (
        component: JSXElementConstructor<{}>,
    ) => () => void;
}

const DashboardLayoutContext = createContext<
    DashboardLayoutContextProps | undefined
>(undefined);

// Component that combines custom toolbar with ThemeSwitcher
const createCombinedToolbar = (CustomComponent: JSXElementConstructor<{}>) => {
    return function CombinedToolbar() {
        return (
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <CustomComponent />
                <ThemeSwitcher />
            </Box>
        );
    };
};

export const DashboardLayoutProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [slots, setSlots] = useState<DashboardLayoutSlots>({});

    const setSlot = useCallback(
        (slotName: SlotName, component: JSXElementConstructor<{}>) => {
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

    const setToolbarWithThemeSwitcher = useCallback(
        (component: JSXElementConstructor<{}>) => {
            const combinedComponent = createCombinedToolbar(component);
            return setSlot("toolbarActions", combinedComponent);
        },
        [setSlot],
    );

    return (
        <DashboardLayoutContext.Provider
            value={{ slots, setSlot, clearSlot, setToolbarWithThemeSwitcher }}
        >
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

// Hook for components to easily set/clear a slot during their lifecycle
export const useDashboardSlot = (
    slotName: SlotName,
    component: JSXElementConstructor<{}>,
) => {
    const { setSlot } = useDashboardLayout();

    useEffect(() => {
        const clear = setSlot(slotName, component);
        return clear;
    }, [setSlot, slotName, component]);
};

// Hook for setting toolbar actions with ThemeSwitcher
export const useToolbarWithThemeSwitcher = (
    component: JSXElementConstructor<{}>,
) => {
    const { setToolbarWithThemeSwitcher } = useDashboardLayout();

    useEffect(() => {
        const clear = setToolbarWithThemeSwitcher(component);
        return clear;
    }, [setToolbarWithThemeSwitcher, component]);
};

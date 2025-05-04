export interface Title {
    titleText?: string;
    icon?: React.ReactNode;
    homeUrl?: string;
    titleVisible: boolean;
    titleTextVisible: boolean;
    titleLogoVisible: boolean;
    textColor?: string;
    iconColor?: string;
}

export interface NavigationPageItem {
    kind?: "page";
    segment?: string;
    title?: string;
    icon?: React.ReactNode;
    pattern?: string;
    action?: React.ReactNode;
    children?: Navigation;
}
export interface NavigationSubheaderItem {
    kind: "header";
    title: string;
}
export interface NavigationDividerItem {
    kind: "divider";
}

export type NavigationItem =
    | NavigationPageItem
    | NavigationSubheaderItem
    | NavigationDividerItem;

export type Navigation = NavigationItem[];

export type DashboardLayoutSlots = {
    titleRenderer?: React.ReactNode;
    startActions?: React.ReactNode;
    middleActions?: React.ReactNode;
    endActions?: React.ReactNode;
    expandedSidebar?: React.ReactNode;
    collapsedSidebar?: React.ReactNode;
};

export const SIDEBAR_STATE_STORAGE_KEY = "dashboard_sidebar_state";

export type SidebarState = "collapsed" | "expanded";

export type DashboardLayoutProviderProps = {
    initialTitle?: Title;
    initialNavigation?: Navigation;
    initialSlots?: DashboardLayoutSlots;
    children?: React.ReactNode;
};

export type SlotName = keyof DashboardLayoutSlots;

export type DashboardLayoutContextProps = {
    navigation?: Navigation;
    setNavigation: (navigation: Navigation) => void;
    slots: DashboardLayoutSlots;
    // title states
    title: Title;
    // sidebar states
    sidebarState: SidebarState;
    // slots
    setSlot: (
        slotName: SlotName,
        component: React.ReactNode | null,
    ) => () => void;
    resetSlots: () => void;
    // title actions
    setTitleSlot: (slot: React.ReactNode) => () => void;
    setTitle: (title: Title) => () => void;
    // sidebar actions
    setSidebarState: (state: SidebarState) => void;
    toggleSidebar: () => void;
};

export interface Branding {
    title?: string;
    logo?: React.ReactNode;
    homeUrl?: string;
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
    title?: React.ReactNode;
    middleActions?: React.ReactNode;
    endActions?: React.ReactNode;
    sidebar?: React.ReactNode;
};

export const SIDEBAR_STATE_STORAGE_KEY = "dashboard_sidebar_state";

export type SidebarState = "collapsed" | "expanded";

export type DashboardLayoutProviderProps = {
    branding?: Branding;
    navigation?: Navigation;
    slots?: DashboardLayoutSlots;
    children?: React.ReactNode;
};

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

type DashboardLayoutSlots = {
    title?: React.ReactNode;
    middle?: React.ReactNode;
    actions?: React.ReactNode;
    sidebar?: React.ReactNode;
};

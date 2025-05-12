export interface Column {
    id: string;
    label: string;
    type: string;
    accessor: string | ((row: any) => any);
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    filterMode?: "inline" | "popover";
    // Server operations
    serverSortable?: boolean;
    serverFilterable?: boolean;
    widthStorageKey?: string;
}

export interface LoadMoreParams {
    visibleStartIndex: number;
    visibleStopIndex: number;
}

// Define column pin position type
export type PinPosition = "left" | "right" | null;

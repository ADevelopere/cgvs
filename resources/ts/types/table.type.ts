export type ColumnTypes =
    | "text"
    | "number"
    | "date"
    | "select"
    | "boolean"
    | "country"
    | "phone"
    | "custom";

export type BaseColumn = {
    id: string;
    type: ColumnTypes;
    label: string;
    accessor: string | ((row: any) => any);
    editable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    resizable?: boolean;
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    widthStorageKey?: string;
    options?: { label: string; value: any }[]; // For select type columns
};

export type EditableColumn = BaseColumn & {
    onUpdate?: (rowId: string | number, value: any) => Promise<void>;
    getIsValid?: (value: any) => string | null | undefined;
};

export interface LoadMoreParams {
    visibleStartIndex: number;
    visibleStopIndex: number;
}

// Define column pin position type
export type PinPosition = "left" | "right" | null;

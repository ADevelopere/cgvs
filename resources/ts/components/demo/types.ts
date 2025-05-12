import type React from "react";
import type { FilterClause } from "@/types/filters";
import { Column } from "@/types/table.type";
import { PaginatorInfo } from "@/graphql/generated/types";

export interface TableState {
    // Sort state
    sortBy: string | null;
    sortDirection: "asc" | "desc" | null;
    isLoading: boolean;

    // Filter state
    filters: Record<string, FilterClause<any, any>>;

    // Row styling toggle
    useCustomRowStyle: boolean;

    // Pagination state
    usePagination: boolean;
    currentPage: number;
    rowsPerPage: number;

    // State to track loaded rows for infinite scroll mode
    loadedRows: any[];

    // Server operation mode state
    serverOperationMode: boolean;
    serverSortedData: any[];
    serverFilters: FilterClause<any, any>[];
    serverFilteredData: any[];

    // Server filter UI mode
    serverFilterUi: "popover" | "inlineHeaderRow";
}

export interface DemoTableContextType extends TableState {
    // Setters
    setSortBy: (sortBy: string | null) => void;
    setSortDirection: (direction: "asc" | "desc" | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setFilters: React.Dispatch<
        React.SetStateAction<Record<string, FilterClause<any, any>>>
    >;
    setUseCustomRowStyle: (useCustomRowStyle: boolean) => void;
    setUsePagination: (usePagination: boolean) => void;
    setCurrentPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
    setLoadedRows: React.Dispatch<React.SetStateAction<any[]>>;
    setServerOperationMode: (mode: boolean) => void;
    setServerSortedData: React.Dispatch<React.SetStateAction<any[]>>;
    setServerFilters: React.Dispatch<
        React.SetStateAction<FilterClause<any, any>[]>
    >;
    setServerFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
    setServerFilterUi: (mode: "popover" | "inlineHeaderRow") => void;

    // Computed values
    filteredDataset: any[];
    sortedAndFilteredDataset: any[];
    filteredTotalRows: number;
    paginatorInfo: PaginatorInfo | null;
    displayData: any[];

    // Original data
    originalDataset: any[];
    columns: Column[];
}

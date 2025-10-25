"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { AnyColumn, Table, TableProvider } from "@/client/components/Table";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/components/Table/constants";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FilterClause } from "@/client/types/filters";
import { useRecipientTable } from "./hooks/useRecipientTable";

interface RecipientTableProps<
  TRowData,
  TRowId extends string | number = string | number,
> {
  // Data
  data: TRowData[];
  getRowId: (row: TRowData) => TRowId;
  loading: boolean;
  pageInfo?: Graphql.PageInfo;
  // Operations (externally managed)
  filters: Record<string, FilterClause | null>;
  queryParams: {
    orderBy?:
      | Graphql.StudentsOrderByClause[]
      | Graphql.StudentsOrderByClause
      | null;
  };
  setColumnFilter: (
    filterClause: FilterClause | null,
    columnId: string
  ) => void;
  clearFilter: (columnId: string) => void;
  updateSort: (
    orderByClause: {
      column: string;
      order: Graphql.OrderSortDirection;
    }[]
  ) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;

  // Selection
  selectedRowIds: TRowId[];
  onSelectionChange: (ids: TRowId[]) => void;

  // Footer customization
  footerStartContent: React.ReactNode;
  footerEndContent: React.ReactNode;

  // UI
  isMobile: boolean;
}

const RecipientTable = <
  TRowData,
  TRowId extends string | number = string | number,
>({
  data,
  getRowId,
  loading,
  pageInfo,
  filters,
  queryParams,
  setColumnFilter,
  clearFilter,
  updateSort,
  onPageChange,
  onRowsPerPageChange,
  selectedRowIds,
  onSelectionChange,
  footerStartContent,
  footerEndContent,
  isMobile,
}: RecipientTableProps<TRowData, TRowId>) => {
  // Get columns from table hook
  const { columns } = useRecipientTable({
    filters,
    queryParams,
    setColumnFilter,
    clearFilter,
    updateSort,
  });

  const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
    {}
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const widthsInitialized = useRef(false);

  // Initialize column widths as ratios of total available width
  useEffect(() => {
    if (!tableContainerRef.current || widthsInitialized.current) return;

    const newWidths: Record<string, number> = {};

    // Calculate total container width minus scrollbar and margins
    const containerWidth = tableContainerRef.current.offsetWidth - 20;

    // Calculate the sum of all initial width ratios
    const totalRatio = columns.reduce(
      (sum, col) => sum + (col.initialWidth || 100),
      0
    );

    // Calculate actual widths based on ratios
    columns.forEach(column => {
      const ratio = (column.initialWidth || 100) / totalRatio;
      newWidths[column.id] = Math.floor(containerWidth * ratio);
    });

    setInitialWidths(newWidths);
    widthsInitialized.current = true;
  }, [columns]);

  return (
    <TableProvider
      data={data}
      isLoading={loading}
      columns={columns as unknown as readonly AnyColumn<TRowData, TRowId>[]}
      dataProps={{
        onFilterChange: setColumnFilter,
        onSort: updateSort,
        filters,
      }}
      columnProps={{
        initialWidths,
      }}
      rowsProps={{
        getRowId,
        enableRowResizing: false,
        rowSelectionEnabled: true,
      }}
      pageInfo={pageInfo}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      footerStartContent={footerStartContent}
      footerEndContent={footerEndContent}
      selectedRowIds={selectedRowIds}
      onSelectionChange={selectedIds => onSelectionChange(selectedIds)}
      hideRowsPerPage={isMobile}
      compact={isMobile}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 300px)",
          overflow: "hidden",
        }}
      >
        <Box
          ref={tableContainerRef}
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {widthsInitialized.current &&
            Object.keys(initialWidths).length > 0 && (
              <Table
                style={{
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              />
            )}
        </Box>
      </Box>
    </TableProvider>
  );
};

export default RecipientTable;

"use client";

import React from "react";
import { Box } from "@mui/material";
import { Table, type AnyColumn } from "@/client/components/Table";
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 300px)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Table<TRowData, TRowId>
          data={data}
          isLoading={loading}
          columns={columns as readonly AnyColumn<TRowData, TRowId>[]}
          getRowId={getRowId}
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
          initialWidths={{}}
          enableRowResizing={false}
          rowSelectionEnabled={true}
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        />
      </Box>
    </Box>
  );
};

export default RecipientTable;

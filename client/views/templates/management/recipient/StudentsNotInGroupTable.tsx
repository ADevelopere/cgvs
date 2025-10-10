"use client";

import React, {
 useMemo,
 useRef,
 useState,
 useEffect,
 useCallback,
} from "react";
import { Box, Paper } from "@mui/material";
import { TableProvider } from "@/client/components/Table/Table/TableContext";
import Table from "@/client/components/Table/Table/Table";
import { useRecipientManagement } from "@/client/contexts/recipient";
import { BaseColumn } from "@/client/types/table.type";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/constants/tableConstants";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
 FilterClause,
 TextFilterOperation,
 DateFilterOperation,
} from "@/client/types/filters";
import * as StudentUtils from "@/client/contexts/student/utils/filter";
import logger from "@/lib/logger";

// Map column IDs to GraphQL column names for sorting
const mapColumnIdToGraphQLColumn = (
 columnId: string,
): Graphql.StudentsOrderByColumn | null => {
 const columnMap: Record<string, Graphql.StudentsOrderByColumn> = {
  id: "ID",
  name: "NAME",
  email: "EMAIL",
  dateOfBirth: "DATE_OF_BIRTH",
  gender: "GENDER",
  createdAt: "CREATED_AT",
  updatedAt: "UPDATED_AT",
  // phoneNumber and nationality are not sortable in the GraphQL schema
 };

 return columnMap[columnId] || null;
};

const StudentsNotInGroupTable: React.FC = () => {
 const {
  students,
  pageInfo,
  loading,
  onPageChange,
  onRowsPerPageChange,
  fetchStudentsNotInGroup,
  selectedGroupId,
 } = useRecipientManagement();

 const [activeFilters, setActiveFilters] = useState<
  Record<string, FilterClause | null>
 >({});
 const [initialWidths, setInitialWidths] = useState<Record<string, number>>({});
 const tableContainerRef = useRef<HTMLDivElement>(null);
 const widthsInitialized = useRef(false);

 // Define columns for the table - simpler version without custom renders
 const baseColumns: BaseColumn[] = useMemo(
  () => [
   {
    id: "name",
    label: "الاسم",
    type: "text",
    accessor: "name",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 200,
   },
   {
    id: "nationality",
    label: "الجنسية",
    type: "country",
    accessor: "nationality",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
   },
   {
    id: "dateOfBirth",
    label: "تاريخ الميلاد",
    type: "date",
    accessor: "dateOfBirth",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
   },
   {
    id: "gender",
    label: "الجنس",
    type: "select",
    accessor: "gender",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 100,
    options: [
     { label: "ذكر", value: "Male" },
     { label: "أنثى", value: "Female" },
    ],
   },
   {
    id: "email",
    label: "البريد الإلكتروني",
    type: "text",
    accessor: "email",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 200,
   },
   {
    id: "createdAt",
    label: "تاريخ الإضافة",
    type: "date",
    accessor: "createdAt",
    editable: false,
    sortable: true,
    filterable: true,
    resizable: false,
    initialWidth: 150,
   },
  ],
  [],
 );

 // Initialize column widths
 useEffect(() => {
  if (!tableContainerRef.current || widthsInitialized.current) return;

  const newWidths: Record<string, number> = {};

  baseColumns.forEach((column) => {
   if (column.initialWidth) {
    newWidths[column.id] = column.initialWidth;
   }
  });

  setInitialWidths(newWidths);
  widthsInitialized.current = true;
 }, [baseColumns]);

 // Handle filter changes
 const handleFilterChange = useCallback(
  (filterClause: FilterClause | null, columnId: string) => {
   setActiveFilters((prev) => ({
    ...prev,
    [columnId]: filterClause,
   }));
  },
  [],
 );

 // Convert active filters to StudentFilterArgs
 useEffect(() => {
  if (!selectedGroupId) return;

  const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

  Object.values(activeFilters).forEach((filterClause) => {
   if (!filterClause) return;

   const columnId = filterClause.columnId as keyof Graphql.Student;
   const column = baseColumns.find((col) => col.id === columnId);
   if (!column) return;

   let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
   if (column.type === "text") {
    mappedFilter = StudentUtils.mapTextFilter(
     columnId,
     filterClause.operation as TextFilterOperation,
     filterClause.value as string,
    );
   } else if (column.type === "date") {
    mappedFilter = StudentUtils.mapDateFilter(
     columnId,
     filterClause.operation as DateFilterOperation,
     filterClause.value as { from?: Date; to?: Date },
    );
   }
   Object.assign(newFilterArgs, mappedFilter);
  });

  fetchStudentsNotInGroup(selectedGroupId, undefined, undefined, newFilterArgs);
 }, [activeFilters, selectedGroupId, fetchStudentsNotInGroup, baseColumns]);

 // Handle sort changes
 const handleSort = useCallback(
  (orderByClause: { column: string; order: Graphql.OrderSortDirection }[]) => {
   if (!selectedGroupId) return;

   const graphqlOrderBy: Graphql.StudentsOrderByClause[] = [];

   orderByClause.forEach((clause) => {
    const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
    if (!graphqlColumn) {
     logger.warn(`Column ${clause.column} is not sortable in GraphQL schema`);
     return;
    }
    graphqlOrderBy.push({
     column: graphqlColumn,
     order: clause.order,
    });
   });

   fetchStudentsNotInGroup(
    selectedGroupId,
    graphqlOrderBy,
    undefined,
    undefined,
   );
  },
  [selectedGroupId, fetchStudentsNotInGroup],
 );

 return (
  <TableProvider
   data={students}
   isLoading={loading}
   columns={baseColumns}
   dataProps={{
    onFilterChange: handleFilterChange,
    onSort: handleSort,
    filters: activeFilters,
   }}
   columnProps={{
    initialWidths,
   }}
   rowsProps={{
    enableRowResizing: false,
   }}
   pageInfo={pageInfo || undefined}
   onPageChange={onPageChange}
   onRowsPerPageChange={onRowsPerPageChange}
   rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
  >
   <Paper
    sx={{
     display: "flex",
     flexDirection: "column",
     height: "100%",
     overflow: "hidden",
    }}
   >
    <Box
     ref={tableContainerRef}
     sx={{
      flexGrow: 1,
      overflow: "hidden",
      "& table": {
       width: "100%",
       borderCollapse: "collapse",
       tableLayout: "fixed",
       backgroundColor: "background.paper",
       color: "text.primary",
       borderColor: "divider",
      },
      "& tr:hover td": {
       backgroundColor: "action.hover",
      },
      "& th, & td": {
       borderColor: "divider",
      },
     }}
    >
     {widthsInitialized.current && Object.keys(initialWidths).length > 0 && (
      <Table
       style={{
        height: "100%",
        overflow: "hidden",
       }}
      />
     )}
    </Box>
   </Paper>
  </TableProvider>
 );
};

export default StudentsNotInGroupTable;

"use client";

import React, {
 useMemo,
 useRef,
 useState,
 useEffect,
 useCallback,
} from "react";
import {
 Box,
 Button,
 Typography,
 Dialog,
 DialogTitle,
 DialogContent,
 DialogContentText,
 DialogActions,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import Link from "next/link";
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
import { useAppTranslation } from "@/client/locale";
import { useTableRowsContext } from "@/client/components/Table/Table/TableRowsContext";

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
 };

 return columnMap[columnId] || null;
};

// Footer start content component - shows selection count and clear button
const FooterStartContent: React.FC = () => {
 const strings = useAppTranslation("recipientGroupTranslations");
 const { selectedRowIds, clearAllSelections } = useTableRowsContext();
 const [openClearDialog, setOpenClearDialog] = useState(false);

 const handleClearClick = () => {
  setOpenClearDialog(true);
 };

 const handleClearConfirm = () => {
  clearAllSelections();
  setOpenClearDialog(false);
 };

 const handleClearCancel = () => {
  setOpenClearDialog(false);
 };

 return (
  <>
   <Box
    sx={{
     display: "flex",
     gap: 1,
     alignItems: "center",
     justifyContent: "space-between",
    }}
   >
    <Typography variant="body2" color="primary" fontWeight={600}>
     {strings.selectedStudents} {selectedRowIds.length}
    </Typography>
    {selectedRowIds.length > 0 && (
     <Button
      variant="outlined"
      size="small"
      color="error"
      onClick={handleClearClick}
      sx={{ minWidth: "auto" }}
     >
      {strings.clearAllSelection}
     </Button>
    )}
   </Box>

   <Dialog open={openClearDialog} onClose={handleClearCancel}>
    <DialogTitle>{strings.confirmClearSelection}</DialogTitle>
    <DialogContent>
     <DialogContentText>
      {strings.confirmClearSelectionMessage}
     </DialogContentText>
    </DialogContent>
    <DialogActions>
     <Button onClick={handleClearCancel} color="primary">
      {strings.cancel}
     </Button>
     <Button onClick={handleClearConfirm} color="error" variant="contained">
      {strings.clearAllSelection}
     </Button>
    </DialogActions>
   </Dialog>
  </>
 );
};

// Footer end content component - shows action buttons
const FooterEndContent: React.FC = () => {
 const strings = useAppTranslation("recipientGroupTranslations");
 const { selectedRowIds } = useTableRowsContext();
 const { addStudentsToGroup, loading } = useRecipientManagement();
 const [openAddDialog, setOpenAddDialog] = useState(false);

 const handleAddClick = () => {
  setOpenAddDialog(true);
 };

 const handleAddConfirm = async () => {
  const success = await addStudentsToGroup(selectedRowIds);
  if (success) {
   setOpenAddDialog(false);
   // Table selection will be automatically cleared after data refresh
  }
 };

 const handleAddCancel = () => {
  setOpenAddDialog(false);
 };

 return (
  <>
   <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
    <Button
     component={Link}
     href="/admin/students"
     size="small"
     endIcon={<OpenInNew fontSize="small" />}
     sx={{
      textTransform: "none",
      textDecoration: "none",
      color: "primary.main",
      fontWeight: 400,
      padding: "4px 8px",
      minWidth: "auto",
      "&:hover": {
       textDecoration: "underline",
       backgroundColor: "transparent",
      },
     }}
    >
     {strings.goToStudentsPage}
    </Button>
    <Button
     variant="contained"
     size="small"
     disabled={selectedRowIds.length === 0 || loading}
     onClick={handleAddClick}
    >
     {strings.addToGroup}
    </Button>
   </Box>

   <Dialog open={openAddDialog} onClose={handleAddCancel}>
    <DialogTitle>{strings.confirmAddStudents}</DialogTitle>
    <DialogContent>
     <DialogContentText>{strings.confirmAddStudentsMessage}</DialogContentText>
    </DialogContent>
    <DialogActions>
     <Button onClick={handleAddCancel} color="primary">
      {strings.cancel}
     </Button>
     <Button
      onClick={handleAddConfirm}
      color="primary"
      variant="contained"
      disabled={loading}
     >
      {strings.addToGroup}
     </Button>
    </DialogActions>
   </Dialog>
  </>
 );
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

 // Define columns for the table
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

 // Initialize column widths as ratios of total available width
 useEffect(() => {
  if (!tableContainerRef.current || widthsInitialized.current) return;

  const newWidths: Record<string, number> = {};

  // Calculate total container width minus scrollbar and margins
  const containerWidth = tableContainerRef.current.offsetWidth - 20;

  // Calculate the sum of all initial width ratios
  const totalRatio = baseColumns.reduce(
   (sum, col) => sum + (col.initialWidth || 100),
   0,
  );

  // Calculate actual widths based on ratios
  baseColumns.forEach((column) => {
   const ratio = (column.initialWidth || 100) / totalRatio;
   newWidths[column.id] = Math.floor(containerWidth * ratio);
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
  (
   orderByClause: {
    column: string;
    order: Graphql.OrderSortDirection;
   }[],
  ) => {
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
    rowSelectionEnabled: true,
    rowIdKey: "id",
   }}
   pageInfo={pageInfo || undefined}
   onPageChange={onPageChange}
   onRowsPerPageChange={onRowsPerPageChange}
   rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
   footerStartContent={<FooterStartContent />}
   footerEndContent={<FooterEndContent />}
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
     {widthsInitialized.current && Object.keys(initialWidths).length > 0 && (
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

export default StudentsNotInGroupTable;

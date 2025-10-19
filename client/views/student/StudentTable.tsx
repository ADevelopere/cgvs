"use client";

import type React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import { useAppTranslation } from "@/client/locale";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TableProvider } from "@/client/components/Table/Table/TableContext";
import Table from "@/client/components/Table/Table/Table";
import CreateStudentRow from "./CreateStudentRow";
import { loadFromLocalStorage } from "@/client/utils/localStorage";
import { ROWS_PER_PAGE_OPTIONS } from "@/client/constants/tableConstants";
import { useStudentOperations } from "./useStudentOperations";
import { useStudentTable } from "./useStudentTable";
import * as Document from "./hook/student.documents";

const StudentManagementDashboardTitle: React.FC = () => {
  const strings = useAppTranslation("studentTranslations");
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", paddingInlineStart: 1 }}
      gap={1}
    >
      <People color="primary" />
      <Typography variant="h6" component="div">
        {strings?.studentManagement}
      </Typography>
    </Stack>
  );
};

const StudentTable: React.FC = () => {
  // Get operations and store state
  const {
    queryParams,
    filters,
    onPageChange,
    onRowsPerPageChange,
    setColumnFilter,
    updateSort,
  } = useStudentOperations();

  // Fetch students directly with useQuery - Apollo handles refetch automatically
  const { data, loading } = useQuery(Document.studentsQueryDocument, {
    variables: queryParams,
    fetchPolicy: "cache-first",
  });

  const students = data?.students?.data ?? [];
  const pageInfo = data?.students?.pageInfo;

  const { setDashboardSlot } = useDashboardLayout();
  useEffect(() => {
    setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

    return () => {
      setDashboardSlot("titleRenderer", null);
    };
  }, [setDashboardSlot]);

  // Get columns from table hook
  const { columns } = useStudentTable();

  const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
    {}
  );
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const widthsInitialized = useRef(false);

  const maxIndexValue = useMemo(() => {
    return pageInfo ? pageInfo.total : students.length;
  }, [pageInfo, students.length]);

  const indexColWidth = useMemo(() => {
    const maxDigits = maxIndexValue.toString().length;
    return Math.max(50, maxDigits * 15 + 20); // Minimum width of 50px, 10px per digit, and 20px padding
  }, [maxIndexValue]);

  useEffect(() => {
    if (!tableContainerRef.current || widthsInitialized.current) return;
    // minus scroll bar width
    const totalWidth =
      tableContainerRef.current.offsetWidth - 20 - indexColWidth;

    const newWidths: Record<string, number> = {};

    // First, handle non-resizable columns and load from localStorage
    let totalFixedWidth = 0;
    columns.forEach(column => {
      if (!column.resizable) {
        if (column.initialWidth) {
          newWidths[column.id] = column.initialWidth;
          totalFixedWidth += column.initialWidth;
        } else {
          // Non-resizable columns must have initialWidth
          newWidths[column.id] = 100; // Fallback width
          totalFixedWidth += 100;
        }
      }
    });

    // Then distribute remaining width among resizable columns
    const resizableColumns = columns.filter(
      col => col.resizable && !newWidths[col.id] // Only include columns not already set
    );

    if (resizableColumns.length > 0) {
      const remainingWidth = Math.max(totalWidth - totalFixedWidth, 0);
      const widthPerColumn = Math.floor(
        remainingWidth / resizableColumns.length
      );

      resizableColumns.forEach(column => {
        newWidths[column.id] = Math.max(widthPerColumn, 50); // Ensure minimum width
      });
    }

    columns.forEach(column => {
      if (column.widthStorageKey) {
        const savedWidth = loadFromLocalStorage<string>(column.widthStorageKey);
        if (savedWidth) {
          newWidths[column.id] = Math.max(parseInt(savedWidth, 10), 50);
          return;
        }
      }
    });

    setInitialWidths(newWidths);
    // Save widths to state
    widthsInitialized.current = true;
  }, [columns, indexColWidth, tableContainerRef]);

  return (
    <TableProvider
      data={students}
      isLoading={loading}
      columns={columns}
      dataProps={{
        onFilterChange: setColumnFilter,
        onSort: updateSort,
        filters,
      }}
      columnProps={{
        initialWidths: initialWidths,
      }}
      rowsProps={{
        // rowIdKey: rowIdKey,
        // onLoadMoreRows: loadMoreRows,
        // getRowStyle: getRowStyle,
        // rowSelectionEnabled: enableRowSelection,
        // selectedRowIds={selectedRowIds}
        // totalRows: filteredTotalRows,
        // pageSize: 50,
        enableRowResizing: false,
      }}
      // Server operation props
      // serverFilterUi={serverFilterUi}
      // Selection props
      // onSelectionChange={handleSelectionChange}
      // Pagination props
      pageInfo={pageInfo}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      // initialPageSize={100}
      // Sorting props
      initialOrderBy={
        Array.isArray(queryParams.orderBy)
          ? queryParams.orderBy
              .filter(clause => clause.order) // Filter out null/undefined orders
              .map(clause => ({
                column: clause.column.toLowerCase(),
                order: clause.order as "ASC" | "DESC",
              }))
          : queryParams.orderBy?.order
            ? [
                {
                  column: queryParams.orderBy.column.toLowerCase(),
                  order: queryParams.orderBy.order as "ASC" | "DESC",
                },
              ]
            : []
      }
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          maxWidth: "calc(100vw - 48px)",
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
          id="student-table"
        >
          {widthsInitialized.current &&
            // check if initialWidths is not empty
            Object.keys(initialWidths).length > 0 && (
              <Table
                style={{
                  height: "100%",
                  overflow: "hidden",
                  maxWidth: "calc(100vw - 48px)",
                }}
                creationRow={<CreateStudentRow />}
              />
            )}
        </Box>
      </Paper>
    </TableProvider>
  );
};

export default StudentTable;

"use client";

import type React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import useAppTranslation from "@/locale/useAppTranslation";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { useEffect, useRef, useState } from "react";
import { TableProvider } from "@/components/Table/Table/TableContext";
import Table from "@/components/Table/Table/Table";
import { useStudentFilter } from "@/contexts/student/StudentFilterContext";
import {
    useStudentTableManagement,
} from "@/contexts/student/StudentTableManagementContext";

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
    const { students, paginationInfo, loading } = useStudentManagement();
    const { applySingleFilter, updateSort } = useStudentFilter();

    const { setDashboardSlot } = useDashboardLayout();
    useEffect(() => {
        setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

        return () => {
            setDashboardSlot("titleRenderer", null);
        };
    }, [setDashboardSlot]);

    const { columns, onPageChange, onRowsPerPageChange } = useStudentTableManagement();

    const [initialWidths, setInitialWidths] = useState<Record<string, number>>(
        {},
    );
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const widthsInitialized = useRef(false);
    useEffect(() => {
        if (!tableContainerRef.current || widthsInitialized.current) return;
        // minus scroll bar width
        const totalWidth = tableContainerRef.current.offsetWidth - 20;

        const newWidths: Record<string, number> = {};

        // First, handle non-resizable columns and load from localStorage
        let totalFixedWidth = 0;
        columns.forEach((column) => {
            if (!column.resizable) {
                if (column.initialWidth) {
                    newWidths[column.id] = column.initialWidth;
                    totalFixedWidth += column.initialWidth;
                } else {
                    // Non-resizable columns must have initialWidth
                    console.warn(
                        `Column ${column.id} is not resizable but has no initialWidth`,
                    );
                    newWidths[column.id] = 100; // Fallback width
                    totalFixedWidth += 100;
                }
            }
        });

        // Then distribute remaining width among resizable columns
        const resizableColumns = columns.filter(
            (col) => col.resizable && !newWidths[col.id], // Only include columns not already set
        );

        if (resizableColumns.length > 0) {
            const remainingWidth = Math.max(totalWidth - totalFixedWidth, 0);
            const widthPerColumn = Math.floor(
                remainingWidth / resizableColumns.length,
            );

            resizableColumns.forEach((column) => {
                newWidths[column.id] = Math.max(widthPerColumn, 50); // Ensure minimum width
            });
        }

        columns.forEach((column) => {
            if (column.widthStorageKey) {
                const savedWidth = localStorage.getItem(column.widthStorageKey);
                if (savedWidth) {
                    newWidths[column.id] = Math.max(
                        parseInt(savedWidth, 10),
                        50,
                    );
                    return;
                }
            }
        });

        console.log("Table, initial column widths", JSON.stringify(newWidths));
        setInitialWidths(newWidths);
        // Save widths to state
        widthsInitialized.current = true;
    }, [columns, tableContainerRef]);

    return (
        <TableProvider
            data={students}
            isLoading={loading}
            columns={columns}
            dataProps={{
                onFilter: applySingleFilter,
                onSort: updateSort,
                // filters: { filters },
                // serverOperationMode: serverOperationMode,
                // onServerSortChange: handleServerSortChange,
                // onServerFiltersChange: handleServerFiltersChange,
            }}
            columnProps={{
                initialWidths: initialWidths,
            }}
            rowsProps={
                {
                    // rowIdKey: rowIdKey,
                    // onLoadMoreRows: loadMoreRows,
                    // getRowStyle: getRowStyle,
                    // rowSelectionEnabled: enableRowSelection,
                    // selectedRowIds={selectedRowIds}
                    // totalRows: filteredTotalRows,
                    // pageSize: 50,
                }
            }
            // Server operation props
            // serverFilterUi={serverFilterUi}
            // Selection props
            // onSelectionChange={handleSelectionChange}
            // Pagination props
            paginationInfo={paginationInfo}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            // rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            // initialPageSize={100}
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
                            />
                        )}
                </Box>
            </Paper>
        </TableProvider>
    );
};


export default StudentTable;

"use client";

import type React from "react";
import { Paper, Stack, Typography, useTheme, Box } from "@mui/material";
import { People } from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import StudentTableHeader from "./StudentTableHeader";
import StudentTableFooter from "./StudentTableFooter";
import StudentTableFilter from "./StudentTableFilter";
import { initialStudentTableColumns, StudentTableColumnType } from "./types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useCallback, useEffect, useRef, useState } from "react";
import StudentTableRow from "./StudentTableRow";
import { useAppTheme } from "@/contexts/ThemeContext";
import { Student } from "@/graphql/generated/types";

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

export default function StudentTable() {
    const { students } = useStudentManagement();
    const { isRtl } = useAppTheme();

    // Initialize columns with values from localStorage
    const [columns, setColumns] = useState<StudentTableColumnType[]>(() => {
        console.log("Initializing columns from localStorage");
        return initialStudentTableColumns.map((col) => {
            if (col.widthStorageKey) {
                const savedWidth = localStorage.getItem(col.widthStorageKey);
                if (savedWidth) {
                    const numericWidth = parseFloat(savedWidth);
                    if (!isNaN(numericWidth)) {
                        let finalWidth = numericWidth;
                        if (col.minWidth) {
                            const min =
                                typeof col.minWidth === "string"
                                    ? parseFloat(col.minWidth)
                                    : col.minWidth;
                            if (finalWidth < min) finalWidth = min;
                        }
                        if (col.maxWidth) {
                            const max =
                                typeof col.maxWidth === "string"
                                    ? parseFloat(col.maxWidth)
                                    : col.maxWidth;
                            if (finalWidth > max) finalWidth = max;
                        }
                        return { ...col, width: finalWidth };
                    }
                }
            }
            return col;
        });
    });

    const { setDashboardSlot } = useDashboardLayout();
    useEffect(() => {
        setDashboardSlot("titleRenderer", <StudentManagementDashboardTitle />);

        return () => {
            setDashboardSlot("titleRenderer", null);
        };
    }, [setDashboardSlot]);

    // Resize logic state
    const resizingColumnRef = useRef<{
        columnIndex: number;
        startX: number;
        startWidth: number;
    } | null>(null);

    const updateColumnWidth = useCallback(
        (columnIndex: number, newWidth: number) => {
            setColumns((prevColumns) => {
                const newColumns = [...prevColumns];
                const column = newColumns[columnIndex];
                if (column) {
                    let constrainedWidth = newWidth;
                    if (column.minWidth) {
                        const min =
                            typeof column.minWidth === "string"
                                ? parseFloat(column.minWidth)
                                : column.minWidth;
                        if (constrainedWidth < min) constrainedWidth = min;
                    }
                    if (column.maxWidth) {
                        const max =
                            typeof column.maxWidth === "string"
                                ? parseFloat(column.maxWidth)
                                : column.maxWidth;
                        if (constrainedWidth > max) constrainedWidth = max;
                    }
                    newColumns[columnIndex] = {
                        ...column,
                        width: constrainedWidth,
                    };

                    if (column.widthStorageKey) {
                        localStorage.setItem(
                            column.widthStorageKey,
                            String(constrainedWidth),
                        );
                    }
                }
                return newColumns;
            });
        },
        [],
    );

    const handleResizeMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!resizingColumnRef.current) return;

            const clientX =
                "touches" in event ? event.touches[0].clientX : event.clientX;
            const { columnIndex, startX, startWidth } =
                resizingColumnRef.current;
            const diff = isRtl ? startX - clientX : clientX - startX;
            const newWidth = startWidth + diff;

            // Log resize details
            console.log(
                `Column Resize [${columns[columnIndex].id}]:`,
                JSON.stringify({
                    direction: isRtl ? "RTL" : "LTR",
                    startPosition: startX,
                    currentPosition: clientX,
                    movement: diff,
                    startWidth,
                    newWidth,
                    columnIndex,
                }),
            );

            updateColumnWidth(columnIndex, newWidth);
        },
        [isRtl],
    );

    const handleResizeStop = useCallback(() => {
        if (resizingColumnRef.current) {
            const { columnIndex, startWidth } = resizingColumnRef.current;
            const column = columns[columnIndex];
            const cellElement = document.getElementById(
                `headerTableCell-${column.id}`,
            );
            const finalWidth =
                cellElement instanceof HTMLElement
                    ? cellElement.getBoundingClientRect().width
                    : 0;

            // Log resize completion
            console.log(`Column Resize Complete [${column.id}]:`, {
                startWidth,
                finalWidth,
                change: finalWidth - startWidth,
                isRtl: isRtl,
            });

            // Log all column widths
            console.log(
                "Column Widths After Resize:",
                columns.map((col) => {
                    const element = document.getElementById(
                        `headerTableCell-${col.id}`,
                    );
                    return {
                        id: col.id,
                        width:
                            element instanceof HTMLElement
                                ? element.getBoundingClientRect().width
                                : null,
                        configuredWidth: col.width,
                        minWidth: col.minWidth,
                        maxWidth: col.maxWidth,
                    };
                }),
            );
        }

        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener(
            "touchmove",
            handleResizeMove as EventListener,
        );
        document.removeEventListener("mouseup", handleResizeStop);
        document.removeEventListener(
            "touchend",
            handleResizeStop as EventListener,
        );
        resizingColumnRef.current = null;
    }, [handleResizeMove]);

    const startResize = useCallback(
        (columnIndex: number, clientX: number, cellElementId: string) => {
            const columnToResize = columns[columnIndex];
            let currentWidthPx: number;

            const cellElement = document.getElementById(cellElementId);
            if (cellElement instanceof HTMLElement) {
                currentWidthPx = cellElement.getBoundingClientRect().width;
            } else if (typeof columnToResize.width === "number") {
                currentWidthPx = columnToResize.width;
            } else if (typeof columnToResize.width === "string") {
                currentWidthPx = parseFloat(columnToResize.width);
                // Corrected logic: if parsing fails, and we are in this branch (cellElement is null),
                // we directly use the fallback default width.
                // The previous attempt to use cellElement.getBoundingClientRect() here was flawed
                // as cellElement is null if the first `if (cellElement instanceof HTMLElement)` failed.
                if (isNaN(currentWidthPx)) {
                    currentWidthPx = 150;
                }
            } else {
                currentWidthPx = 150;
            }

            resizingColumnRef.current = {
                columnIndex,
                startX: clientX,
                startWidth: currentWidthPx,
            };

            document.addEventListener("mousemove", handleResizeMove);
            document.addEventListener(
                "touchmove",
                handleResizeMove as EventListener,
            );
            document.addEventListener("mouseup", handleResizeStop);
            document.addEventListener(
                "touchend",
                handleResizeStop as EventListener,
            );
        },
        [columns, handleResizeMove, handleResizeStop],
    );

    // State for filter popover
    const [filterAnchorEl, setFilterAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [currentFilterColumn, setCurrentFilterColumn] = useState<
        keyof Student | "actions" | null
    >(null);

    // Handle filter icon click
    const handleFilterClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: keyof Student | "actions",
    ) => {
        setFilterAnchorEl(event.currentTarget);
        setCurrentFilterColumn(columnId);
    };

    // Handle filter close
    const handleFilterClose = () => {
        setFilterAnchorEl(null);
        setCurrentFilterColumn(null);
    };

    return (
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
                sx={{
                    flexGrow: 1,
                    overflow: "auto",
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
                <table>
                    <StudentTableHeader
                        columns={columns}
                        onFilterClick={handleFilterClick}
                        onStartResize={startResize}
                    />
                    <tbody>
                        {students.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                                columns={columns}
                                onStartResize={startResize}
                            />
                        ))}
                    </tbody>
                </table>
            </Box>

            <StudentTableFooter />

            <StudentTableFilter
                anchorEl={filterAnchorEl}
                columnId={currentFilterColumn}
                onClose={handleFilterClose}
            />
        </Paper>
    );
}

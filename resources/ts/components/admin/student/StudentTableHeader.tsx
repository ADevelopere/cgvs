"use client";

import type React from "react";
import {
    Checkbox,
    IconButton,
    Box,
    Typography,
    Tooltip,
    useTheme,
} from "@mui/material";
import {
    FilterList as FilterListIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { StudentTableColumnType } from "./types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useEffect, useMemo } from "react";
import { OrderByClause, Student } from "@/graphql/generated/types";

type Props = {
    columns: StudentTableColumnType[];
    onFilterClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: keyof Student | "actions",
    ) => void;
    onStartResize: (
        columnIndex: number,
        clientX: number,
        cellElementId: string,
    ) => void;
};

export default function StudentTableHeader({
    columns,
    onFilterClick,
    onStartResize,
}: Props) {
    const strings = useAppTranslation("studentTranslations");
    const theme = useTheme();
    const isRtl = theme.direction === "rtl";

    useEffect(() => {
        console.log(
            "StudentTableHeader column's width updated ",
            JSON.stringify(
                columns.map((column) => column.label + ": " + column.width),
            ),
        );
    }, [columns]);

    const {
        students,
        selectedStudents,
        queryParams,
        setQueryParams,
        toggleStudentSelect,
    } = useStudentManagement();

    // Handle select all
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // Select all students
            students.forEach((student) => {
                if (!selectedStudents.includes(student.id)) {
                    toggleStudentSelect(student.id);
                }
            });
        } else {
            // Deselect all students
            students.forEach((student) => {
                if (selectedStudents.includes(student.id)) {
                    toggleStudentSelect(student.id);
                }
            });
        }
    };

    // Handle sort
    // Handle sort
    const handleSort = (columnId: string) => {
        const currentOrderBy: OrderByClause | OrderByClause[] =
            queryParams.orderBy || [];
        // Convert to array if single object
        const orderByArray = Array.isArray(currentOrderBy)
            ? currentOrderBy
            : [currentOrderBy];

        const columnIndex = orderByArray.findIndex(
            (order) => order.column === columnId.toUpperCase(),
        );

        let newOrderBy = [...orderByArray];

        if (columnIndex === -1) {
            // Add new sort
            newOrderBy.push({ column: columnId.toUpperCase(), order: "ASC" });
        } else if (newOrderBy[columnIndex].order === "ASC") {
            // Change to DESC
            newOrderBy[columnIndex] = {
                ...newOrderBy[columnIndex],
                order: "DESC",
            };
        } else {
            // Remove sort
            newOrderBy = newOrderBy.filter((_, index) => index !== columnIndex);
        }

        setQueryParams({ orderBy: newOrderBy });
    };

    // Get current sort direction for a column
    const getSortDirection = (columnId: string): "asc" | "desc" | null => {
        const currentOrderBy = queryParams.orderBy || [];
        // Convert to array if single object
        const orderByArray = Array.isArray(currentOrderBy)
            ? currentOrderBy
            : [currentOrderBy];

        const column = orderByArray.find(
            (order) => order.column === columnId.toUpperCase(),
        );

        if (!column) return null;
        return column.order.toLowerCase() as "asc" | "desc";
    };

    // Check if a column has an active filter
    const hasActiveFilter = (columnId: string): boolean => {
        // In a real implementation, you would check if there's an active filter for this column
        return false;
    };

    const sortTooltip = useMemo(() => {
        return (columnId: string) => {
            const sortDirection = getSortDirection(columnId);
            switch (sortDirection) {
                case null:
                    return strings?.sortAsc;
                case "asc":
                    return strings?.sortDesc;
                case "desc":
                    return strings?.clearSort;
                default:
                    return strings?.sortAsc;
            }
        };
    }, [getSortDirection, strings]);

    return (
        <thead>
            <tr
                style={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <th
                    style={{
                        borderInlineEnd: `1px solid ${theme.palette.divider}`,
                        width: 40,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 1px 0 ${theme.palette.divider}`,
                        color: theme.palette.text.primary,
                        padding: 0,
                    }}
                >
                    <Checkbox
                        slotProps={{
                            root: {
                                sx: {
                                    width: 40,
                                    height: 40,
                                },
                            },
                        }}
                        indeterminate={
                            selectedStudents.length > 0 &&
                            selectedStudents.length < students.length
                        }
                        checked={
                            students.length > 0 &&
                            selectedStudents.length === students.length
                        }
                        onChange={handleSelectAll}
                    />
                </th>

                {columns.map((column, index) => (
                    <th
                        key={column.id}
                        style={{
                            paddingInlineStart: 10,
                            borderInlineEnd: `1px solid ${theme.palette.divider}`,
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            position: "relative",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            padding: "16px 4px",
                            backgroundColor: theme.palette.background.paper,
                            top: 0,
                            zIndex: 2,
                            boxShadow: `0 1px 0 ${theme.palette.divider}`,
                            color: theme.palette.text.primary,
                        }}
                        id={`headerTableCell-${column.id}`}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                                pr:
                                    column.sortable || column.filterable
                                        ? 0
                                        : "10px",
                            }}
                            id={`headerTableCellBox-${column.id}`}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    minWidth: "max-content",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {strings ? strings[column.id] : column.label}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                {column.sortable && (
                                    <Tooltip
                                        title={sortTooltip(column.id)}
                                        arrow
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleSort(column.id)
                                            }
                                            sx={{ p: 0 }}
                                        >
                                            {getSortDirection(column.id) ===
                                                "asc" && (
                                                <ArrowUpwardIcon
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                            )}
                                            {getSortDirection(column.id) ===
                                                "desc" && (
                                                <ArrowDownwardIcon
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                            )}
                                            {getSortDirection(column.id) ===
                                                null && (
                                                <ArrowUpwardIcon
                                                    fontSize="small"
                                                    color="disabled"
                                                />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {column.filterable && (
                                    <Tooltip title={strings?.filter} arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                onFilterClick(e, column.id)
                                            }
                                            color={
                                                hasActiveFilter(column.id)
                                                    ? "primary"
                                                    : "default"
                                            }
                                            sx={{ p: 0 }}
                                        >
                                            <FilterListIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                            {/* Resizer */}
                            {index < columns.length + 1 && (
                                <Box
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onStartResize(
                                            index,
                                            e.clientX,
                                            `headerTableCell-${column.id}`,
                                        );
                                    }}
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        onStartResize(
                                            index,
                                            e.touches[0].clientX,
                                            `headerTableCell-${column.id}`,
                                        );
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        bottom: 0,
                                        [isRtl ? "right" : "left"]: "-5px",
                                        width: 10,
                                        cursor: "col-resize",
                                        zIndex: 10,
                                        "&:hover": {
                                            backgroundColor:
                                                theme.palette.action.hover,
                                        },
                                    }}
                                />
                            )}
                        </Box>
                    </th>
                ))}

                <th
                    style={{
                        width: "100px",
                        minWidth: "80px",
                        whiteSpace: "nowrap",
                        padding: "16px 4px",
                        backgroundColor: theme.palette.background.paper,
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                    }}
                >
                    {strings?.actions}
                </th>
            </tr>
        </thead>
    );
}

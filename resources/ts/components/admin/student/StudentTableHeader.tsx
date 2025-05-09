"use client";

import type React from "react";
import {
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    IconButton,
    Box,
    Typography,
    Tooltip,
} from "@mui/material";
import {
    FilterList as FilterListIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { StudentTableColumns } from "./types";
import useAppTranslation from "@/locale/useAppTranslation";
import { useMemo } from "react";

type Props = {
    onFilterClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: string,
    ) => void;
};

export default function StudentTableHeader({ onFilterClick }: Props) {
    const strings = useAppTranslation("studentTranslations");

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
    const handleSort = (columnId: string) => {
        const currentOrderBy = queryParams.orderBy || [];
        const columnIndex = currentOrderBy.findIndex(
            (order) => order.column === columnId.toUpperCase(),
        );

        let newOrderBy = [...currentOrderBy];

        if (columnIndex === -1) {
            // Add new sort
            newOrderBy.push({ column: columnId.toUpperCase(), order: "ASC" });
        } else if (currentOrderBy[columnIndex].order === "ASC") {
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
        const column = currentOrderBy.find(
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
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
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
                </TableCell>

                {StudentTableColumns.map((column) => (
                    <TableCell key={column.id}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    minWidth: "max-content",
                                }}
                            >
                                {strings ? strings[column.id] : column.label}
                            </Typography>

                            <Box sx={{ display: "flex" }}>
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
                                            sx={{
                                                p:0
                                            }}
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
                                            sx={{
                                                p:0
                                            }}
                                        >
                                            <FilterListIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                    </TableCell>
                ))}

                <TableCell>{strings?.actions}</TableCell>
            </TableRow>
        </TableHead>
    );
}

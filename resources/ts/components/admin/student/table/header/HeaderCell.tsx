import type React from "react";
import { IconButton, Box, Typography, Tooltip } from "@mui/material";
import {
    FilterList as FilterListIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { useMemo } from "react";
import { OrderByClause, Student } from "@/graphql/generated/types";
import { useAppTheme } from "@/contexts/ThemeContext";
import Resizer from "@/components/splitPane/Resizer";
import { StudentTableColumnType } from "../types";
import { useStudentTableUiContext } from "../StudentTableUiContext";

const HeaderCellData: React.FC<{
    column: StudentTableColumnType;
    columnWidth: number;
    onFilterClick: (
        event: React.MouseEvent<HTMLButtonElement>,
        columnId: keyof Student | "actions",
    ) => void;
}> = ({ column, columnWidth, onFilterClick }) => {
    const strings = useAppTranslation("studentTranslations");
    const { theme } = useAppTheme();
    const { startResize, handleSort, getSortDirection } =
        useStudentTableUiContext();

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
        <th
            key={column.id}
            style={{
                paddingInlineStart: 10,
                marginInlineEnd: 10,
                borderInlineEnd: `1px solid ${theme.palette.divider}`,
                width: columnWidth,
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 1px 0 ${theme.palette.divider}`,
            }}
            id={`headerTableCell-${column.id}`}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    paddingInlineStart:
                        column.sortable || column.filterable ? 0 : "10px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
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
                        <Tooltip title={sortTooltip(column.id)} arrow>
                            <IconButton
                                size="small"
                                onClick={() => handleSort(column.id)}
                                sx={{ p: 0 }}
                            >
                                {getSortDirection(column.id) === "asc" && (
                                    <ArrowUpwardIcon
                                        fontSize="small"
                                        color="primary"
                                    />
                                )}
                                {getSortDirection(column.id) === "desc" && (
                                    <ArrowDownwardIcon
                                        fontSize="small"
                                        color="primary"
                                    />
                                )}
                                {getSortDirection(column.id) === null && (
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
                                onClick={(e) => onFilterClick(e, column.id)}
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
            </Box>
        </th>
    );
};

export default HeaderCellData;

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
    headerHeight: number;
}> = ({ column, columnWidth, onFilterClick, headerHeight }) => {
    const strings = useAppTranslation("studentTranslations");
    const { theme } = useAppTheme();
    const { queryParams, setQueryParams } = useStudentManagement();
    const { startResize } = useStudentTableUiContext();

    // Check if a column has an active filter
    const hasActiveFilter = (columnId: string): boolean => {
        // In a real implementation, you would check if there's an active filter for this column
        return false;
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
                    display: "flex",
                    alignItems: "center",
                    color: "text.primary",
                }}
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
                <Resizer
                    allowResize={true}
                    orientation="vertical"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        startResize(
                            column.id,
                            e.clientX,
                            `headerTableCell-${column.id}`,
                        );
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        startResize(
                            column.id,
                            e.touches[0].clientX,
                            `headerTableCell-${column.id}`,
                        );
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="resizer"
                    containerStyle={{
                        maxHeight: `${headerHeight}px`,
                        minHeight: `${headerHeight}px`,
                    }}
                    internalStyle={{
                        left: "-10%",
                    }}
                    normalWidth={1}
                    whileResizingWidth={2}
                />
            </Box>
        </th>
    );
};

export default HeaderCellData;

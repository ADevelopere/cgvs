import React, { useCallback, useMemo } from "react";

import type { FunctionComponent } from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton, Tooltip, Badge } from "@mui/material";
import {
    ArrowUpward,
    ArrowDownward,
    UnfoldMore,
    FilterList,
    MoreVert,
    PushPin,
} from "@mui/icons-material";
import ResizeHandle from "./ResizeHandle";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableStyles } from "@/theme/styles";
import { EditableColumn, PinPosition } from "@/types/table.type";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "@/constants/tableConstants";

export interface ColumnHeaderProps {
    column: EditableColumn;
    onOptionsClick: (
        e: React.MouseEvent<HTMLElement>,
        columnId: string,
    ) => void;
    onPopoverFilterIconClick: (e: React.MouseEvent, columnId: string) => void;
    onTextFilterIconClick: (e: React.MouseEvent, columnId: string) => void;
    isPinned: PinPosition;
}

const ColumnHeaderCell: FunctionComponent<ColumnHeaderProps> = ({
    column,
    onOptionsClick,
    onPopoverFilterIconClick,
    onTextFilterIconClick,
    isPinned,
}) => {
    const { filters, getSortDirection, sort, filter } = useTableDataContext();
    const {
        pinnedLeftStyle,
        pinnedRightStyle,
        resizeColumn,
        setColumnWidth,
        columnWidths,
    } = useTableColumnContext();
    const sortDirection = useMemo(
        () => getSortDirection(column.id),
        [column.id, getSortDirection],
    );

    const columnWidth = useMemo(() => columnWidths[column.id], [columnWidths]);
    if (column.id === "status") {
        console.log(
            "ColumnHeaderCell column: ",
            column.id,
            "width:",
            columnWidth,
        );
    }
    const theme = useTheme();
    const [tempFilterValue, setTempFilterValue] = React.useState("");

    // Base header cell style
    const { thStyle } = useTableStyles();

    // Apply appropriate styles based on pin position
    let thStyleWithPin = { ...thStyle };
    if (isPinned === "left") {
        thStyleWithPin = { ...thStyle, ...pinnedLeftStyle };
    } else if (isPinned === "right") {
        thStyleWithPin = { ...thStyle, ...pinnedRightStyle };
    }

    // Check if column has an active filter
    const isFiltered = !!filters[column.id];

    // Determine if the column is sortable in the current mode
    const isSortable = column.sortable;

    // Determine if the column is filterable in the current mode
    const isFilterable = column.filterable;

    // Handle header click for sorting
    const handleHeaderClick = useCallback(
        (e: React.MouseEvent) => {
            // Don't trigger sort if we're clicking on the resize handle or any icon button
            if (
                (e.target as HTMLElement).classList.contains("resize-handle") ||
                (e.target as HTMLElement).closest(".header-icon-button")
            ) {
                return;
            }

            if (isSortable) {
                sort(column.id);
            }
        },
        [column.id, isSortable, sort],
    );

    // Handle resize start
    // Handle resize start
    const handleResizeStart = useCallback(
        (
            e:
                | React.MouseEvent<HTMLButtonElement>
                | React.TouchEvent<HTMLButtonElement>,
        ) => {
            const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const startWidth = columnWidth;

            const handleResizeMove = (moveEvent: MouseEvent) => {
                const deltaX =
                    theme.direction === "rtl"
                        ? startX - moveEvent.clientX
                        : moveEvent.clientX - startX;
                const newWidth = Math.max(startWidth + deltaX, 50); // Ensure minimum width of 50px
                resizeColumn(column.id, newWidth);
            };

            const handleResizeEnd = () => {
                document.removeEventListener("mousemove", handleResizeMove);
                document.removeEventListener("mouseup", handleResizeEnd);
            };

            document.addEventListener("mousemove", handleResizeMove);
            document.addEventListener("mouseup", handleResizeEnd);
            e.preventDefault();
        },
        [column.id, resizeColumn, columnWidth],
    );

    // Handle filter input change
    const handleFilterInputChange = useCallback(
        (columnId: string, value: string) => {
            setTempFilterValue(value);
        },
        [],
    );

    // Handle apply filter
    const handleApplyFilter = useCallback(
        (columnId: string) => {
            // Create a simple filter clause for backward compatibility
            filter(
                tempFilterValue
                    ? {
                          columnId,
                          operation: "contains",
                          value: tempFilterValue,
                      }
                    : null,
                columnId,
            );
        },
        [column.id, filter, tempFilterValue],
    );

    // Handle clear filter
    const handleClearFilter = useCallback(
        (columnId: string) => {
            filter(null, columnId);
            setTempFilterValue("");
        },
        [filter],
    );

    // Handle key down in filter input
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleApplyFilter(column.id);
            } else if (e.key === "Escape") {
            }
        },
        [column.id, handleApplyFilter],
    );

    // Initialize filter value from active filter
    React.useEffect(() => {
        if (isFiltered) {
            const filter = filters[column.id];
            const filterValue =
                typeof filter === "string" ? filter : filter?.value || "";
            setTempFilterValue(filterValue as string);
        } else {
            setTempFilterValue("");
        }
    }, [isFiltered, filters, column.id]);

    // Determine which filter icon click handler to use based on column type
    const handleFilterIconClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent triggering sort

            if (column.type === "text") {
                onTextFilterIconClick(e, column.id);
            } else if (column.type === "number") {
                onTextFilterIconClick(e, column.id); // This will be the number filter handler
            } else if (column.type === "date") {
                onTextFilterIconClick(e, column.id); // This will be the date filter handler
            }
        },
        [column, onTextFilterIconClick, onPopoverFilterIconClick],
    );

    // Get the appropriate filter icon color
    const getFilterIconColor = useCallback(() => {
        if (isFiltered) {
            return theme.palette.primary.main; // Active client filter
        }
        return "inherit"; // No active filter
    }, [isFiltered, theme.palette.primary.main]);

    return (
        <th onClick={handleHeaderClick}>
            <div
                style={{
                    position: "relative",
                    maxWidth: columnWidth,
                    width: columnWidth,
                    minWidth: columnWidth,
                    overflow: "hidden",
                    background: "blue",
                    minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
                }}
            >
                <div
                    style={{
                        overflow: "visible",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            ...thStyleWithPin,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // cursor: isSortable ? "pointer" : "default",
                            width: columnWidth,
                            overflow: "hidden",
                            height: TABLE_CHECKBOX_CONTAINER_SIZE,
                            minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
                        }}
                    >
                        {/* Column label and icons */}
                        <span
                            style={{
                                flexGrow: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {column.label}
                            {isPinned === "left" && (
                                <PushPin
                                    fontSize="small"
                                    style={{
                                        marginLeft: 4,
                                        transform: "rotate(45deg)",
                                    }}
                                />
                            )}
                            {isPinned === "right" && (
                                <PushPin
                                    fontSize="small"
                                    style={{ marginLeft: 4 }}
                                />
                            )}
                        </span>

                        {/* Sort and filter icons */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                            }}
                        >
                            {/* Sort icon */}
                            {isSortable && (
                                <Tooltip title={"Sort"}>
                                    <IconButton
                                        size="small"
                                        className="header-icon-button"
                                        style={{ padding: "4px" }}
                                        disableRipple
                                        onClick={() => sort(column.id)}
                                    >
                                        {(() => {
                                            if (!sortDirection) {
                                                return (
                                                    <UnfoldMore
                                                        fontSize="small"
                                                        style={{ opacity: 0.5 }}
                                                    />
                                                );
                                            }
                                            return sortDirection === "ASC" ? (
                                                <ArrowUpward fontSize="small" />
                                            ) : (
                                                <ArrowDownward fontSize="small" />
                                            );
                                        })()}
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Filter icon */}
                            {isFilterable && (
                                <Tooltip title={"Filter"}>
                                    <Badge
                                        color="primary"
                                        variant="dot"
                                        invisible={!isFiltered}
                                        overlap="circular"
                                    >
                                        <IconButton
                                            size="small"
                                            className="header-icon-button"
                                            onClick={handleFilterIconClick}
                                            style={{
                                                padding: "4px",
                                                color: getFilterIconColor(),
                                            }}
                                        >
                                            <FilterList fontSize="small" />
                                        </IconButton>
                                    </Badge>
                                </Tooltip>
                            )}

                            {/* Options icon */}
                            <IconButton
                                size="small"
                                className="header-icon-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering sort
                                    onOptionsClick(e, column.id);
                                }}
                                style={{ padding: "4px" }}
                            >
                                <MoreVert fontSize="small" />
                            </IconButton>
                        </div>
                    </div>
                    <ResizeHandle onResize={handleResizeStart} />
                </div>
            </div>
        </th>
    );
};

export default ColumnHeaderCell;

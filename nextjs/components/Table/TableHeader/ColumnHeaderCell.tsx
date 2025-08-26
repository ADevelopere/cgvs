import React, { useCallback, useMemo } from "react";

import type { CSSProperties, FunctionComponent } from "react";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPopoverFilterIconClick,
    onTextFilterIconClick,
    isPinned,
}) => {
    const { filters, getSortDirection, sort, filter } = useTableDataContext();
    const { pinnedLeftStyle, pinnedRightStyle, resizeColumn, columnWidths } =
        useTableColumnContext();
    const sortDirection = useMemo(
        () => getSortDirection(column.id),
        [column.id, getSortDirection],
    );

    const columnWidth = useMemo(
        () => columnWidths[column.id],
        [column.id, columnWidths],
    );
    const columnWidthRef = React.useRef(columnWidth);
    React.useEffect(() => {
        columnWidthRef.current = columnWidth;
    }, [columnWidth]);

    if (column.id === "status") {
        console.log(
            "ColumnHeaderCell column: ",
            column.id,
            "width:",
            columnWidth,
        );
    }
    const theme = useTheme();
    const tempFilterValueRef = React.useRef("");

    // Base header cell style
    const { thStyle } = useTableStyles();

    // Apply appropriate styles based on pin position
    const thStyleWithPin = useMemo(() => {
        let style = { ...thStyle };
        if (isPinned === "left") {
            style = { ...thStyle, ...pinnedLeftStyle };
        } else if (isPinned === "right") {
            style = { ...thStyle, ...pinnedRightStyle };
        }
        return style;
    }, [thStyle, isPinned, pinnedLeftStyle, pinnedRightStyle]);

    // Check if column has an active filter
    const isFiltered = useMemo(
        () => !!filters[column.id],
        [filters, column.id],
    );

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
    const handleResizeStart = useCallback(
        (
            e:
                | React.MouseEvent<HTMLButtonElement>
                | React.TouchEvent<HTMLButtonElement>,
        ) => {
            const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const startWidth = columnWidthRef.current;
            let lastClientX = startX;
            let ticking = false;

            const update = () => {
                const deltaX =
                    theme.direction === "rtl"
                        ? startX - lastClientX
                        : lastClientX - startX;
                const newWidth = Math.max(startWidth + deltaX, 50); // Ensure minimum width of 50px
                resizeColumn(column.id, newWidth);
                ticking = false;
            };

            const handleResizeMove = (moveEvent: MouseEvent) => {
                lastClientX = moveEvent.clientX;
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            };

            const handleResizeEnd = () => {
                document.removeEventListener("mousemove", handleResizeMove);
                document.removeEventListener("mouseup", handleResizeEnd);
            };

            document.addEventListener("mousemove", handleResizeMove);
            document.addEventListener("mouseup", handleResizeEnd);
            e.preventDefault();
        },
        [theme.direction, resizeColumn, column.id],
    );

    // Handle filter input change
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleFilterInputChange = useCallback(
        (_columnId: string, value: string) => {
            tempFilterValueRef.current = value;
        },
        [],
    );

    // Handle apply filter
    const handleApplyFilter = useCallback(
        (columnId: string) => {
            // Create a simple filter clause for backward compatibility
            filter(
                tempFilterValueRef.current
                    ? {
                          columnId,
                          operation: "contains",
                          value: tempFilterValueRef.current,
                      }
                    : null,
                columnId,
            );
        },
        [filter],
    );

    // Handle clear filter
    const handleClearFilter = useCallback(
        (columnId: string) => {
            filter(null, columnId);
            tempFilterValueRef.current = "";
        },
        [filter],
    );

    // Handle key down in filter input
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleApplyFilter(column.id);
            } else if (e.key === "Escape") {
                handleClearFilter(column.id);
            }
        },
        [column.id, handleApplyFilter, handleClearFilter],
    );

    // Initialize filter value from active filter
    React.useEffect(() => {
        if (isFiltered) {
            const filterValue = filters[column.id];
            const value =
                typeof filterValue === "string"
                    ? filterValue
                    : filterValue?.value || "";
            tempFilterValueRef.current = value as string;
        } else {
            tempFilterValueRef.current = "";
        }
    }, [isFiltered, filters, column.id]);

    // Determine which filter icon click handler to use based on column type
    const handleFilterIconClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent triggering sort

            if (
                column.type === "text" ||
                column.type === "number" ||
                column.type === "date"
            ) {
                onTextFilterIconClick(e, column.id);
            }
        },
        [column, onTextFilterIconClick],
    );

    // Get the appropriate filter icon color
    const getFilterIconColor = useCallback(() => {
        return isFiltered ? theme.palette.primary.main : "inherit";
    }, [isFiltered, theme.palette.primary.main]);

    const handleSortClick = useCallback(() => {
        sort(column.id);
    }, [sort, column.id]);

    const handleOptionsClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            onOptionsClick(e, column.id);
        },
        [onOptionsClick, column.id],
    );

    const renderSortIcon = useMemo(() => {
        if (!sortDirection) {
            return <UnfoldMore fontSize="small" style={{ opacity: 0.5 }} />;
        }
        return sortDirection === "ASC" ? (
            <ArrowUpward fontSize="small" />
        ) : (
            <ArrowDownward fontSize="small" />
        );
    }, [sortDirection]);

    const headerStyle: CSSProperties = useMemo(
        () => ({
            position: "relative",
            maxWidth: columnWidth,
            width: columnWidth,
            minWidth: columnWidth,
            overflow: "hidden",
            background: "blue",
            minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
            cursor: isSortable ? "pointer" : "default",
        }),
        [columnWidth, isSortable],
    );

    const headerInnerStyle = useMemo(
        () => ({
            overflow: "visible",
            width: "100%",
            height: "100%",
        }),
        [],
    );

    const headerContentStyle = useMemo(
        () => ({
            ...thStyleWithPin,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: columnWidth,
            overflow: "hidden",
            height: TABLE_CHECKBOX_CONTAINER_SIZE,
            minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
        }),
        [thStyleWithPin, columnWidth],
    );

    const columnLabelStyle = useMemo(
        () => ({
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
        }),
        [],
    );

    const iconsContainerStyle = useMemo(
        () => ({
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
        }),
        [],
    );

    const filterIconStyle = useMemo(
        () => ({
            padding: "4px",
            color: getFilterIconColor(),
        }),
        [getFilterIconColor],
    );

    return (
        <th
            onClick={handleHeaderClick}
            style={{
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <div style={headerStyle}>
                <div style={headerInnerStyle}>
                    <div style={headerContentStyle}>
                        <span style={columnLabelStyle}>
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

                        <div style={iconsContainerStyle}>
                            {isSortable && (
                                <Tooltip title={"Sort"}>
                                    <IconButton
                                        size="small"
                                        className="header-icon-button"
                                        style={{ padding: "4px" }}
                                        disableRipple
                                        onClick={handleSortClick}
                                    >
                                        {renderSortIcon}
                                    </IconButton>
                                </Tooltip>
                            )}

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
                                            style={filterIconStyle}
                                        >
                                            <FilterList fontSize="small" />
                                        </IconButton>
                                    </Badge>
                                </Tooltip>
                            )}

                            <IconButton
                                size="small"
                                className="header-icon-button"
                                onClick={handleOptionsClick}
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

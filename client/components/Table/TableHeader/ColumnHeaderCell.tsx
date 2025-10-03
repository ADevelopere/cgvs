import React, { useCallback, useMemo, useRef } from "react";

import type { CSSProperties, FunctionComponent } from "react";
import { useTheme, styled } from "@mui/material/styles";
import { IconButton, Tooltip, Badge } from "@mui/material";
import {
    ArrowUpward,
    ArrowDownward,
    UnfoldMore,
    FilterList,
    MoreVert,
    PushPin,
} from "@mui/icons-material";
import { SortDirection } from "@/graphql/generated/types";
import { FilterClause } from "@/types/filters";
import ResizeHandle from "./ResizeHandle";
import { useTableStyles } from "@/client/theme/styles";
import { EditableColumn, PinPosition } from "@/types/table.type";
import { useTableLocale } from "@/client/locale/table/TableLocaleContext";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "@/constants/tableConstants";

export interface ColumnHeaderProps {
    column: EditableColumn;
    onOptionsClick: (
        e: React.MouseEvent<HTMLElement>,
        columnId: string,
    ) => void;
    onTextFilterIconClick: (
        e: React.MouseEvent<HTMLElement>,
        columnId: string,
    ) => void;
    isPinned: PinPosition;
    // New props
    sortDirection: SortDirection | null;
    isFiltered: boolean;
    columnWidth: number;
    sort: (columnId: string) => void;
    filter: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterClause: FilterClause<any, any> | null,
        columnId: string,
    ) => void;
    resizeColumn: (columnId: string, newWidth: number) => void;
    pinnedLeftStyle: CSSProperties;
    pinnedRightStyle: CSSProperties;
}

const StyledTh = styled("th")(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: 0,
}));

interface HeaderContainerProps {
    columnWidth: number;
    isSortable: boolean;
}

const HeaderContainer = styled("div")<HeaderContainerProps>(
    ({ columnWidth, isSortable }) => ({
        position: "relative",
        maxWidth: columnWidth,
        width: columnWidth,
        minWidth: columnWidth,
        overflow: "hidden",
        background: "blue",
        minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
        cursor: isSortable ? "pointer" : "default",
    }),
);

const HeaderInner = styled("div")({
    overflow: "visible",
    width: "100%",
    height: "100%",
});

interface HeaderContentProps {
    isPinned: PinPosition;
    pinnedLeftStyle: CSSProperties;
    pinnedRightStyle: CSSProperties;
    thStyle: CSSProperties;
}

const HeaderContent = styled("div")<HeaderContentProps>(({
    isPinned,
    pinnedLeftStyle,
    pinnedRightStyle,
    thStyle,
}) => {
    let style = { ...thStyle };
    if (isPinned === "left") {
        style = { ...thStyle, ...pinnedLeftStyle };
    } else if (isPinned === "right") {
        style = { ...thStyle, ...pinnedRightStyle };
    }

    return {
        ...style,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        height: TABLE_CHECKBOX_CONTAINER_SIZE,
        minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
    };
});

const ColumnLabel = styled("span")({
    flexGrow: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
});

const IconsContainer = styled("div")({
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
});

const HeaderIconButton = styled(IconButton)({
    padding: "4px",
});

const FilterIconButton = styled(HeaderIconButton, {
    shouldForwardProp: (prop) => prop !== "isFiltered",
})<{ isFiltered: boolean }>(({ theme, isFiltered }) => ({
    color: isFiltered ? theme.palette.primary.main : "inherit",
}));

const LeftPushPin = styled(PushPin)({
    marginLeft: 4,
    transform: "rotate(45deg)",
    verticalAlign: "middle",
});

const RightPushPin = styled(PushPin)({
    marginLeft: 4,
    verticalAlign: "middle",
});

const ColumnHeaderCell: FunctionComponent<ColumnHeaderProps> = React.memo(
    ({
        column,
        onOptionsClick,
        onTextFilterIconClick,
        isPinned,
        // Destructure new props
        sortDirection,
        isFiltered,
        columnWidth,
        sort,
        filter,
        resizeColumn,
        pinnedLeftStyle,
        pinnedRightStyle,
    }) => {
        const columnWidthRef = React.useRef(columnWidth);
        React.useEffect(() => {
            columnWidthRef.current = columnWidth;
        }, [columnWidth]);

        const theme = useTheme();
        const { strings } = useTableLocale();
        const tempFilterValueRef = React.useRef("");
        const isResizingRef = useRef(false);

        // Base header cell style
        const { thStyle } = useTableStyles();

        // Determine if the column is sortable in the current mode
        const isSortable = column.sortable;

        // Determine if the column is filterable in the current mode
        const isFilterable = column.filterable;

        // Handle header click for sorting
        const handleHeaderClick = useCallback(
            (e: React.MouseEvent<HTMLElement>) => {
                // If resizing, don't sort. The ref is reset on mouseup after the click event.
                if (isResizingRef.current) {
                    return;
                }

                // Don't trigger sort if we're clicking on the resize handle or any icon button
                if (
                    (e.target as HTMLElement).classList.contains(
                        "resize-handle",
                    ) ||
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
                isResizingRef.current = true;

                const startX =
                    "touches" in e ? e.touches[0].clientX : e.clientX;
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
                    // Use a timeout to ensure the click event is processed before we reset the flag.
                    // This prevents the sort from firing on resize completion.
                    setTimeout(() => {
                        isResizingRef.current = false;
                    }, 0);
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

        // Determine which filter icon click handler to use based on column type
        const handleFilterIconClick = useCallback(
            (e: React.MouseEvent<HTMLElement>) => {
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

        return (
            <StyledTh onClick={handleHeaderClick}>
                <HeaderContainer
                    columnWidth={columnWidth}
                    isSortable={isSortable ?? false}
                >
                    <HeaderInner>
                        <HeaderContent
                            isPinned={isPinned}
                            pinnedLeftStyle={pinnedLeftStyle}
                            pinnedRightStyle={pinnedRightStyle}
                            thStyle={thStyle}
                        >
                            <ColumnLabel>
                                {column.label}
                                {isPinned === "left" && (
                                    <LeftPushPin fontSize="small" />
                                )}
                                {isPinned === "right" && (
                                    <RightPushPin fontSize="small" />
                                )}
                            </ColumnLabel>

                            <IconsContainer>
                                {isSortable && (
                                    <Tooltip title={strings.sort.title}>
                                        <HeaderIconButton
                                            size="small"
                                            className="header-icon-button"
                                            disableRipple
                                            onClick={handleSortClick}
                                        >
                                            {renderSortIcon}
                                        </HeaderIconButton>
                                    </Tooltip>
                                )}

                                {isFilterable && (
                                    <Tooltip title={strings.filter.title}>
                                        <Badge
                                            color="primary"
                                            variant="dot"
                                            invisible={!isFiltered}
                                            overlap="circular"
                                        >
                                            <FilterIconButton
                                                size="small"
                                                className="header-icon-button"
                                                onClick={handleFilterIconClick}
                                                isFiltered={isFiltered}
                                            >
                                                <FilterList fontSize="small" />
                                            </FilterIconButton>
                                        </Badge>
                                    </Tooltip>
                                )}

                                <HeaderIconButton
                                    size="small"
                                    className="header-icon-button"
                                    onClick={handleOptionsClick}
                                >
                                    <MoreVert fontSize="small" />
                                </HeaderIconButton>
                            </IconsContainer>
                        </HeaderContent>
                        <ResizeHandle onResize={handleResizeStart} />
                    </HeaderInner>
                </HeaderContainer>
            </StyledTh>
        );
    },
);

ColumnHeaderCell.displayName = "ColumnHeaderCell";

export default ColumnHeaderCell;

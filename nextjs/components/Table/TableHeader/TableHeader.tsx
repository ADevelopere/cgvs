import type React from "react";
import { useRef, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import ColumnHeaderCell from "./ColumnHeaderCell";
import ColumnOptionsMenu from "./ColumnOptionsMenu";
import FilterPopover from "./FilterPopover";
import TextFilterPopover from "./TextFilterPopover";
import NumberFilterPopover from "./NumberFilterPopover";
import DateFilterPopover from "./DateFilterPopover";
import { Box, Checkbox } from "@mui/material";

import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableRowsContext } from "../Table/TableRowsContext";
import {
    TABLE_CHECKBOX_CONTAINER_SIZE,
    TABLE_CHECKBOX_WIDTH,
} from "@/constants/tableConstants";

// use to prevent creating a new function reference on every render,
// which would break the memoization of ColumnHeaderCell.
const noop = () => {};

const TableHeader: React.FC<{
    width: number;
    indexColWidth: number; // Add indexColWidth prop
}> = ({ width, indexColWidth }) => {
    const theme = useTheme();
    const headerRef = useRef<HTMLTableRowElement>(null);
    const {
        visibleColumns,
        pinnedColumns,
        pinnedLeftStyle,
        pinnedRightStyle,
        resizeColumn,
        columnWidths,
    } = useTableColumnContext();
    const {
        getActiveTextFilter,
        getActiveNumberFilter,
        getActiveDateFilter,
        filters,
        tempFilterValues,
        setTempFilterValues,
        applyFilter,
        sort,
        filter,
        getSortDirection,
    } = useTableDataContext();

    const { rowSelectionEnabled, isAllRowsSelected, toggleAllRowsSelection } =
        useTableRowsContext();

    // State for column options menu
    const [optionsMenuAnchor, setOptionsMenuAnchor] =
        useState<null | HTMLElement>(null);
    const [activeOptionsColumn, setActiveOptionsColumn] = useState<
        string | null
    >(null);

    // State for filter popover
    const [filterPopoverAnchor, setFilterPopoverAnchor] =
        useState<null | HTMLElement>(null);
    const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
        null,
    );

    // State for text filter popover
    const [textFilterPopoverAnchor, setTextFilterPopoverAnchor] =
        useState<null | HTMLElement>(null);
    const [activeTextFilterColumn, setActiveTextFilterColumn] = useState<
        string | null
    >(null);

    // State for number filter popover
    const [numberFilterPopoverAnchor, setNumberFilterPopoverAnchor] =
        useState<null | HTMLElement>(null);
    const [activeNumberFilterColumn, setActiveNumberFilterColumn] = useState<
        string | null
    >(null);

    // State for date filter popover
    const [dateFilterPopoverAnchor, setDateFilterPopoverAnchor] =
        useState<null | HTMLElement>(null);
    const [activeDateFilterColumn, setActiveDateFilterColumn] = useState<
        string | null
    >(null);

    // Define the filter icon click handlers
    const handleTextFilterIconClick = useCallback(
        (e: React.MouseEvent, columnId: string) => {
            e.stopPropagation(); // Prevent triggering sort
            setTextFilterPopoverAnchor(e.currentTarget as HTMLElement);
            setActiveTextFilterColumn(columnId);
        },
        [],
    );

    const handleNumberFilterIconClick = useCallback(
        (e: React.MouseEvent, columnId: string) => {
            e.stopPropagation(); // Prevent triggering sort
            setNumberFilterPopoverAnchor(e.currentTarget as HTMLElement);
            setActiveNumberFilterColumn(columnId);
        },
        [],
    );

    const handleDateFilterIconClick = useCallback(
        (e: React.MouseEvent, columnId: string) => {
            e.stopPropagation(); // Prevent triggering sort
            setDateFilterPopoverAnchor(e.currentTarget as HTMLElement);
            setActiveDateFilterColumn(columnId);
        },
        [],
    );

    const closeTextFilterPopover = useCallback(() => {
        setTextFilterPopoverAnchor(null);
        setActiveTextFilterColumn(null);
    }, []);

    const closeNumberFilterPopover = useCallback(() => {
        setNumberFilterPopoverAnchor(null);
        setActiveNumberFilterColumn(null);
    }, []);

    const closeDateFilterPopover = useCallback(() => {
        setDateFilterPopoverAnchor(null);
        setActiveDateFilterColumn(null);
    }, []);

    const closeFilterPopover = useCallback(() => {
        setFilterPopoverAnchor(null);
        setActiveFilterColumn(null);
    }, []);

    // Helper to determine which filter icon click handler to use based on column type
    const getFilterIconClickHandler = useCallback(
        (column: (typeof visibleColumns)[0]) => {
            if (!column.filterable) {
                return undefined;
            }

            if (column.type === "text") {
                return handleTextFilterIconClick;
            } else if (column.type === "number") {
                return handleNumberFilterIconClick;
            } else if (column.type === "date") {
                return handleDateFilterIconClick;
            }
        },
        [
            handleTextFilterIconClick,
            handleNumberFilterIconClick,
            handleDateFilterIconClick,
        ],
    );

    const handleOptionsClick = useCallback(
        (event: React.MouseEvent<HTMLElement>, columnId: string) => {
            setOptionsMenuAnchor(event.currentTarget);
            setActiveOptionsColumn(columnId);
        },
        [],
    );

    const handleOptionsClose = useCallback(() => {
        setOptionsMenuAnchor(null);
        setActiveOptionsColumn(null);
    }, []);

    const handlePinLeft = () => {
    };

    const handlePinRight = () => {
    };

    const handleUnpin = () => {
    };

    const handleHide = () => {
    };

    const handleAutosize = () => {
    };

    const handleShowColumnManager = () => {
    };

    const handleFilterInputChange = useCallback(
        (columnId: string, value: string) => {
            // Update the temporary filter values for the given column
            setTempFilterValues((prev) => ({
                ...prev,
                [columnId]: value,
            }));
        },
        [setTempFilterValues],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, columnId: string) => {
            if (e.key === "Enter") {
                // Apply filter when Enter is pressed
                applyFilter(columnId);
                closeFilterPopover();
            } else if (e.key === "Escape") {
                // Close filter popover when Escape is pressed
                closeFilterPopover();
            }
        },
        [applyFilter, closeFilterPopover],
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const closeFilterPopovers = useCallback(() => {
        // Close all filter popovers
        closeTextFilterPopover();
        closeNumberFilterPopover();
        closeDateFilterPopover();
        closeFilterPopover();
    }, [
        closeDateFilterPopover,
        closeFilterPopover,
        closeNumberFilterPopover,
        closeTextFilterPopover,
    ]);

    return (
        <>
            <tr
                ref={headerRef}
                style={{
                    width: width - 20,
                    display: "table-row",
                    flexDirection: "row",
                    // backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    textAlign: "start" as const,
                    whiteSpace: "nowrap" as const,
                    textOverflow: "ellipsis" as const,
                }}
            >
                {/* Empty cell for index column */}
                <th
                    style={{
                        width: indexColWidth,
                        textAlign: "center",
                        fontWeight: "bold",
                        borderInlineEnd: `1px solid ${theme.palette.divider}`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                ></th>

                {rowSelectionEnabled && (
                    <th>
                        <Box
                            sx={{
                                height: TABLE_CHECKBOX_CONTAINER_SIZE,
                                display: "flex",
                                alignItems: "center",
                                paddingInline: "8px",
                                borderInlineEnd: `1px solid ${theme.palette.divider}`,
                                width: TABLE_CHECKBOX_CONTAINER_SIZE,
                                minWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Checkbox
                                checked={isAllRowsSelected === true}
                                indeterminate={isAllRowsSelected === null}
                                onChange={toggleAllRowsSelection}
                                color="primary"
                                size="small"
                                sx={{
                                    maxHeight: TABLE_CHECKBOX_WIDTH,
                                    height: TABLE_CHECKBOX_WIDTH,
                                    width: TABLE_CHECKBOX_WIDTH,
                                    minWidth: TABLE_CHECKBOX_WIDTH,
                                }}
                            />
                        </Box>
                    </th>
                )}

                {visibleColumns.map((column) => {
                    // Existing column header code...
                    // Determine if this column is pinned (moved outside of render for performance)
                    const pinPosition = pinnedColumns[column.id];
                    const sortDirection = getSortDirection(column.id);
                    const columnWidth = columnWidths[column.id];
                    const isFiltered = !!filters[column.id];
                    return (
                        <ColumnHeaderCell
                            key={column.id}
                            column={column}
                            onOptionsClick={handleOptionsClick}
                            onTextFilterIconClick={
                                getFilterIconClickHandler(column) ?? noop
                            }
                            isPinned={pinPosition}
                            sortDirection={sortDirection}
                            isFiltered={isFiltered}
                            columnWidth={columnWidth}
                            sort={sort}
                            filter={filter}
                            resizeColumn={resizeColumn}
                            pinnedLeftStyle={pinnedLeftStyle}
                            pinnedRightStyle={pinnedRightStyle}
                        />
                    );
                })}
                {/* Spacer cell to account for scrollbar */}
                <th
                    style={{
                        width: 20,
                    }}
                ></th>
            </tr>

            {/* Column Options Menu */}
            <ColumnOptionsMenu
                anchorEl={optionsMenuAnchor}
                open={Boolean(optionsMenuAnchor)}
                onClose={handleOptionsClose}
                columnId={activeOptionsColumn}
                columnLabel={
                    visibleColumns.find((col) => col.id === activeOptionsColumn)
                        ?.label || ""
                }
                isPinnedLeft={
                    pinnedColumns[activeOptionsColumn || ""] === "left"
                }
                isPinnedRight={
                    pinnedColumns[activeOptionsColumn || ""] === "right"
                }
                onPinLeft={handlePinLeft}
                onPinRight={handlePinRight}
                onUnpin={handleUnpin}
                onHide={handleHide}
                onAutosize={handleAutosize}
                onShowColumnManager={handleShowColumnManager}
            />

            {/* Filter Popover */}
            <FilterPopover
                anchorEl={filterPopoverAnchor}
                open={Boolean(filterPopoverAnchor)}
                onClose={closeFilterPopover}
                columnId={activeFilterColumn}
                columnLabel={
                    visibleColumns.find((col) => col.id === activeFilterColumn)
                        ?.label ?? ""
                }
                value={
                    activeFilterColumn
                        ? (tempFilterValues[activeFilterColumn] ?? "")
                        : ""
                }
                hasActiveFilter={
                    !!activeFilterColumn && !!filters[activeFilterColumn]
                }
                onChange={handleFilterInputChange}
                onKeyDown={handleKeyDown}
            />

            {/* Text Filter Popover */}
            {activeTextFilterColumn && (
                <TextFilterPopover
                    anchorEl={textFilterPopoverAnchor}
                    open={Boolean(textFilterPopoverAnchor)}
                    onClose={closeTextFilterPopover}
                    columnId={activeTextFilterColumn}
                    columnLabel={
                        visibleColumns.find(
                            (col) => col.id === activeTextFilterColumn,
                        )?.label || ""
                    }
                    activeFilter={getActiveTextFilter(activeTextFilterColumn)}
                />
            )}

            {/* Number Filter Popover */}
            {activeNumberFilterColumn && (
                <NumberFilterPopover
                    anchorEl={numberFilterPopoverAnchor}
                    open={Boolean(numberFilterPopoverAnchor)}
                    onClose={closeNumberFilterPopover}
                    columnId={activeNumberFilterColumn}
                    columnLabel={
                        visibleColumns.find(
                            (col) => col.id === activeNumberFilterColumn,
                        )?.label || ""
                    }
                    activeFilter={getActiveNumberFilter(
                        activeNumberFilterColumn,
                    )}
                />
            )}

            {/* Date Filter Popover */}
            {activeDateFilterColumn && (
                <DateFilterPopover
                    anchorEl={dateFilterPopoverAnchor}
                    open={Boolean(dateFilterPopoverAnchor)}
                    onClose={closeDateFilterPopover}
                    columnId={activeDateFilterColumn}
                    columnLabel={
                        visibleColumns.find(
                            (col) => col.id === activeDateFilterColumn,
                        )?.label || ""
                    }
                    activeFilter={getActiveDateFilter(activeDateFilterColumn)}
                />
            )}
        </>
    );
};

export default TableHeader;

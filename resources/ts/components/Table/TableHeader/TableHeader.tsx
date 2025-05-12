import type React from "react";
import { useRef, useState, useCallback, use, useMemo } from "react";
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

const TableHeader: React.FC<{
    width: number;
}> = ({ width }) => {
    const theme = useTheme();
    const headerRef = useRef<HTMLTableRowElement>(null);
    const { visibleColumns: columns, pinnedColumns } = useTableColumnContext();

    const {
        getActiveTextFilter,
        getActiveNumberFilter,
        getActiveDateFilter,
        filters,
        tempFilterValues,
        setTempFilterValues,
        applyFilter,
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

    // Handle popover filter
    const handlePopoverFilterIconClick = useCallback(
        (e: React.MouseEvent, columnId: string) => {
            e.stopPropagation(); // Prevent triggering sort
            setFilterPopoverAnchor(e.currentTarget as HTMLElement);
            setActiveFilterColumn(columnId);

            // Initialize temp filter value if not already set
            if (tempFilterValues[columnId] === undefined) {
                const currentFilter = filters[columnId];
                let filterValue = "";

                // Handle different filter value types
                if (typeof currentFilter === "string") {
                    filterValue = currentFilter;
                } else if (currentFilter && "value" in currentFilter) {
                    // Handle FilterClause object
                    filterValue = String(currentFilter.value || "");
                }

                setTempFilterValues((prev) => ({
                    ...prev,
                    [columnId]: filterValue,
                }));
            }
        },
        [tempFilterValues, filters, setTempFilterValues],
    );

    // Helper to determine which filter icon click handler to use based on column type
    const getFilterIconClickHandler = useCallback(
        (column: (typeof columns)[0]) => {
            if (!column.filterable) {
                return undefined;
            }

            if (column.type === "text") {
                return handleTextFilterIconClick;
            } else if (column.type === "number") {
                return handleNumberFilterIconClick;
            } else if (column.type === "date") {
                return handleDateFilterIconClick;
            } else if (column.filterMode === "popover") {
                return handlePopoverFilterIconClick;
            }
        },
        [
            handleTextFilterIconClick,
            handleNumberFilterIconClick,
            handleDateFilterIconClick,
            handlePopoverFilterIconClick,
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
        console.log("Pin Left");
    };

    const handlePinRight = () => {
        console.log("Pin Right");
    };

    const handleUnpin = () => {
        console.log("Unpin");
    };

    const handleHide = () => {
        console.log("Hide");
    };

    const handleAutosize = () => {
        console.log("Autosize");
    };

    const handleShowColumnManager = () => {
        console.log("Show Column Manager");
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

    const closeFilterPopovers = useCallback(() => {
        // Close all filter popovers
        closeTextFilterPopover();
        closeNumberFilterPopover();
        closeDateFilterPopover();
        closeFilterPopover();
    }, []);

    return (
        <div
            style={{
                width: width,
            }}
        >
            <tr
                ref={headerRef}
                style={{
                    // width: width,
                    display: "flex",
                    flexDirection: "row",
                    // backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    textAlign: "start" as const,
                    whiteSpace: "nowrap" as const,
                    textOverflow: "ellipsis" as const,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
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

                {columns.map((column) => {
                    // Existing column header code...
                    // Determine if this column is pinned
                    const pinPosition = useMemo(() => {
                        return pinnedColumns[column.id];
                    }, [pinnedColumns, column.id]);
                    return (
                        <ColumnHeaderCell
                            key={column.id}
                            column={column}
                            onOptionsClick={handleOptionsClick}
                            onPopoverFilterIconClick={
                                handlePopoverFilterIconClick
                            }
                            onTextFilterIconClick={
                                getFilterIconClickHandler(column) as any
                            }
                            isPinned={pinPosition}
                        />
                    );
                })}
            </tr>

            {/* Column Options Menu */}
            <ColumnOptionsMenu
                anchorEl={optionsMenuAnchor}
                open={Boolean(optionsMenuAnchor)}
                onClose={handleOptionsClose}
                columnId={activeOptionsColumn}
                columnLabel={
                    columns.find((col) => col.id === activeOptionsColumn)
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
                    columns.find((col) => col.id === activeFilterColumn)
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
                        columns.find((col) => col.id === activeTextFilterColumn)
                            ?.label || ""
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
                        columns.find(
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
                        columns.find((col) => col.id === activeDateFilterColumn)
                            ?.label || ""
                    }
                    activeFilter={getActiveDateFilter(activeDateFilterColumn)}
                />
            )}
        </div>
    );
};

export default TableHeader;

import type React from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Switch,
    FormControlLabel,
    Paper,
    Divider,
    RadioGroup,
    Radio,
    Button,
    CssBaseline,
} from "@mui/material";
import { AppThemeProvider, useAppTheme } from "@/hooks/useAppTheme";
import { TableLocaleProvider } from "@/locale/table/TableLocaleContext";
import TableInfo from "./TableInfo";
import TableFilters from "./TableFilters";
import { DemoTableProvider, useDemoTableContext } from "./DemoTableContext";
import { useSort } from "./handlers/useSort";
import { useFilter } from "./handlers/useFilter";
import { usePaginationHandlers } from "./handlers/usePagination"; // Renamed to avoid conflict
import { useServerOperations } from "./handlers/useServerOperations";
import { useRowStyle } from "./handlers/useRowStyle";
import { ROWS_PER_PAGE_OPTIONS } from "@/constants/tableConstants";
import { useState } from "react";
import { Container } from "@mui/system";
import ThemeSwitcher from "../Table/ThemeSwitcher";
import LanguageSwitcher from "../Table/LanguageSwitcher";
import { TableProvider } from "../Table/Table/TableContext";
import Table from "../Table/Table/Table";

// Add selection state to the TableContent component
const TableContent: React.FC = () => {
    const { theme } = useAppTheme();
    const {
        sortBy,
        sortDirection,
        isLoading,
        filters,
        useCustomRowStyle,
        setUseCustomRowStyle,
        usePagination,
        setUsePagination,
        serverOperationMode,
        setServerOperationMode,
        serverFilterUi,
        setServerFilterUi,
        serverFilters,
        filteredTotalRows,
        paginationInfo,
        displayData,
        loadedRows,
        columns,
    } = useDemoTableContext();

    // Add selection state
    const [enableRowSelection, setEnableRowSelection] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>(
        [],
    );

    const { handleSort } = useSort();
    const { handleFilter } = useFilter();
    const { handlePageChange, handleRowsPerPageChange, loadMoreRows } =
        usePaginationHandlers(); // Use the renamed hook
    const {
        handleServerSortChange,
        handleServerFiltersChange,
        handleToggleServerMode,
    } = useServerOperations();
    const { getRowStyle } = useRowStyle();
    const rowIdKey = "id";

    // Handle selection change
    const handleSelectionChange = (newSelectedIds: (string | number)[]) => {
        setSelectedRowIds(newSelectedIds);
    };

    // Handle toggle row selection
    const handleToggleRowSelection = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setEnableRowSelection(e.target.checked);
        // Clear selection when disabling
        if (!e.target.checked) {
            setSelectedRowIds([]);
        }
    };

    // Handlers for toggling custom row style and pagination
    const handleToggleCustomRowStyle = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUseCustomRowStyle(e.target.checked);
    };

    const handleTogglePagination = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsePagination(e.target.checked);
    };

    // Existing handlers...

    const { sortedAndFilteredDataset } = useDemoTableContext();

    return (
        <Container
            className="App"
            style={{ direction: theme.direction }}
            maxWidth="lg"
            sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
            <AppBar
                position="static"
                enableColorOnDark
                sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Advanced Table Example
                    </Typography>
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <TableInfo
                    usePagination={usePagination}
                    paginationInfo={paginationInfo}
                    loadedRows={loadedRows.length}
                    filteredTotalRows={filteredTotalRows}
                    totalRows={10000}
                />

                <TableFilters
                    useCustomRowStyle={useCustomRowStyle}
                    onToggleCustomRowStyle={handleToggleCustomRowStyle}
                    usePagination={usePagination}
                    onTogglePagination={handleTogglePagination}
                />

                {/* Server Operation Mode toggle */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={serverOperationMode}
                                onChange={(e) => {
                                    handleToggleServerMode(e);
                                    setServerOperationMode(e.target.checked);
                                }}
                                color="primary"
                            />
                        }
                        label={
                            serverOperationMode
                                ? "Using server-side operations (simulated)"
                                : "Using client-side operations"
                        }
                    />

                    {serverOperationMode && (
                        <>
                            <Divider sx={{ my: 1 }} />

                            {/* Server Filter UI selection - Fixed implementation */}
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Server Filter UI
                                </Typography>
                                <RadioGroup
                                    row
                                    name="server-filter-ui"
                                    value={serverFilterUi}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        console.log(
                                            "Radio changed to:",
                                            (event.target as HTMLInputElement)
                                                .value,
                                        );
                                        setServerFilterUi(
                                            (event.target as HTMLInputElement)
                                                .value as
                                                | "popover"
                                                | "inlineHeaderRow",
                                        );
                                    }}
                                >
                                    <FormControlLabel
                                        value="popover"
                                        control={<Radio />}
                                        label="Popover"
                                    />
                                    <FormControlLabel
                                        value="inlineHeaderRow"
                                        control={<Radio />}
                                        label="Inline Header Row"
                                    />
                                </RadioGroup>
                            </Box>

                            <Box sx={{ mt: 1, color: "text.secondary" }}>
                                <Typography variant="body2">
                                    Server sort:{" "}
                                    {sortBy
                                        ? `${sortBy} (${sortDirection})`
                                        : "None"}
                                </Typography>
                                <Typography variant="body2">
                                    Server filters:{" "}
                                    {serverFilters.length > 0
                                        ? serverFilters.length
                                        : "None"}
                                </Typography>
                                {serverFilters.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            fontSize: "0.8rem",
                                            color: "text.secondary",
                                        }}
                                    >
                                        {serverFilters.map((filter, index) => (
                                            <div key={index}>
                                                {filter.columnId}:{" "}
                                                {filter.operation}{" "}
                                                {filter.value !== undefined &&
                                                    `(${JSON.stringify(filter.value)})`}
                                            </div>
                                        ))}
                                    </Box>
                                )}
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    <em>
                                        Note: Cloud icon in column header
                                        indicates server-side capability
                                    </em>
                                </Typography>
                            </Box>
                        </>
                    )}

                    {/* Add Row Selection toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enableRowSelection}
                                onChange={handleToggleRowSelection}
                                color="primary"
                            />
                        }
                        label={
                            enableRowSelection
                                ? "Row selection enabled"
                                : "Row selection disabled"
                        }
                    />

                    {enableRowSelection && (
                        <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    // Select all rows in the original dataset (respecting filters)
                                    const allIds = serverOperationMode
                                        ? displayData.map(
                                              (row) => row[rowIdKey],
                                          ) // For server mode, select visible rows
                                        : sortedAndFilteredDataset.map(
                                              (row) => row[rowIdKey],
                                          ); // For client mode, select all filtered rows
                                    setSelectedRowIds(allIds);
                                }}
                            >
                                Select All Rows
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setSelectedRowIds([])}
                            >
                                Deselect All Rows
                            </Button>
                            <Typography
                                variant="body2"
                                sx={{ ml: 2, alignSelf: "center" }}
                            >
                                {selectedRowIds.length} row
                                {selectedRowIds.length === 1 ? "" : "s"}{" "}
                                selected
                            </Typography>
                        </Box>
                    )}
                </Paper>

                <main>
                    <TableProvider
                        data={displayData}
                        isLoading={isLoading}
                        columns={columns}
                        dataProps={{
                            onFilter: (filterClause) => {
                                // You must provide a columnId here. If you know which column, use it.
                                // If not, you may need to refactor your filter logic.
                                // Example: if you only filter one column at a time, you can store the last filtered column in state/context.
                                // For now, let's assume you want to clear all filters if filterClause is null, or you know the columnId is in filterClause.
                                if (
                                    filterClause &&
                                    "columnId" in filterClause
                                ) {
                                    handleFilter(
                                        filterClause,
                                        filterClause.columnId,
                                    );
                                } else {
                                    // If you want to clear all filters, you may need to loop or handle differently.
                                    // Or, if you want to clear a specific column, you need to know which one.
                                    // For now, do nothing or log a warning.
                                    console.warn(
                                        "onFilter called without columnId; cannot apply filter.",
                                    );
                                }
                            },
                            // sortBy: { sortBy },
                            // sortDirection: sortDirection,
                            // filters: { filters },
                        }}
                        columnProps={{
                            initialWidths: {
                                id: 100,
                                name: 200,
                                age: 120,
                                // Add all your column keys and their initial widths here
                            },
                        }}
                        rowsProps={{
                            rowIdKey: rowIdKey,
                            onLoadMoreRows: loadMoreRows,
                            // getRowStyle: getRowStyle,
                            rowSelectionEnabled: enableRowSelection,
                            // selectedRowIds={selectedRowIds}
                            totalRows: filteredTotalRows,
                            pageSize: 50,
                        }}
                        // Server operation props
                        // Selection props
                        // onSelectionChange={handleSelectionChange}
                        // Pagination props
                        paginationInfo={usePagination ? paginationInfo : null}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        initialPageSize={100}
                    >
                        <Table />
                    </TableProvider>
                </main>
            </Box>
        </Container>
    );
};

const AppContent: React.FC = () => {
    return (
        <AppThemeProvider>
            <CssBaseline />
            <TableLocaleProvider locale={"en"}>
                <DemoTableProvider>
                    <TableContent />
                </DemoTableProvider>
            </TableLocaleProvider>
        </AppThemeProvider>
    );
};

export default AppContent;

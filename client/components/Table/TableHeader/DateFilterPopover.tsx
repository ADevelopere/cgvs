import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Popover,
    SelectChangeEvent,
} from "@mui/material";
import {
    type FilterClause,
    DateFilterOperation,
    type DateFilterValue,
    operationRequiresValue,
} from "@/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { useTableLocale } from "@/client/locale/table/TableLocaleContext";
import { useTableDataContext } from "../Table/TableDataContext";

interface DateFilterPopoverProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    columnId: string;
    columnLabel: string;
    activeFilter: FilterClause<DateFilterValue, DateFilterOperation> | null;
}

const DateFilterPopover: React.FC<DateFilterPopoverProps> = ({
    anchorEl,
    open,
    onClose,
    columnId,
    columnLabel,
    activeFilter,
}) => {
    const { applyDateFilter, clearFilter } = useTableDataContext();
    const { strings } = useTableLocale();
    // Helper function to format date for input field
    const formatDateForInput = useCallback(
        (date: string | Date | null): string => {
            if (!date) return "";

            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) return "";

            return dateObj.toISOString().split("T")[0];
        },
        [],
    );
    // Initialize state with active filter or defaults
    const [operation, setOperation] = useState<DateFilterOperation>(
        activeFilter?.operation || DateFilterOperation.is,
    );
    const [fromDate, setFromDate] = useState<string>(
        activeFilter?.value?.from
            ? formatDateForInput(activeFilter.value.from)
            : "",
    );
    const [toDate, setToDate] = useState<string>(
        activeFilter?.value?.to
            ? formatDateForInput(activeFilter.value.to)
            : "",
    );
    const [error, setError] = useState<string | null>(null);

    // Update state when active filter changes
    useEffect(() => {
        if (activeFilter) {
            setOperation(activeFilter.operation);
            setFromDate(
                activeFilter.value?.from
                    ? formatDateForInput(activeFilter.value.from)
                    : "",
            );
            setToDate(
                activeFilter.value?.to
                    ? formatDateForInput(activeFilter.value.to)
                    : "",
            );
        } else {
            setOperation(DateFilterOperation.is);
            setFromDate("");
            setToDate("");
        }
        setError(null);
    }, [activeFilter, open, formatDateForInput]);

    const handleOperationChange = useCallback((event: SelectChangeEvent) => {
        const newOperation = event.target.value as DateFilterOperation;
        setOperation(newOperation);

        // Clear values if the operation doesn't require them
        if (!operationRequiresValue(newOperation)) {
            setFromDate("");
            setToDate("");
        }

        setError(null);
    }, []);

    const handleFromDateChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setFromDate(event.target.value);
            setError(null);
        },
        [],
    );

    const handleToDateChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setToDate(event.target.value);
            setError(null);
        },
        [],
    );

    const handleApply = useCallback(() => {
        // Validate input for operations that require values
        if (operationRequiresValue(operation)) {
            if (operation === DateFilterOperation.between) {
                if (!fromDate && !toDate) {
                    setError("At least one date is required");
                    return;
                }
            } else if (!fromDate) {
                setError("Date is required for this operation");
                return;
            }
        }

        // Create filter value
        const filterValue: DateFilterValue = {};
        if (fromDate) filterValue.from = fromDate;
        if (toDate) filterValue.to = toDate;

        // Create filter clause
        const filterClause: FilterClause<DateFilterValue, DateFilterOperation> =
            {
                columnId,
                operation,
                ...(operationRequiresValue(operation)
                    ? { value: filterValue }
                    : {}),
            };

        applyDateFilter(filterClause);
        onClose();
    }, [applyDateFilter, columnId, fromDate, onClose, operation, toDate]);

    const handleClear = useCallback(() => {
        clearFilter(columnId);
        onClose();
    }, [clearFilter, columnId, onClose]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleApply();
            } else if (e.key === "Escape") {
                onClose();
            }
        },
        [handleApply, onClose],
    );

    const valueRequired = useMemo(
        () => operationRequiresValue(operation),
        [operation],
    );
    const showBothDates = useMemo(
        () => operation === DateFilterOperation.between,
        [operation],
    );
    const showSingleDate = useMemo(
        () => valueRequired && !showBothDates,
        [valueRequired, showBothDates],
    );

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <Box sx={{ p: 2, width: 300 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {strings.filter.title}: {columnLabel}
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id={`${columnId}-operation-label`}>
                        {strings.filter.operation}
                    </InputLabel>
                    <Select
                        labelId={`${columnId}-operation-label`}
                        value={operation}
                        onChange={handleOperationChange}
                        label={strings.filter.operation}
                        size="small"
                    >
                        {Object.values(DateFilterOperation).map((op) => (
                            <MenuItem key={op} value={op}>
                                {strings.dateFilterOps[op]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {showSingleDate && (
                    <TextField
                        variant="outlined"
                        size="small"
                        label={strings.filter.value}
                        type="date"
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        value={fromDate}
                        onChange={handleFromDateChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        autoFocus
                        sx={{ mb: 2 }}
                        error={!!error}
                        helperText={error}
                    />
                )}

                {showBothDates && (
                    <>
                        <TextField
                            variant="outlined"
                            size="small"
                            label={strings.dateFilterOps.from}
                            type="date" // Use type="date" for native date picker
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            value={fromDate}
                            onChange={handleFromDateChange}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            autoFocus
                            sx={{ mb: 2 }}
                            error={!!error && !fromDate && !toDate}
                            helperText={
                                error && !fromDate && !toDate ? error : ""
                            }
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            label={strings.dateFilterOps.to}
                            type="date" // Use type="date" for native date picker
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            value={toDate}
                            onChange={handleToDateChange}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    </>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    {activeFilter ? (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Clear />}
                            onClick={handleClear}
                        >
                            {strings.filter.clear}
                        </Button>
                    ) : (
                        <Button variant="text" size="small" onClick={onClose}>
                            {strings.filter.cancel}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Check />}
                        onClick={handleApply}
                        disabled={
                            valueRequired &&
                            ((showBothDates && !fromDate && !toDate) ||
                                (showSingleDate && !fromDate))
                        }
                    >
                        {strings.filter.apply}
                    </Button>
                </Box>
            </Box>
        </Popover>
    );
};

export default DateFilterPopover;

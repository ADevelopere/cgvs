import type React from "react";
import { Box, Typography, TextField, Button, Popover } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import type { FilterPopoverProps } from "./types";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableLocale } from "@/client/locale/table/TableLocaleContext";

const FilterPopover: React.FC<FilterPopoverProps> = ({
    anchorEl,
    open,
    onClose,
    columnId,
    columnLabel,
    value,
    hasActiveFilter,
    onChange,
    onKeyDown,
}) => {
    const { applyFilter, clearFilter } = useTableDataContext();
    const { strings } = useTableLocale();
    if (!columnId) return null;

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
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder={strings.filter.value}
                    value={value}
                    onChange={(e) => onChange(columnId, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, columnId)}
                    fullWidth
                    autoFocus
                    sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    {hasActiveFilter ? (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Clear />}
                            onClick={() => clearFilter(columnId)}
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
                        onClick={() => applyFilter(columnId)}
                        disabled={!value}
                    >
                        {strings.filter.apply}
                    </Button>
                </Box>
            </Box>
        </Popover>
    );
};

export default FilterPopover;

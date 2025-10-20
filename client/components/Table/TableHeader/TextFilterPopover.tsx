import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  type SelectChangeEvent,
} from "@mui/material";
import {
  type FilterClause,
  TextFilterOperation,
  operationRequiresValue,
} from "@/client/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableLocale } from "@/client/locale/table/TableLocaleContext";
import logger from "@/client/lib/logger";

interface TextFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  activeFilter: FilterClause<string, TextFilterOperation> | null;
}

const TextFilterPopover: React.FC<TextFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  activeFilter,
}) => {
  const { strings } = useTableLocale();
  const { applyTextFilter, clearFilter } = useTableDataContext();

  const [operation, setOperation] = useState<TextFilterOperation>(
    activeFilter?.operation || TextFilterOperation.contains
  );
  const [value, setValue] = useState<string>(activeFilter?.value || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeFilter) {
      setOperation(activeFilter.operation);
      setValue(activeFilter.value || "");
    } else {
      setOperation(TextFilterOperation.contains);
      setValue("");
    }
    setError(null);
  }, [activeFilter, open]);

  const handleOperationChange = useCallback(
    (event: SelectChangeEvent<TextFilterOperation>) => {
      const newOperation = event.target.value as TextFilterOperation;
      setOperation(newOperation);
      if (!operationRequiresValue(newOperation)) {
        setValue("");
      }
      setError(null);
    },
    []
  );

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      setError(null);
    },
    []
  );

  const valueRequired = useMemo(
    () => operationRequiresValue(operation),
    [operation]
  );

  const handleApply = useCallback(() => {
    if (valueRequired && !value.trim()) {
      setError("Value is required for this operation");
      return;
    }
    const filterClause: FilterClause<string, TextFilterOperation> = {
      columnId,
      operation,
      ...(valueRequired ? { value } : {}),
    };
    applyTextFilter(filterClause);
    onClose();
  }, [applyTextFilter, columnId, onClose, operation, value, valueRequired]);

  const handleClear = useCallback(() => {
    logger.info(
      "🔍 TextFilterPopover: handleClear called for columnId:",
      columnId
    );
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
    [handleApply, onClose]
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
      <Box sx={{ p: 2, width: 300 }} onKeyDown={handleKeyDown}>
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
            {Object.values(TextFilterOperation).map(op => (
              <MenuItem key={op} value={op}>
                {strings.textFilterOps[op]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {valueRequired && (
          <TextField
            variant="outlined"
            size="small"
            label={strings.filter.value}
            placeholder={strings.filter.value}
            value={value}
            onChange={handleValueChange}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
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
            disabled={valueRequired && !value.trim()}
          >
            {strings.filter.apply}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default TextFilterPopover;

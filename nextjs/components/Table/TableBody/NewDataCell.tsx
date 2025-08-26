"use client";

import React, {
    CSSProperties,
    useCallback,
    useRef,
    useMemo,
    useEffect,
} from "react";
import {
    FilledTextFieldProps,
    OutlinedTextFieldProps,
    StandardTextFieldProps,
} from "@mui/material";
import { EditableColumn } from "@/types/table.type";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableDataContext } from "../Table/TableDataContext";
import CellContentRenderer from "./CellContentRenderer";
import useAppTranslation from "@/locale/useAppTranslation";

// Helper functions (getCellValue, formatCellValue, formatInputValue) remain the same
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCellValue = (column: EditableColumn, rowData: any) => {
    if (typeof column.accessor === "function") {
        return column.accessor(rowData);
    }
    return rowData[column.accessor];
};

type RenderCellProps = {
    column: EditableColumn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    cellEditingStyle: CSSProperties;
    cellStyle: CSSProperties;
    inputStyle: CSSProperties; // Expect inputStyle to be passed as a prop
};

export type DataCellState = {
    isEditing: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localTmpValue: any;
    localErrorMessage: string | null;
};

const NewDataCell = React.memo<RenderCellProps>(({
    column,
    rowData,
    cellEditingStyle,
    cellStyle,
    inputStyle,
}) => {
    const countryStrings = useAppTranslation("countryTranslations");
    const { getEditingState, setEditingState } = useTableDataContext();
    const { pinnedColumns, pinnedLeftStyle, pinnedRightStyle, columnWidths } =
        useTableColumnContext();
    const state = useRef<DataCellState>({
        isEditing: false,
        localTmpValue: getCellValue(column, rowData),
        localErrorMessage: null,
    });

    // Ref for the input element to focus when editing starts

    const inputRef = useRef<HTMLInputElement | null>(null);

    const validateValue = useCallback(
        (value: unknown): string | null => {
            return column?.getIsValid?.(value) ?? null;
        },
        [column],
    );

    const handleCellClick = useCallback(() => {
        if (column.editable && !state.current.isEditing) {
            const value = getCellValue(column, rowData);
            const validationError = validateValue(value);
            state.current = {
                isEditing: true,
                localTmpValue: value,
                localErrorMessage: validationError,
            };
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 10);
        }
    }, [column, rowData, validateValue]);

    const handleUpdate = useCallback(() => {
        if (state.current.localErrorMessage) return;
        const { localTmpValue } = state.current;
        const originalValue = getCellValue(column, rowData);

        if (
            localTmpValue !== null &&
            localTmpValue !== undefined &&
            localTmpValue !== originalValue &&
            column.onUpdate
        ) {
            column.onUpdate(rowData.id, localTmpValue);
        }
    }, [column, rowData]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            const validationError = validateValue(newValue);

            // For select type, update and blur immediately after selection
            if (column.type === "select") {
                state.current = {
                    localTmpValue: newValue,
                    localErrorMessage: validationError,
                    isEditing: false,
                };
                handleUpdate();
                return;
            }

            state.current = {
                ...state.current,
                localTmpValue: newValue,
                localErrorMessage: validationError,
            };
        },
        [column.type, handleUpdate, validateValue],
    );

    const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (column.editable) {
                if (e.key === "Enter" && !state.current.localErrorMessage) {
                    state.current = { ...state.current, isEditing: false };
                    handleUpdate();
                } else if (e.key === "Escape") {
                    // Revert changes or simply exit editing mode
                    // For now, just exit, mirroring original implicit behavior
                    const originalValue = getCellValue(column, rowData);

                    state.current = {
                        isEditing: false,
                        localTmpValue: originalValue, // Revert to original value on escape
                        localErrorMessage: validateValue(originalValue), // Re-validate original value
                    };
                }
            }
        },
        [column, handleUpdate, rowData, validateValue],
    );

    const getCommonTextFieldProps = useCallback(():
        | FilledTextFieldProps
        | OutlinedTextFieldProps
        | StandardTextFieldProps => {
        return {
            inputRef: inputRef,
            onChange: handleInputChange,
            onBlur: handleUpdate,
            onKeyDown: handleInputKeyDown,
            focused: state.current.isEditing,
            variant: "standard" as const,
            fullWidth: true,
            sx: inputStyle,
            className: state.current.localErrorMessage ? "error" : undefined,
            InputProps: {
                disableUnderline: true,
            },
            error: !!state.current.localErrorMessage,
            color: state.current.localErrorMessage
                ? ("error" as const)
                : ("primary" as const),
        };
    }, [handleInputChange, handleInputKeyDown, handleUpdate, inputStyle]);

    const cellStyleWithPin = useMemo(() => {
        const width = columnWidths[column.id];
        const effectiveCellStyle = state.current.isEditing
            ? {
                  ...cellEditingStyle,
                  width: `${width}px`,
              }
            : { ...cellStyle, width: `${width}px` };

        const pinPosition = pinnedColumns[column.id];
        if (pinPosition === "left") {
            return {
                ...effectiveCellStyle,
                ...pinnedLeftStyle,
            };
        } else if (pinPosition === "right") {
            return {
                ...effectiveCellStyle,
                ...pinnedRightStyle,
            };
        }
        return effectiveCellStyle;
    }, [
        columnWidths,
        column.id,
        cellEditingStyle,
        cellStyle,
        pinnedColumns,
        pinnedLeftStyle,
        pinnedRightStyle,
    ]);

    useEffect(() => {
        // componentDidMount equivalent
        const editingState = getEditingState(rowData.id, column.id);
        if (editingState) {
            state.current = {
                isEditing: editingState.isEditing,
                localTmpValue: editingState.tmpValue,
                localErrorMessage: editingState.errorMessage,
            };
        }
    }, [getEditingState, rowData.id, column.id]);

    useEffect(() => {
        // componentWillUnmount equivalent
        return () => {
            if (state.current.isEditing) {
                setEditingState(rowData.id, column.id, {
                    isEditing: state.current.isEditing,
                    tmpValue: state.current.localTmpValue,
                    errorMessage: state.current.localErrorMessage,
                });
            } else {
                setEditingState(rowData.id, column.id, null);
            }
        };
    }, [setEditingState, rowData.id, column.id]);

    return (
        <td key={column.id} onDoubleClick={handleCellClick}>
            <div
                style={{
                    ...cellStyleWithPin,
                    position: "relative",
                }}
            >
                <div
                    style={{
                        direction: column.type === "phone" ? "ltr" : "inherit",
                        textAlign: column.type === "phone" ? "left" : "inherit",
                    }}
                >
                    <CellContentRenderer
                        column={column}
                        rowData={rowData}
                        countryStrings={countryStrings}
                        state={state}
                        commonProps={getCommonTextFieldProps()}
                        validateValue={validateValue}
                        handleUpdate={handleUpdate}
                        handleInputKeyDown={handleInputKeyDown}
                        value={state.current.localTmpValue}
                        isEditing={state.current.isEditing}
                        errorMessage={state.current.localErrorMessage}
                    />
                </div>
            </div>
        </td>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function (opposite of shouldComponentUpdate)
    if (
        prevProps.column.id !== nextProps.column.id ||
        prevProps.rowData.id !== nextProps.rowData.id ||
        prevProps.cellEditingStyle !== nextProps.cellEditingStyle ||
        prevProps.cellStyle !== nextProps.cellStyle ||
        prevProps.inputStyle !== nextProps.inputStyle
    ) {
        return false; // Re-render
    }
    return true; // Don't re-render
});

NewDataCell.displayName = "NewDataCell";

export default NewDataCell;

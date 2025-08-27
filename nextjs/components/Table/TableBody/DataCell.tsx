"use client";

import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    FilledTextFieldProps,
    OutlinedTextFieldProps,
    StandardTextFieldProps,
} from "@mui/material";
import { EditableColumn } from "@/types/table.type";
import { TableCellEditingState } from "../Table/TableDataContext";
import CellContentRenderer from "./CellContentRenderer";
import logger from "@/utils/logger";

type DataCellProps = {
    column: EditableColumn;
    rowId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cellValue: any;
    cellEditingStyle: CSSProperties;
    cellStyle: CSSProperties;
    inputStyle: CSSProperties;
    getColumnPinPosition: (columnId: string) => "left" | "right" | null;
    getColumnWidth: (columnId: string) => number | undefined;
    pinnedLeftStyle: React.CSSProperties;
    pinnedRightStyle: React.CSSProperties;

    getEditingState: (
        rowId: string | number,
        columnId: string,
    ) => TableCellEditingState | null;
    setEditingState: (
        rowId: string | number,
        columnId: string,
        state: TableCellEditingState | null,
    ) => void;
};

// Simplified state structure
export type DataCellState = {
    isEditing: boolean;
    editingValue: unknown; // Only used when isEditing is true
    errorMessage: string | null;
};

const DataCell = React.memo<DataCellProps>(
    ({
        column,
        rowId,
        cellValue,
        cellEditingStyle,
        cellStyle,
        inputStyle,
        getColumnPinPosition,
        getColumnWidth,
        pinnedLeftStyle,
        pinnedRightStyle,
        getEditingState,
        setEditingState,
    }) => {
        logger.log("Rendering NewDataCell", { rowId, columnId: column.id });

        const [state, setState] = useState<DataCellState>({
            isEditing: false,
            editingValue: cellValue,
            errorMessage: null,
        });

        const stateRef = useRef(state);
        useEffect(() => {
            stateRef.current = state;
        }, [state]);

        const inputRef = useRef<HTMLInputElement | null>(null);

        // This effect handles external changes to cellValue, resetting the component state.
        useEffect(() => {
            setState({
                isEditing: false,
                editingValue: cellValue,
                errorMessage: null,
            });
        }, [cellValue, column]);

        useEffect(() => {
            if (state.isEditing) {
                inputRef.current?.focus();
            }
        }, [state.isEditing]);

        const validateValue = useCallback(
            (value: unknown): string | null => {
                return column?.getIsValid?.(value) ?? null;
            },
            [column],
        );

        // Function to commit changes
        const commitChanges = useCallback(
            (value: unknown) => {
                const validationError = validateValue(value);
                if (validationError) {
                    // Do not commit if the value is invalid.
                    // The user will remain in editing mode with the error message shown.
                    setState((prevState) => ({
                        ...prevState,
                        errorMessage: validationError,
                    }));
                    return;
                }

                if (value !== cellValue && column.onUpdate) {
                    column.onUpdate(rowId, value);
                }
                setState((prevState) => ({ ...prevState, isEditing: false }));
            },
            [cellValue, column, rowId, validateValue],
        );

        const handleCellClick = useCallback(() => {
            if (column.editable && !state.isEditing) {
                setState({
                    isEditing: true,
                    editingValue: cellValue,
                    errorMessage: validateValue(cellValue),
                });
            }
        }, [cellValue, column.editable, state.isEditing, validateValue]);

        const handleInputChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                setState((prevState) => ({
                    ...prevState,
                    editingValue: newValue,
                    errorMessage: validateValue(newValue),
                }));

                if (column.type === "select" || column.type === "country") {
                    commitChanges(newValue);
                }
            },
            [column.type, validateValue, commitChanges],
        );

        const handleBlur = useCallback(() => {
            if (stateRef.current.isEditing) {
                commitChanges(stateRef.current.editingValue);
            }
        }, [commitChanges]);

        const handleInputKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && !stateRef.current.errorMessage) {
                    commitChanges(stateRef.current.editingValue);
                } else if (e.key === "Escape") {
                    setState({
                        isEditing: false,
                        editingValue: cellValue, // Revert to original value
                        errorMessage: null,
                    });
                }
            },
            [cellValue, commitChanges],
        );

        const commonProps = useMemo<
            | FilledTextFieldProps
            | OutlinedTextFieldProps
            | StandardTextFieldProps
        >(
            () => ({
                onChange: handleInputChange,
                onBlur: handleBlur,
                onKeyDown: handleInputKeyDown,
                focused: state.isEditing,
                variant: "standard",
                fullWidth: true,
                sx: inputStyle,
                className: state.errorMessage ? "error" : undefined,
                InputProps: { disableUnderline: true },
                error: !!state.errorMessage,
                color: state.errorMessage ? "error" : "primary",
            }),
            [
                handleInputChange,
                handleInputKeyDown,
                handleBlur,
                inputStyle,
                state.isEditing,
                state.errorMessage,
            ],
        );

        const cellStyleWithPin = useMemo(() => {
            const width = getColumnWidth(column.id) ?? 150;
            const baseStyle = state.isEditing ? cellEditingStyle : cellStyle;
            const effectiveCellStyle = { ...baseStyle, width: `${width}px` };

            const pinPosition = getColumnPinPosition(column.id);
            if (pinPosition === "left") {
                return { ...effectiveCellStyle, ...pinnedLeftStyle };
            }
            if (pinPosition === "right") {
                return { ...effectiveCellStyle, ...pinnedRightStyle };
            }
            return effectiveCellStyle;
        }, [
            getColumnWidth,
            column.id,
            state.isEditing,
            cellEditingStyle,
            cellStyle,
            getColumnPinPosition,
            pinnedLeftStyle,
            pinnedRightStyle,
        ]);

        // This pair of effects handles saving and restoring state on mount/unmount for virtualization
        useEffect(() => {
            const savedState = getEditingState(rowId, column.id);
            if (savedState) {
                setState({
                    isEditing: savedState.isEditing,
                    editingValue: savedState.tmpValue,
                    errorMessage: savedState.errorMessage,
                });
            }
        }, [getEditingState, rowId, column.id]);

        useEffect(() => {
            return () => {
                const currentState = stateRef.current;
                if (currentState.isEditing) {
                    setEditingState(rowId, column.id, {
                        isEditing: currentState.isEditing,
                        tmpValue: currentState.editingValue,
                        errorMessage: currentState.errorMessage,
                    });
                } else {
                    setEditingState(rowId, column.id, null);
                }
            };
        }, [setEditingState, rowId, column.id]);

        return (
            <td key={column.id} onDoubleClick={handleCellClick}>
                <div style={{ ...cellStyleWithPin, position: "relative" }}>
                    <div
                        style={{
                            direction:
                                column.type === "phone" ? "ltr" : "inherit",
                            textAlign:
                                column.type === "phone" ? "left" : "inherit",
                        }}
                    >
                        <CellContentRenderer
                            ref={inputRef}
                            column={column}
                            cellValue={cellValue}
                            state={{
                                ...state,
                                // Pass the correct value to the renderer
                                editingValue: state.isEditing
                                    ? state.editingValue
                                    : cellValue,
                                errorMessage: state.errorMessage,
                            }}
                            setState={setState}
                            commonProps={commonProps}
                            validateValue={validateValue}
                            handleBlur={handleBlur}
                            handleInputKeyDown={handleInputKeyDown}
                        />
                    </div>
                </div>
            </td>
        );
    },
);

DataCell.displayName = "DataCell";

export default DataCell;

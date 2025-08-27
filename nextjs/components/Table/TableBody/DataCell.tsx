"use client";

import React, { CSSProperties } from "react";
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
    inputStyle: CSSProperties; // Expect inputStyle to be passed as a prop
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

export type DataCellState = {
    isEditing: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localTmpValue: any;
    localErrorMessage: string | null;
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

        const [state, setState] = React.useState<DataCellState>({
            isEditing: false,
            localTmpValue: cellValue,
            localErrorMessage: null,
        });

        // update state when cellValue or column changes
        React.useEffect(() => {
            setState((prevState) => ({
                ...prevState,
                localTmpValue: cellValue,
                localErrorMessage: null,
                isEditing: false,
            }));
        }, [cellValue, column]);

        // use when possible stale closures in callbacks
        const stateRef = React.useRef(state);
        const wasEditingRef = React.useRef(false);

        // Ref for the input element to focus when editing starts
        const inputRef = React.useRef<HTMLInputElement | null>(null);

        React.useEffect(() => {
            stateRef.current = state;
        }, [state]);

        const handleUpdate = React.useCallback(() => {
            if (stateRef.current.localErrorMessage) return;
            const { localTmpValue } = stateRef.current; // Use ref to get latest value
            const originalValue = cellValue;

            if (
                localTmpValue !== null &&
                localTmpValue !== undefined &&
                localTmpValue !== originalValue &&
                column.onUpdate
            ) {
                column.onUpdate(rowId, localTmpValue);
            }
        }, [cellValue, column, rowId]);

        React.useEffect(() => {
            stateRef.current = state;
            // When editing stops (i.e., isEditing was true and is now false),
            // call handleUpdate.
            if (wasEditingRef.current && !state.isEditing) {
                handleUpdate();
            }
            wasEditingRef.current = state.isEditing;
        }, [state, handleUpdate]);

        const validateValue = React.useCallback(
            (value: unknown): string | null => {
                return column?.getIsValid?.(value) ?? null;
            },
            [column],
        );

        const handleCellClick = React.useCallback(() => {
            if (column.editable && !state.isEditing) {
                const value = cellValue;
                const validationError = validateValue(value);
                setState({
                    isEditing: true,
                    localTmpValue: value,
                    localErrorMessage: validationError,
                });
                // Focus the input after a slight delay to ensure it is rendered
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 10);
            }
        }, [cellValue, column.editable, state.isEditing, validateValue]);

        const handleInputChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                const validationError = validateValue(newValue);

                // For select type, just update the state. The useEffect will handle the update.
                if (column.type === "select") {
                    setState({
                        localTmpValue: newValue,
                        localErrorMessage: validationError,
                        isEditing: false,
                    });
                    return;
                }

                setState({
                    ...stateRef.current,
                    localTmpValue: newValue,
                    localErrorMessage: validationError,
                });
            },
            [column.type, validateValue],
        );

        const handleBlur = React.useCallback(() => {
            if (stateRef.current.isEditing) {
                setState((prev) => ({ ...prev, isEditing: false }));
            }
        }, []);

        const handleInputKeyDown = React.useCallback(
            (e: React.KeyboardEvent) => {
                if (column.editable) {
                    if (
                        e.key === "Enter" &&
                        !stateRef.current.localErrorMessage
                    ) {
                        setState({
                            ...stateRef.current,
                            isEditing: false,
                        });
                    } else if (e.key === "Escape") {
                        // Revert changes or simply exit editing mode
                        // For now, just exit, mirroring original implicit behavior
                        const originalValue = cellValue;

                        setState({
                            isEditing: false,
                            localTmpValue: originalValue, // Revert to original value on escape
                            localErrorMessage: validateValue(originalValue), // Re-validate original value
                        });
                    }
                }
            },
            [cellValue, column.editable, validateValue],
        );

        const commonProps = React.useMemo<
            | FilledTextFieldProps
            | OutlinedTextFieldProps
            | StandardTextFieldProps
        >(() => {
            return {
                onChange: handleInputChange,
                onBlur: handleBlur,
                onKeyDown: handleInputKeyDown,
                focused: state.isEditing,
                variant: "standard" as const,
                fullWidth: true,
                sx: inputStyle,
                className: state.localErrorMessage ? "error" : undefined,
                InputProps: {
                    disableUnderline: true,
                },
                error: !!state.localErrorMessage,
                color: state.localErrorMessage
                    ? ("error" as const)
                    : ("primary" as const),
            };
        }, [
            handleInputChange,
            handleInputKeyDown,
            handleBlur,
            inputStyle,
            state.isEditing,
            state.localErrorMessage,
        ]);

        const cellStyleWithPin = React.useMemo(() => {
            const width = getColumnWidth(column.id) ?? 150; // default width if undefined
            const effectiveCellStyle = state.isEditing
                ? {
                      ...cellEditingStyle,
                      width: `${width}px`,
                  }
                : { ...cellStyle, width: `${width}px` };

            const pinPosition = getColumnPinPosition(column.id);
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
            getColumnWidth,
            column.id,
            state.isEditing,
            cellEditingStyle,
            cellStyle,
            getColumnPinPosition,
            pinnedLeftStyle,
            pinnedRightStyle,
        ]);

        React.useEffect(() => {
            // componentDidMount equivalent
            const editingState = getEditingState(rowId, column.id);
            if (editingState) {
                setState({
                    isEditing: editingState.isEditing,
                    localTmpValue: editingState.tmpValue,
                    localErrorMessage: editingState.errorMessage,
                });
            }
        }, [getEditingState, rowId, column.id]);

        React.useEffect(() => {
            // componentWillUnmount equivalent
            return () => {
                if (stateRef.current.isEditing) {
                    setEditingState(rowId, column.id, {
                        isEditing: stateRef.current.isEditing,
                        tmpValue: stateRef.current.localTmpValue,
                        errorMessage: stateRef.current.localErrorMessage,
                    });
                } else {
                    setEditingState(rowId, column.id, null);
                }
            };
        }, [setEditingState, rowId, column.id]);

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
                            state={state}
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
    (prevProps, nextProps) => {
        // Custom comparison function (opposite of shouldComponentUpdate)
        if (
            prevProps.column.id !== nextProps.column.id ||
            prevProps.cellValue !== nextProps.cellValue ||
            prevProps.rowId !== nextProps.rowId ||
            prevProps.cellEditingStyle !== nextProps.cellEditingStyle ||
            prevProps.cellStyle !== nextProps.cellStyle ||
            prevProps.inputStyle !== nextProps.inputStyle
        ) {
            return false; // Re-render
        }
        return true; // Don't re-render
    },
);

DataCell.displayName = "NewDataCell";

export default DataCell;

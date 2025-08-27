import React from "react";
import { useTheme } from "@mui/material/styles";
import { Checkbox, Box } from "@mui/material";
import { getCellValue } from "./DataCell.util";
import {
    TABLE_CHECKBOX_CONTAINER_SIZE,
    TABLE_CHECKBOX_WIDTH,
} from "@/constants/tableConstants";
import { useTableStyles } from "@/theme/styles";
import DataCell from "./DataCell";
import { EditableColumn } from "@/types/table.type";
import { TableCellEditingState } from "../Table/TableDataContext";

export type DataRowProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    height: number;
    virtualIndex?: number;
    globalIndex: number; // Add globalIndex prop
    getEditingState: (
        rowId: string | number,
        columnId: string,
    ) => TableCellEditingState | null;
    setEditingState: (
        rowId: string | number,
        columnId: string,
        state: TableCellEditingState | null,
    ) => void;
    // column
    visibleColumns: EditableColumn[];
    getColumnWidth: (columnId: string) => number | undefined;
    indexColWidth: number;
    getColumnPinPosition: (columnId: string) => "left" | "right" | null;
    // row
    rowIdKey: string;
    resizeRowHeight: (rowId: number | string, newHeight: number) => void;
    toggleRowSelection: (rowId: string | number) => void;
    isRowSelected: (rowId: string | number) => boolean;
    getRowStyle?: (rowData: unknown, rowIndex: number) => React.CSSProperties;
    onRowResize?: (rowId: string | number, newHeight: number) => void;
    rowSelectionEnabled: boolean;
    enableRowResizing: boolean;
    // styles
    pinnedLeftStyle: React.CSSProperties;
    pinnedRightStyle: React.CSSProperties;
};

const DataRow: React.FC<DataRowProps> = React.memo(
    ({
        rowData,
        height,
        virtualIndex = 0,
        globalIndex,
        getEditingState,
        setEditingState,
        // column
        visibleColumns,
        getColumnWidth,
        indexColWidth,
        getColumnPinPosition,
        // row
        rowIdKey,
        resizeRowHeight,
        toggleRowSelection,
        isRowSelected,
        getRowStyle,
        onRowResize,
        rowSelectionEnabled,
        enableRowResizing,
        // styles
        pinnedLeftStyle,
        pinnedRightStyle,
    }) => {
        const theme = useTheme();
        const rowRef = React.useRef<HTMLTableRowElement>(null);
        const [resizing, setResizing] = React.useState(false);
        const [startY, setStartY] = React.useState(0);
        const [startHeight, setStartHeight] = React.useState(0);

        const { inputStyle } = useTableStyles();

        const cellStyle: React.CSSProperties = React.useMemo(() => {
            return {
                padding: 16,
                textAlign: "start" as const,
                // // border
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderTop: "none",
                borderInlineStart: "none",
                borderInlineEnd: `1px solid ${theme.palette.divider}`,
                // // end border
                overflow: "hidden" as const,
                whiteSpace: "nowrap" as const,
                textOverflow: "ellipsis" as const,
                height: height + 8,
                maxHeight: height + 8,
            };
        }, [height, theme.palette.divider]);

        const cellEditingStyle: React.CSSProperties = React.useMemo(() => {
            return {
                ...cellStyle,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                borderTop: `2px solid ${theme.palette.primary.main}`,
                borderInlineStart: `2px solid ${theme.palette.primary.main}`,
                borderInlineEnd: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.paper,
            };
        }, [
            cellStyle,
            theme.palette.background.paper,
            theme.palette.primary.main,
        ]);

        // Check if this row is selected

        const handleResizeStart = React.useCallback(
            (e: React.MouseEvent) => {
                setResizing(true);
                setStartY(e.clientY);
                setStartHeight(height);
                e.preventDefault();
            },
            [height],
        );

        React.useEffect(() => {
            const handleResizeMove = (e: MouseEvent) => {
                if (!resizing) return;

                const deltaY = e.clientY - startY;
                const newHeight = startHeight + deltaY;

                // Use requestAnimationFrame for smoother resizing
                requestAnimationFrame(() => {
                    resizeRowHeight(rowData.id, newHeight);
                    onRowResize?.(rowData.id, newHeight);
                });
            };

            const handleResizeEnd = () => {
                setResizing(false);
            };

            if (resizing) {
                document.addEventListener("mousemove", handleResizeMove);
                document.addEventListener("mouseup", handleResizeEnd);

                // Add a class to the body to prevent text selection during resize
                document.body.classList.add("resizing");
            } else {
                document.body.classList.remove("resizing");
            }

            return () => {
                document.removeEventListener("mousemove", handleResizeMove);
                document.removeEventListener("mouseup", handleResizeEnd);
                document.body.classList.remove("resizing");
            };
        }, [
            resizing,
            startY,
            startHeight,
            resizeRowHeight,
            rowData.id,
            onRowResize,
        ]);

        const handleRowSelectionChange = React.useCallback(() => {
            if (
                !toggleRowSelection ||
                !rowData ||
                rowData[rowIdKey] === undefined
            )
                return;

            toggleRowSelection(rowData[rowIdKey]);
        }, [rowData, rowIdKey, toggleRowSelection]);

        const backgroundColor = React.useMemo(() => {
            if (isRowSelected(rowData[rowIdKey])) {
                return theme.palette.action.selected;
            }
            return virtualIndex % 2 === 0
                ? theme.palette.customTable.evenRow
                : theme.palette.customTable.oddRow;
        }, [
            isRowSelected,
            rowData,
            rowIdKey,
            virtualIndex,
            theme.palette.customTable.evenRow,
            theme.palette.customTable.oddRow,
            theme.palette.action.selected,
        ]);

        const overrideRowStyle = React.useMemo(() => {
            if (getRowStyle) {
                return getRowStyle(rowData, virtualIndex);
            }
            return {};
        }, [getRowStyle, rowData, virtualIndex]);

        return (
            <tr
                ref={rowRef}
                style={{
                    display: "table-row",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: backgroundColor,
                    color: theme.palette.text.secondary,
                    position: "relative",
                    ...overrideRowStyle,
                }}
            >
                <td
                    style={{
                        ...cellStyle,
                        width: indexColWidth,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {globalIndex}
                </td>

                {rowSelectionEnabled && (
                    <td>
                        <Box
                            sx={{
                                height: height - 2,
                                display: "flex",
                                alignItems: "center",
                                paddingInline: "8px",
                                borderInlineEnd: `1px solid ${theme.palette.divider}`,
                                width: TABLE_CHECKBOX_CONTAINER_SIZE,
                                minWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
                            }}
                        >
                            <Checkbox
                                checked={isRowSelected(rowData[rowIdKey])}
                                onChange={handleRowSelectionChange}
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
                    </td>
                )}

                {visibleColumns.map((column) => {
                    const cellValue = getCellValue(column, rowData);
                    const rowId = rowData[rowIdKey];
                    return (
                        <DataCell
                            key={column.id}
                            column={column}
                            rowId={rowId}
                            cellValue={cellValue}
                            cellStyle={cellStyle}
                            cellEditingStyle={cellEditingStyle}
                            inputStyle={inputStyle}
                            getColumnPinPosition={getColumnPinPosition}
                            getColumnWidth={getColumnWidth}
                            pinnedLeftStyle={pinnedLeftStyle}
                            pinnedRightStyle={pinnedRightStyle}
                            getEditingState={getEditingState}
                            setEditingState={setEditingState}
                        />
                    );
                })}
                {enableRowResizing && (
                    <td
                        style={{
                            flex: "0 0 0",
                            width: 0,
                            padding: 0,
                            border: "none",
                        }}
                    >
                        <Box
                            style={{
                                position: "absolute" as const,
                                bottom: "-3px",
                                left: 0,
                                right: 0,
                                cursor: "row-resize",
                                zIndex: 10,
                                userSelect: "none" as const,
                                touchAction: "none" as const,
                                backgroundColor: theme.palette.divider,
                                height: 4,
                            }}
                            onMouseDown={handleResizeStart}
                        />
                    </td>
                )}
            </tr>
        );
    },
    (prev, next) =>
        prev.rowData === next.rowData &&
        prev.height === next.height &&
        prev.virtualIndex === next.virtualIndex &&
        prev.globalIndex === next.globalIndex &&
        prev.getEditingState === next.getEditingState &&
        prev.setEditingState === next.setEditingState &&
        prev.visibleColumns === next.visibleColumns &&
        prev.getColumnWidth === next.getColumnWidth &&
        prev.indexColWidth === next.indexColWidth &&
        prev.getColumnPinPosition === next.getColumnPinPosition &&
        prev.rowIdKey === next.rowIdKey &&
        prev.resizeRowHeight === next.resizeRowHeight &&
        prev.toggleRowSelection === next.toggleRowSelection &&
        prev.isRowSelected === next.isRowSelected &&
        prev.getRowStyle === next.getRowStyle &&
        prev.onRowResize === next.onRowResize &&
        prev.rowSelectionEnabled === next.rowSelectionEnabled &&
        prev.enableRowResizing === next.enableRowResizing &&
        prev.pinnedLeftStyle === next.pinnedLeftStyle &&
        prev.pinnedRightStyle === next.pinnedRightStyle,
);

DataRow.displayName = "DataRow";

export default DataRow;

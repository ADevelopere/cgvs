import type React from "react";
import {
    useRef,
    useState,
    useEffect,
    CSSProperties,
    useMemo,
    useCallback,
} from "react";
import { useTheme } from "@mui/material/styles";
import { Checkbox, Box } from "@mui/material";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableColumnContext } from "../Table/TableColumnContext";
import DataCell from "./DataCell";
import {
    TABLE_CHECKBOX_CONTAINER_SIZE,
    TABLE_CHECKBOX_WIDTH,
} from "@/constants/tableConstants";
import { useTableStyles } from "@/theme/styles";

export type DataRowProps = {
    rowData: any;
    height: number;
    virtualIndex?: number;
    onRowResize?: (rowId: string | number, newHeight: number) => void;
    width: number;
    globalIndex: number; // Add globalIndex prop
    indexColWidth: number; // Add indexColWidth prop
}

const DataRow: React.FC<DataRowProps> = ({
    rowData,
    height,
    width,
    virtualIndex = 0,
    onRowResize,
    globalIndex,
    indexColWidth,
}) => {
    const {
        rowSelectionEnabled,
        getRowStyle,
        resizeRowHeight,
        rowIdKey,
        selectedRowIds,
        toggleRowSelection,
    } = useTableRowsContext();
    const { allColumns } = useTableColumnContext();
    const theme = useTheme();
    const rowRef = useRef<HTMLTableRowElement>(null);
    const [resizing, setResizing] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);

    const { inputStyle } = useTableStyles();

    const cellStyle: CSSProperties = useMemo(() => {
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
            height: height - 2,
            maxHeight: height - 2,
        };
    }, [theme]);

    const cellEditingStyle: CSSProperties = useMemo(() => {
        return {
            ...cellStyle,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            borderTop: `2px solid ${theme.palette.primary.main}`,
            borderInlineStart: `2px solid ${theme.palette.primary.main}`,
            borderInlineEnd: `2px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.background.paper,
        };
    }, [theme]);

    // Check if this row is selected
    const isRowSelected =
        rowSelectionEnabled && selectedRowIds.includes(rowData[rowIdKey]);

    const handleResizeStart = useCallback(
        (e: React.MouseEvent) => {
            setResizing(true);
            setStartY(e.clientY);
            setStartHeight(height);
            e.preventDefault();
        },
        [height],
    );

    useEffect(() => {
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
    }, [resizing, startY, startHeight, resizeRowHeight, rowData.id]);

    const handleRowSelectionChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (
                !toggleRowSelection ||
                !rowData ||
                rowData[rowIdKey] === undefined
            )
                return;

            const rowId = rowData[rowIdKey];
            toggleRowSelection(rowId);
        },
        [rowData, rowIdKey, toggleRowSelection],
    );
    const backgroundColor = useMemo(() => {
        if (isRowSelected) {
            return theme.palette.action.selected;
        }
        return virtualIndex % 2 === 0
            ? theme.palette.customTable.evenRow
            : theme.palette.customTable.oddRow;
    }, [isRowSelected, virtualIndex, theme]);

    const overrideRowStyle = useMemo(() => {
        if (getRowStyle) {
            return getRowStyle(rowData, virtualIndex);
        }
        return {};
    }, [getRowStyle, rowData, virtualIndex]);

    return (
        <tr
            ref={rowRef}
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: backgroundColor,
                color: theme.palette.text.secondary,
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
                            checked={isRowSelected}
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

            {allColumns.map((column) => (
                <DataCell
                    key={column.id}
                    column={column}
                    rowData={rowData}
                    cellStyle={cellStyle}
                    cellEditingStyle={cellEditingStyle}
                    inputStyle={inputStyle}
                />
            ))}
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
        </tr>
    );
};

export default DataRow;

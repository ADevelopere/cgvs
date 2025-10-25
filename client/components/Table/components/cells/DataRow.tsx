import React from "react";
import { useTheme } from "@mui/material/styles";
import { Checkbox, Box } from "@mui/material";
import {
  TABLE_CHECKBOX_CONTAINER_SIZE,
  TABLE_CHECKBOX_WIDTH,
} from "../../constants";
import { DataCell } from "./DataCell";
import { AnyColumn } from "../../types";

export type DataRowProps<
  TRowData,
  TRowId extends string | number = string | number,
> = {
  rowData: TRowData;
  height: number;
  virtualIndex?: number;
  globalIndex: number; // Add globalIndex prop
  // column
  visibleColumns: readonly AnyColumn<TRowData, TRowId>[];
  getColumnWidth: (columnId: string) => number | undefined;
  indexColWidth: number;
  getColumnPinPosition: (columnId: string) => "left" | "right" | null;
  // row
  getRowId: (row: TRowData) => TRowId;
  toggleRowSelection: (rowId: TRowId) => void;
  isRowSelected: (rowId: TRowId) => boolean;
  getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;
  onRowResizeStart: (
    e: React.MouseEvent,
    rowId: TRowId,
    currentHeight: number
  ) => void;
  rowSelectionEnabled: boolean;
  enableRowResizing: boolean;
  // styles
  pinnedLeftStyle: React.CSSProperties;
  pinnedRightStyle: React.CSSProperties;
};

const DataRowComponent = <
  TRowData,
  TValue,
  TRowId extends string | number = string | number,
>({
  rowData,
  height,
  virtualIndex = 0,
  globalIndex,
  // column
  visibleColumns,
  getColumnWidth,
  indexColWidth,
  getColumnPinPosition,
  // row
  getRowId,
  toggleRowSelection,
  isRowSelected,
  getRowStyle,
  onRowResizeStart,
  rowSelectionEnabled,
  enableRowResizing,
  // styles
  pinnedLeftStyle,
  pinnedRightStyle,
}: DataRowProps<TRowData, TRowId>) => {
  const theme = useTheme();
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const rowId = getRowId(rowData);

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
  }, [cellStyle, theme.palette.background.paper, theme.palette.primary.main]);

  // Check if this row is selected

  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent) => {
      onRowResizeStart(e, rowId, height);
      e.preventDefault();
    },
    [height, onRowResizeStart, rowId]
  );

  const handleRowSelectionChange = React.useCallback(() => {
    if (!toggleRowSelection) return;
    toggleRowSelection(rowId);
  }, [rowId, toggleRowSelection]);

  const backgroundColor = React.useMemo(() => {
    if (isRowSelected(rowId)) {
      return theme.palette.action.selected;
    }
    return virtualIndex % 2 === 0
      ? theme.palette.customTable.evenRow
      : theme.palette.customTable.oddRow;
  }, [
    isRowSelected,
    rowId,
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
        <td
          style={{
            ...cellStyle,
            padding: 0,
            width: TABLE_CHECKBOX_CONTAINER_SIZE,
            minWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
            maxWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
          }}
        >
          <Box
            sx={{
              height: height - 2,
              display: "flex",
              alignItems: "center",
              paddingInline: "8px",
              width: TABLE_CHECKBOX_CONTAINER_SIZE,
              minWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
            }}
          >
            <Checkbox
              checked={isRowSelected(rowId)}
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

      {visibleColumns.map(column => {
        return (
          <DataCell<TRowData, TValue, TRowId>
            key={column.id}
            column={column}
            row={rowData}
            rowId={rowId}
            cellStyle={cellStyle}
            cellEditingStyle={cellEditingStyle}
            getColumnPinPosition={getColumnPinPosition}
            getColumnWidth={getColumnWidth}
            pinnedLeftStyle={pinnedLeftStyle}
            pinnedRightStyle={pinnedRightStyle}
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
};

DataRowComponent.displayName = "DataRowComponent";

export const DataRow = React.memo(DataRowComponent) as typeof DataRowComponent;

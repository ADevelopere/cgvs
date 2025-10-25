import React from "react";
import { CircularProgress, Box } from "@mui/material";
import {
  useTableRowsContext,
  useTableContext,
  useTableColumnContext,
} from "../contexts";
import { DataRow } from "../components/";
import { PageInfo } from "@/client/graphql/generated/gql/graphql";

const loadingRowHeight = 80;

interface TableBodyProps<
  TRowData,
> {
  data: TRowData[];
  isPaginated?: boolean;
  pageInfo?: PageInfo | null;
  indexColWidth: number;
  colSpan: number;
}

export const TableBody = <
  TRowData,
  TValue,
  TRowId extends string | number = string | number,
>({
  data,
  isPaginated = false,
  pageInfo,
  indexColWidth,
  colSpan,
}: TableBodyProps<TRowData>) => {
  const { isLoading } = useTableContext<TRowData, TRowId>();

  const {
    rowSelectionEnabled,
    getRowStyle,
    rowHeights,
    resizeRowHeight,
    getRowId,
    selectedRowIds,
    toggleRowSelection,
    enableRowResizing,
  } = useTableRowsContext<TRowData, TRowId>();
  const {
    visibleColumns,
    pinnedColumns,
    columnWidths,
    pinnedLeftStyle,
    pinnedRightStyle,
  } = useTableColumnContext<TRowData, TRowId>();

  // Note: edit state now managed internally by DataCell
  // const { _getEditingState, _setEditingState } = useTableDataContext();

  const isRowSelected = React.useCallback(
    (rowId: TRowId) => {
      return rowSelectionEnabled && selectedRowIds.includes(rowId);
    },
    [rowSelectionEnabled, selectedRowIds]
  );

  const getColumnPinPosition = React.useCallback(
    (columnId: string): "left" | "right" | null => {
      const pin = pinnedColumns[columnId];
      if (pin === "left" || pin === "right") return pin;
      return null;
    },
    [pinnedColumns]
  );

  const getColumnWidth = React.useCallback(
    (columnId: string): number | undefined => {
      return columnWidths[columnId];
    },
    [columnWidths]
  );

  const [resizingRow, setResizingRow] = React.useState<{
    rowId: TRowId;
    startY: number;
    startHeight: number;
  } | null>(null);

  const handleRowResizeStart = React.useCallback(
    (e: React.MouseEvent, rowId: TRowId, currentHeight: number) => {
      setResizingRow({
        rowId: rowId,
        startY: e.clientY,
        startHeight: currentHeight,
      });
    },
    []
  );

  React.useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!resizingRow) return;

      const deltaY = e.clientY - resizingRow.startY;
      const newHeight = resizingRow.startHeight + deltaY;

      requestAnimationFrame(() => {
        // Assuming resizeRowHeight and onRowResize are available in this component's scope
        // You might need to adjust how you access them based on your actual code
        resizeRowHeight(resizingRow.rowId, newHeight);
      });
    };

    const handleResizeEnd = () => {
      setResizingRow(null);
    };

    if (resizingRow) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.classList.add("resizing");
    } else {
      document.body.classList.remove("resizing");
    }

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
      document.body.classList.remove("resizing");
    };
  }, [resizingRow, resizeRowHeight]);

  // If there's no data, Table.tsx will render the message.
  if (data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((item, index) => {
        const rowId = getRowId(item);
        const globalIndex =
          pageInfo?.firstItem != null
            ? pageInfo.firstItem + index
            : pageInfo?.perPage && pageInfo?.currentPage
              ? (pageInfo.currentPage - 1) * pageInfo.perPage + index + 1
              : index + 1;

        return (
          <DataRow<TRowData, TValue, TRowId>
            key={rowId}
            rowData={item}
            height={rowHeights[rowId] || 50}
            virtualIndex={index}
            globalIndex={globalIndex}
            //column
            visibleColumns={visibleColumns}
            getColumnWidth={getColumnWidth}
            indexColWidth={indexColWidth}
            getColumnPinPosition={getColumnPinPosition}
            // row
            getRowId={getRowId}
            toggleRowSelection={toggleRowSelection}
            isRowSelected={isRowSelected}
            getRowStyle={getRowStyle}
            onRowResizeStart={handleRowResizeStart}
            rowSelectionEnabled={rowSelectionEnabled}
            enableRowResizing={enableRowResizing}
            // styles
            pinnedLeftStyle={pinnedLeftStyle}
            pinnedRightStyle={pinnedRightStyle}
          />
        );
      })}

      {/* Loading indicator for infinite scroll */}
      {isLoading && !isPaginated && (
        <tr style={{ height: `${loadingRowHeight}px` }}>
          <td colSpan={colSpan}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress size={30} style={{ marginRight: 10 }} />
            </Box>
          </td>
        </tr>
      )}
    </>
  );
};

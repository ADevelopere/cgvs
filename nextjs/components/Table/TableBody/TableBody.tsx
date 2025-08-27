import React from "react";
import { CircularProgress, Box } from "@mui/material";
import DataRow from "./DataRow";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableContext } from "../Table/TableContext";
import { PaginationInfo } from "@/graphql/generated/types";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableDataContext } from "../Table/TableDataContext";

const loadingRowHeight = 80;
interface TableBodyProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    isPaginated?: boolean;
    paginationInfo?: PaginationInfo | null;
    indexColWidth: number;
    colSpan: number;
}

const TableBody: React.FC<TableBodyProps> = ({
    data,
    isPaginated = false,
    paginationInfo,
    indexColWidth,
    colSpan,
}) => {
    const { isLoading } = useTableContext();

    const {
        rowSelectionEnabled,
        getRowStyle,
        rowHeights,
        resizeRowHeight,
        rowIdKey,
        selectedRowIds,
        toggleRowSelection,
        enableRowResizing,
    } = useTableRowsContext();
    const {
        visibleColumns,
        pinnedColumns,
        columnWidths,
        pinnedLeftStyle,
        pinnedRightStyle,
    } = useTableColumnContext();

    const { getEditingState, setEditingState } = useTableDataContext();

    const isRowSelected = React.useCallback(
        (rowId: string | number) => {
            return rowSelectionEnabled && selectedRowIds.includes(rowId);
        },
        [rowSelectionEnabled, selectedRowIds],
    );

    const getColumnPinPosition = React.useCallback(
        (columnId: string): "left" | "right" | null => {
            const pin = pinnedColumns[columnId];
            if (pin === "left" || pin === "right") return pin;
            return null;
        },
        [pinnedColumns],
    );

    const getColumnWidth = React.useCallback(
        (columnId: string): number | undefined => {
            return columnWidths[columnId];
        },
        [columnWidths],
    );

    // If there's no data, Table.tsx will render the message.
    if (data.length === 0) {
        return null;
    }

    return (
        <>
            {data.map((item, index) => {
                const globalIndex =
                    paginationInfo?.firstItem != null
                        ? paginationInfo.firstItem + index
                        : paginationInfo?.perPage && paginationInfo?.currentPage
                          ? (paginationInfo.currentPage - 1) *
                                paginationInfo.perPage +
                            index +
                            1
                          : index + 1;

                return (
                    <DataRow
                        key={item.id}
                        rowData={item}
                        height={rowHeights[item.id] || 50}
                        virtualIndex={index}
                        globalIndex={globalIndex}
                        getEditingState={getEditingState}
                        setEditingState={setEditingState}
                        //column
                        visibleColumns={visibleColumns}
                        getColumnWidth={getColumnWidth}
                        indexColWidth={indexColWidth}
                        getColumnPinPosition={getColumnPinPosition}
                        // row
                        rowIdKey={rowIdKey}
                        resizeRowHeight={resizeRowHeight}
                        toggleRowSelection={toggleRowSelection}
                        isRowSelected={isRowSelected}
                        getRowStyle={getRowStyle}
                        onRowResize={(rowId, newHeight) => {
                            resizeRowHeight(rowId, newHeight);
                        }}
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
                            <CircularProgress
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                        </Box>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableBody;

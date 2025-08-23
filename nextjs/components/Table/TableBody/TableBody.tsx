import type React from "react";
import { CircularProgress, Box } from "@mui/material";
import DataRow from "./DataRow";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableContext } from "../Table/TableContext";
import { PaginationInfo } from "@/graphql/generated/types";

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
    const { rowHeights, resizeRowHeight } = useTableRowsContext();

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
                        onRowResize={(rowId, newHeight) => {
                            resizeRowHeight(rowId, newHeight);
                        }}
                        virtualIndex={index}
                        globalIndex={globalIndex} // Ensure type compatibility
                        indexColWidth={indexColWidth} // Pass indexColWidth to DataRow
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

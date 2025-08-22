import type React from "react";
import { useCallback } from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";
import DataRow from "./DataRow";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableContext } from "../Table/TableContext";
import { PaginationInfo } from "@/graphql/generated/types";

interface NewTableBodyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  height: number;
  width: number;
  isPaginated?: boolean;
  paginationInfo?: PaginationInfo | null;
  indexColWidth: number; // Add indexColWidth prop
}

const TableBody: React.FC<NewTableBodyProps> = ({
  data,
  height,
  width,
  isPaginated = false,
  paginationInfo,
  indexColWidth,
}) => {
  const { isLoading } = useTableContext();
  const {
    rowHeights,
    loadMoreRowsIfNeeded,
    resizeRowHeight,
  } = useTableRowsContext();
  const theme = useTheme();

  const loadingRowHeight = 80;

  // Handle scroll to load more data
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const scrolledToBottom = 
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;

    if (scrolledToBottom && loadMoreRowsIfNeeded && !isPaginated) {
      loadMoreRowsIfNeeded(data.length - 50, data.length);
    }
  }, [data.length, loadMoreRowsIfNeeded, isPaginated]);

  // If there's no data and we're not loading, show a message
  if (data.length === 0 && !isLoading) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div
      className="table-body"
      style={{
        height: '100%',
        width: width,
        overflowX: "visible",
        overflowY: "auto",
        direction: theme.direction,
      }}
      onScroll={handleScroll}
    >
      {data.map((item, index) => {
        const globalIndex = paginationInfo?.firstItem != null
          ? paginationInfo.firstItem + index
          : (paginationInfo?.perPage && paginationInfo?.currentPage
              ? (paginationInfo.currentPage - 1) * paginationInfo.perPage + index + 1
              : index + 1);

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
        <div style={{ height: `${loadingRowHeight}px` }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress size={30} style={{ marginRight: 10 }} />
          </Box>
        </div>
      )}
    </div>
  );
};

export default TableBody;

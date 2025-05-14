import type React from "react";
import { useCallback } from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";
import DataRow from "./DataRow";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableContext } from "../Table/TableContext";

interface NewTableBodyProps {
  data: any[];
  height: number;
  width: number;
  isPaginated?: boolean;
}

const NewTableBody: React.FC<NewTableBodyProps> = ({
  data,
  height,
  width,
  isPaginated = false,
}) => {
  const {
    visibleColumns: columns,
    columnWidths,
    pinnedLeftStyle,
    pinnedRightStyle,
    pinnedColumns,
  } = useTableColumnContext();
  const { isLoading } = useTableContext();
  const {
    getRowStyle,
    rowHeights,
    rowSelectionEnabled,
    selectedRowIds,
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
      {data.map((item, index) => (
        <DataRow
          key={item.id}
          rowData={item}
          height={rowHeights[item.id] || 50}
          width={width - 20}
          onRowResize={(rowId, newHeight) => {
            resizeRowHeight(rowId, newHeight);
          }}
          virtualIndex={index}
        />
      ))}

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
            Loading more rows...
          </Box>
        </div>
      )}
    </div>
  );
};

export default NewTableBody;

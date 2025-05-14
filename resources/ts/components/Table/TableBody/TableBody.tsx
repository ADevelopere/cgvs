// import type React from "react";
// import { useRef, useCallback, useEffect } from "react";
// import { VariableSizeList as List } from "react-window";
// import { CircularProgress, Box, useTheme } from "@mui/material";
// import DataRow from "./DataRow";
// import { useTableColumnContext } from "../Table/TableColumnContext";
// import { useTableRowsContext } from "../Table/TableRowsContext";
// import { useTableContext } from "../Table/TableContext";

// interface TableBodyProps {
//   data: any[];
//   height: number;
//   width: number;
//   isPaginated?: boolean;
// }

// const TableBody: React.FC<TableBodyProps> = ({
//   data,
//   height,
//   width,
//   isPaginated = false,
//   // Selection props
// }) => {
//   const {
//     visibleColumns: columns,
//     columnWidths,
//     pinnedLeftStyle,
//     pinnedRightStyle,
//     pinnedColumns,
//   } = useTableColumnContext();
//   const { isLoading } = useTableContext();
//   const {
//     getRowStyle,
//     rowHeights,
//     rowSelectionEnabled,
//     selectedRowIds,
//     loadMoreRowsIfNeeded,
//     resizeRowHeight,
//   } = useTableRowsContext();
//   const theme = useTheme();

//   const listRef = useRef<List>(null);
//   const loadingRowHeight = 80; // Height for the loading indicator row

//   // Get row height for virtualization
//   const getRowHeight = useCallback(
//     (index: number) => {
//       // If this is a loading indicator row
//       if (index === data.length && isLoading && !isPaginated) {
//         return loadingRowHeight;
//       }

//       // Regular data row
//       const item = data[index];
//       return item && rowHeights[item.id] ? rowHeights[item.id] : 50;
//     },
//     [data, rowHeights, isLoading, isPaginated]
//   );

//   // Handle rows being rendered - used to trigger loading more rows
//   const handleRowsRendered = useCallback(
//     ({
//       visibleStartIndex,
//       visibleStopIndex,
//     }: {
//       visibleStartIndex: number;
//       visibleStopIndex: number;
//     }) => {
//       if (
//         loadMoreRowsIfNeeded
//         // && !isPaginated
//       ) {
//         loadMoreRowsIfNeeded(visibleStartIndex, visibleStopIndex);
//       }
//     },
//     [loadMoreRowsIfNeeded, isPaginated]
//   );

//   // Reset list when data changes
//   useEffect(() => {
//     if (listRef.current) {
//       listRef.current.resetAfterIndex(0);

//       // Scroll to top when page changes (for pagination)
//       if (isPaginated) {
//         listRef.current.scrollTo(0);
//       }
//     }
//   }, [data, isPaginated]);

//   // Row renderer for virtualization
//   const rowRenderer = useCallback(
//     ({ index, style }: { index: number; style: React.CSSProperties }) => {
//       // Render loading indicator if we're at the end of the loaded data and loading more
//       // Only show this for infinite scroll (non-paginated) mode
//       if (index === data.length && isLoading && !isPaginated) {
//         return (
//           <tr style={{ height: `${loadingRowHeight}px` }}>
//             <td
//               colSpan={
//                 rowSelectionEnabled ? columns.length + 1 : columns.length
//               }
//               style={{ textAlign: "center" }}
//             >
//               <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 height="100%"
//               >
//                 <CircularProgress size={30} style={{ marginRight: 10 }} />
//                 Loading more rows...
//               </Box>
//             </td>
//           </tr>
//         );
//       }

//       // Don't render anything if we're beyond the data we have
//       if (index >= data.length) {
//         return null;
//       }

//       const item = data[index];
//       if (!item) return null;

//       return (
//         <div
//           style={{
//             ...style,
//             direction: theme.direction,
//             overflow: "hidden",
//           }}
//         >
//           <DataRow
//             key={item.id}
//             rowData={item}
//             height={rowHeights[item.id] || 50}
//             width={width - 20}
//             onRowResize={(rowId, newHeight) => {
//               // Update the virtualized list when row height changes
//               if (listRef.current) {
//                 listRef.current.resetAfterIndex(index);
//               }
//             }}
//             virtualIndex={index}
//           />
//         </div>
//       );
//     },
//     [
//       columns,
//       columnWidths,
//       data,
//       rowHeights,
//       resizeRowHeight,
//       width,
//       isLoading,
//       loadingRowHeight,
//       pinnedColumns,
//       pinnedLeftStyle,
//       pinnedRightStyle,
//       getRowStyle,
//       isPaginated,
//       // Add selection props to dependencies
//       rowSelectionEnabled,
//       selectedRowIds,
//     ]
//   );

//   // Calculate the total number of items to render
//   // For pagination: just the items on the current page
//   // For infinite scroll: items + loading indicator if needed
//   let nonPaginatedCount = data.length;
//   if (isLoading) {
//     nonPaginatedCount = data.length + 1;
//   }
//   const itemCount = isPaginated ? data.length : nonPaginatedCount;

//   // If there's no data and we're not loading, show a message
//   if (data.length === 0 && !isLoading) {
//     return (
//       <div
//         style={{
//           width,
//           height,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <p>No data available</p>
//       </div>
//     );
//   }

//   return (
//     <List
//       ref={listRef}
//       height={1000}
//       width={width}
//       itemCount={itemCount}
//       itemSize={getRowHeight}
//       overscanCount={50}
//       onItemsRendered={({ visibleStartIndex, visibleStopIndex }) =>
//         handleRowsRendered({ visibleStartIndex, visibleStopIndex })
//       }
//       className="table-body"
//       style={{
//         // hide scrollbar
//         overflowX: "visible",
//         overflowY: "auto",
//         direction: theme.direction,
//         // msOverflowStyle: "-ms-autohiding-scrollbar", // IE and Edge
//         // scrollbarWidth: "thin", // Firefox
//         // scrollbarGutter: "stable"
//       }}
//     >
//       {rowRenderer}
//     </List>
//   );
// };

// export default TableBody;

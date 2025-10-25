"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";
import { ColumnVisibilityPanel } from "../components";
import {
  useTableContext,
  useTableColumnContext,
  useTableRowsContext,
  useTableLocale,
} from "../contexts";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "../constants";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableFooter } from "./TableFooter";

export interface TableProviderProps {
  style?: React.CSSProperties;
  creationRow?: React.ReactNode;
}

export const Table = <
  TRowData,
  TValue,
  TRowId extends string | number = string | number,
  TColumnId extends string = string,
>({
  style,
  creationRow,
}: TableProviderProps) => {
  const { strings } = useTableLocale();
  const { pageInfo, data, isLoading, hideRowsPerPage, compact } =
    useTableContext<TRowData, TColumnId>();
  const { visibleColumns, columnWidths } = useTableColumnContext<
    TRowData,
    TColumnId
  >();
  const { rowSelectionEnabled } = useTableRowsContext<TRowData, TRowId>();

  const theme = useTheme();
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);

  const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);

  // Reset scroll position when page changes
  useEffect(() => {
    if (tableScrollContainerRef.current) {
      tableScrollContainerRef.current.scrollTop = 0;
    }
  }, [pageInfo?.currentPage]);

  // Calculate the index column width dynamically based on the maximum index value
  const maxIndexValue = useMemo(() => {
    return pageInfo ? pageInfo.total : data.length;
  }, [pageInfo, data.length]);

  const indexColWidth = useMemo(() => {
    const maxDigits = maxIndexValue?.toString().length;
    return Math.max(50, maxDigits * 15 + 20); // Minimum width of 50px, 10px per digit, and 20px padding
  }, [maxIndexValue]);

  // Get the total width of the table
  const totalWidth = useMemo(() => {
    const columnsWidth = visibleColumns.reduce(
      (sum, column) => sum + (columnWidths[column.id] || 0),
      0
    );
    return (
      columnsWidth +
      indexColWidth +
      (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0)
    );
  }, [visibleColumns, columnWidths, rowSelectionEnabled, indexColWidth]);

  const colSpan = useMemo(() => {
    return visibleColumns.length + 1 + (rowSelectionEnabled ? 1 : 0);
  }, [visibleColumns, rowSelectionEnabled]);

  return (
    <div
      style={{
        borderRadius: theme.shape.borderRadius,
        position: "relative" as const,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ...style,
      }}
      id="table-container"
    >
      {/* Loading indicator */}
      {isLoading && (
        <LinearProgress
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
          }}
        />
      )}

      {/* Single scrollable container with sticky header */}
      <div
        ref={tableScrollContainerRef}
        style={{
          width: "100%",
          overflowY: "auto",
          overflowX: "auto",
          position: "relative" as const,
          flexGrow: 1,
        }}
      >
        <table
          style={{
            borderCollapse: "collapse" as const,
            tableLayout: "fixed" as const,
            backgroundColor: theme.palette.background.paper,
            width: totalWidth,
          }}
        >
          <colgroup>
            <col
              style={{
                width: indexColWidth,
                maxWidth: indexColWidth,
              }}
            />
            {rowSelectionEnabled && (
              <col
                style={{
                  width: TABLE_CHECKBOX_CONTAINER_SIZE,
                  maxWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
                }}
              />
            )}
            {visibleColumns.map(column => (
              <col
                key={column.id}
                style={{
                  width: `${columnWidths[column.id]}px`,
                  minWidth: `${columnWidths[column.id]}px`,
                  maxWidth: `${columnWidths[column.id]}px`,
                }}
              />
            ))}
          </colgroup>
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <TableHeader width={totalWidth} indexColWidth={indexColWidth} />
          </thead>
          <tbody
            style={{
              display: "table-row-group",
              overflowX: "hidden",
            }}
          >
            <TableBody<TRowData, TValue, TRowId>
              data={data}
              isPaginated={!!pageInfo}
              pageInfo={pageInfo}
              indexColWidth={indexColWidth}
              colSpan={colSpan}
            />
            {data.length === 0 && (
              <tr>
                <td colSpan={colSpan}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: theme.spacing(4),
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {isLoading
                      ? strings.general.loading
                      : strings.general.noData}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {creationRow}

      <div
        style={{
          maxWidth: "100%",
        }}
      >
        <TableFooter
          loadedRows={data.length}
          hideRowsPerPage={hideRowsPerPage}
          compact={compact}
        />
      </div>

      {/* Column Visibility Panel */}
      {showVisibilityPanel && (
        <ColumnVisibilityPanel onClose={() => setShowVisibilityPanel(false)} />
      )}
    </div>
  );
};

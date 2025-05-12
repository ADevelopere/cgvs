"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";
import TableHeader from "../TableHeader/TableHeader";
import TableBody from "../TableBody/TableBody";
import PaginationFooter from "../TableFooter/TableFooter";
import ColumnVisibilityPanel from "./ColumnVisibilityPanel";
import "./Table.css";
import { useTableContext } from "./TableContext";
import { useTableColumnContext } from "./TableColumnContext";
import { useTableRowsContext } from "./TableRowsContext";
import {
  TABLE_CHECKBOX_CONTAINER_SIZE,
} from "@/constants/tableConstants";
import { useTableLocale } from "@/locale/table/TableLocaleContext";
// Define column interface

// Define default row height
const DEFAULT_ROW_HEIGHT = 50;
// Define table height for virtualization
const TABLE_HEIGHT = 500;

const Table: React.FC = () => {
  const { strings } = useTableLocale();
  const { paginatorInfo, data, isLoading } = useTableContext();
  const { visibleColumns, columnWidths } = useTableColumnContext();
  const { rowSelectionEnabled } = useTableRowsContext();

  const theme = useTheme();
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const tableBodyRef = useRef<HTMLDivElement>(null);

  const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);

  // Reset scroll position when page changes
  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [paginatorInfo?.currentPage]);

  const tableContainerStyle = {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    position: "relative" as const,
  };

  const headerAndFooterContainerStyle = {
    width: "100%",
    overflow: "hidden",
    position: "relative" as const,
  };

  // Get the total width of the table
  const totalWidth = useMemo(() => {
    return visibleColumns.reduce(
      (sum, column) => sum + columnWidths[column.id],
      20 + (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0)
    );
  }, [visibleColumns, columnWidths, rowSelectionEnabled]);
  console.log("Table, total width", totalWidth);

  const tableStyle = {
    borderCollapse: "collapse" as const,
    tableLayout: "fixed" as const,
    width: totalWidth,
    minWidth: totalWidth,
    maxWidth: totalWidth,
  };

  // Synchronize horizontal scroll between header, body, and footer
  useEffect(() => {
    const bodyContainer = tableBodyRef.current;
    const headerContainer = document.getElementById("header-container");
    const footerContainer = document.getElementById("footer-container");

    if (!bodyContainer || !headerContainer || !footerContainer) return;

    const handleScroll = () => {
      headerContainer.scrollLeft = bodyContainer.scrollLeft;
      footerContainer.scrollLeft = bodyContainer.scrollLeft;
    };

    bodyContainer.addEventListener("scroll", handleScroll);
    return () => {
      bodyContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to toggle visibility panel
  const handleToggleVisibilityPanel = () => {
    setShowVisibilityPanel((prev) => !prev);
  };

  return (
    <div style={tableContainerStyle}>
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

      <div style={{ ...headerAndFooterContainerStyle, overflowX: "auto" }}>
        <table
          style={{
            ...tableStyle,
            backgroundColor: theme.palette.background.paper,
          }}
          ref={tableContainerRef}
        >
          <colgroup>
            {rowSelectionEnabled && (
              <col
                style={{
                  width: TABLE_CHECKBOX_CONTAINER_SIZE,
                  maxWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
                }}
              />
            )}
            {visibleColumns.map((column) => (
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
          <thead>
            <TableHeader width={totalWidth} />
          </thead>
          <tbody>
            <TableBody
              data={data}
              height={TABLE_HEIGHT}
              width={totalWidth}
              isPaginated={!!paginatorInfo}
            />
          </tbody>
          <div style={{ opacity: isLoading ? 0.6 : 1 }} ref={tableBodyRef}>
            {data.length === 0 && (
              <div style={{ textAlign: "center", padding: theme.spacing(4) }}>
                {isLoading ? strings.general.loading : strings.general.noData}
              </div>
            )}
          </div>
        </table>
      </div>

      <div
        style={{
          maxWidth: totalWidth,
        }}
      >
        <PaginationFooter loadedRows={data.length} />
      </div>

      {/* Column Visibility Panel */}
      {showVisibilityPanel && (
        <ColumnVisibilityPanel onClose={() => setShowVisibilityPanel(false)} />
      )}
    </div>
  );
};

export default Table;

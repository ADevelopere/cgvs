"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { LinearProgress } from "@mui/material";
import TableHeader from "../TableHeader/TableHeader";
import PaginationFooter from "../TableFooter/TableFooter";
import ColumnVisibilityPanel from "./ColumnVisibilityPanel";
import { useTableContext } from "./TableContext";
import { useTableColumnContext } from "./TableColumnContext";
import { useTableRowsContext } from "./TableRowsContext";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "@/constants/tableConstants";
import { useTableLocale } from "@/locale/table/TableLocaleContext";
import TableBody from "../TableBody/TableBody";
// Define column interface

const Table: React.FC<{
    style?: React.CSSProperties;
    creationRow?: React.ReactNode;
}> = ({ style, creationRow }) => {
    const { strings } = useTableLocale();
    const {
        paginationInfo: paginatorInfo,
        data,
        isLoading,
    } = useTableContext();
    const { visibleColumns, columnWidths } = useTableColumnContext();
    const { rowSelectionEnabled } = useTableRowsContext();

    const theme = useTheme();
    const headerContainerRef = useRef<HTMLDivElement>(null);
    // const tableBodyRef = useRef<HTMLDivElement>(null); // This ref was for the "no data" message div
    const tableScrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the main scrollable div

    const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);

    // // Reset scroll position when page changes
    // useEffect(() => {
    //     if (tableBodyRef.current) {
    //         tableBodyRef.current.scrollTop = 0;
    //     }
    // }, [paginatorInfo?.currentPage]);

    // Reset scroll position when page changes
    useEffect(() => {
        // This was for tableBodyRef, if react-window's list needs scroll reset, it's handled in TableBody.tsx
        // If the main scroll container needs reset, you can do it here:
        // if (tableScrollContainerRef.current) {
        //     tableScrollContainerRef.current.scrollTop = 0;
        // }
    }, [paginatorInfo?.currentPage]);

    // Calculate the index column width dynamically based on the maximum index value
    const maxIndexValue = useMemo(() => {
        return paginatorInfo ? paginatorInfo.total : data.length;
    }, [paginatorInfo, data.length]);

    const indexColWidth = useMemo(() => {
        const maxDigits = maxIndexValue.toString().length;
        return Math.max(50, maxDigits * 15 + 20); // Minimum width of 50px, 10px per digit, and 20px padding
    }, [maxIndexValue]);

    // Get the total width of the table
    const totalWidth = useMemo(() => {
        const columnsWidth = visibleColumns.reduce(
            (sum, column) => sum + (columnWidths[column.id] || 0),
            0,
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

    // Synchronize horizontal scroll between header and body
    useEffect(() => {
        const scrollContainer = tableScrollContainerRef.current;
        const headerElement = headerContainerRef.current;
        // const footerElement = document.getElementById("footer-container"); // If footer also needs sync

        if (!scrollContainer || !headerElement) return;

        const handleScroll = () => {
            if (headerElement) {
                headerElement.scrollLeft = scrollContainer.scrollLeft;
            }
            // if (footerElement) {
            //     footerElement.scrollLeft = scrollContainer.scrollLeft;
            // }
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);

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

            <div
                id="header-container"
                ref={headerContainerRef}
                style={{ overflow: "hidden", flexShrink: 0 }}
            >
                <table
                    style={{
                        borderCollapse: "collapse" as const,
                        tableLayout: "fixed" as const,
                        backgroundColor: "transparent",
                        width: totalWidth,
                    }}
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
                        <col
                            style={{
                                width: indexColWidth,
                                maxWidth: indexColWidth,
                            }}
                        />
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
                        <TableHeader
                            width={totalWidth}
                            indexColWidth={indexColWidth}
                        />
                    </thead>
                </table>
            </div>
            <div
                ref={tableScrollContainerRef}
                style={{
                    width: "100%",
                    overflowY: "auto",
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
                        {rowSelectionEnabled && (
                            <col
                                style={{
                                    width: TABLE_CHECKBOX_CONTAINER_SIZE,
                                    maxWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
                                }}
                            />
                        )}
                        <col
                            style={{
                                width: indexColWidth,
                                maxWidth: indexColWidth,
                            }}
                        />
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
                    <tbody
                        style={{
                            display: "table-row-group",
                            overflowX: "hidden",
                        }}
                    >
                        <TableBody
                            data={data}
                            isPaginated={!!paginatorInfo}
                            paginationInfo={paginatorInfo}
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
                <PaginationFooter loadedRows={data.length} />
            </div>

            {/* Column Visibility Panel */}
            {showVisibilityPanel && (
                <ColumnVisibilityPanel
                    onClose={() => setShowVisibilityPanel(false)}
                />
            )}
        </div>
    );
};

export default Table;

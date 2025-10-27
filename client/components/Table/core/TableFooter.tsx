import { useTheme } from "@mui/material/styles";
import { CircularProgress, TablePagination } from "@mui/material";
import type React from "react";
import { useCallback, useMemo } from "react";
import {
  useTableLocale,
  useTableColumnContext,
  useTableContext,
  useTableRowsContext,
} from "../contexts";

interface TableFooterProps {
  loadedRows?: number;
  hideRowsPerPage?: boolean;
  compact?: boolean;
}

export const TableFooter: React.FC<TableFooterProps> = ({
  loadedRows = 0,
  hideRowsPerPage = false,
  compact = false,
}) => {
  const theme = useTheme();
  const { strings } = useTableLocale();

  const { pageInfo, footerStartContent, footerEndContent } = useTableContext();

  const {
    totalRows = 0,
    rowSelectionEnabled,
    selectedRowIds,
  } = useTableRowsContext();

  const { visibleColumns } = useTableColumnContext();

  const { isLoading, onPageChange, onRowsPerPageChange, rowsPerPageOptions } =
    useTableContext();

  // Handle page change (MUI uses 0-indexed pages, our API uses 1-indexed)
  const handlePageChange = useCallback(
    (_event: unknown, newPage: number) => {
      if (onPageChange) {
        onPageChange(newPage + 1);
      }
    },
    [onPageChange]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onRowsPerPageChange) {
        onRowsPerPageChange(Number.parseInt(event.target.value, 10));
      }
    },
    [onRowsPerPageChange]
  );

  const tfStyle = useMemo(
    () => ({
      padding: theme.spacing(2),
      textAlign: "left" as const,
      borderTop: `2px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    }),
    [theme]
  );

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: { from: number; to: number; count: number }) => {
      if (compact) return "";
      return strings.pagination.displayedRows(
        from,
        to,
        typeof count === "number" ? count : to
      );
    },
    [strings, compact]
  );

  const getItemAriaLabel = useCallback(
    (type: "first" | "last" | "next" | "previous") => {
      switch (type) {
        case "first":
          return strings.pagination.firstPage;
        case "last":
          return strings.pagination.lastPage;
        case "next":
          return strings.pagination.nextPage;
        case "previous":
          return strings.pagination.previousPage;
        default:
          return "";
      }
    },
    [strings]
  );

  // When in compact mode and loading, render only a centered spinner to avoid layout shifts
  if (compact && isLoading) {
    return (
      <div style={tfStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: theme.spacing(1),
            minHeight: 36,
          }}
        >
          <CircularProgress size={16} />
        </div>
      </div>
    );
  }

  return (
    <div style={tfStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: theme.spacing(2),
        }}
      >
        {/* Start content (left side) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
          }}
        >
          {footerStartContent}
        </div>

        {/* Middle content - pagination or status */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {pageInfo ? (
            // Render pagination controls when pageInfo is provided
            <TablePagination
              component="div"
              count={pageInfo.total}
              page={pageInfo.currentPage - 1} // Convert 1-indexed to 0-indexed
              rowsPerPage={pageInfo.perPage}
              rowsPerPageOptions={hideRowsPerPage ? [] : rowsPerPageOptions}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage={
                hideRowsPerPage ? "" : strings.pagination.rowsPerPage
              }
              labelDisplayedRows={labelDisplayedRows}
              getItemAriaLabel={getItemAriaLabel}
              sx={
                compact
                  ? {
                      "& .MuiTablePagination-toolbar": {
                        minHeight: 36,
                        gap: 0.5,
                        paddingInlineStart: 0,
                        paddingInlineEnd: 0,
                      },
                      "& .MuiInputBase-root": {
                        fontSize: 12,
                      },
                      "& .MuiTablePagination-actions": {
                        marginInlineStart: 0,
                      },
                      "& .MuiTablePagination-displayedRows": {
                        display: "none",
                      },
                    }
                  : undefined
              }
            />
          ) : (
            // Render standard footer when not using pagination
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span>
                {rowSelectionEnabled && selectedRowIds.length > 0 ? (
                  <strong style={{ color: theme.palette.primary.main }}>
                    {strings.selection.rowsSelected(selectedRowIds.length)}
                  </strong>
                ) : (
                  `${loadedRows} ${strings.general.of} ${totalRows} ${strings.general.rowsOf} | ${visibleColumns.length} ${strings.general.columnsVisible}`
                )}
              </span>
              <span>
                {isLoading && (
                  <>
                    <CircularProgress
                      size={16}
                      style={{ marginInlineEnd: 8, verticalAlign: "middle" }}
                    />
                    {strings.general.loading}
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* End content (right side) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
          }}
        >
          {footerEndContent}
        </div>
      </div>
    </div>
  );
};

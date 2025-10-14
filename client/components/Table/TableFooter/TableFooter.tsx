import { useTheme } from "@mui/material/styles";
import { CircularProgress, TablePagination } from "@mui/material";
import type React from "react";
import { useCallback, useMemo } from "react";
import { useTableLocale } from "@/client/locale/table/TableLocaleContext";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableContext } from "../Table/TableContext";
import { useTableRowsContext } from "../Table/TableRowsContext";

interface TableFooterProps {
  loadedRows?: number;
}

const PaginationFooter: React.FC<TableFooterProps> = ({ loadedRows = 0 }) => {
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
    [onPageChange],
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onRowsPerPageChange) {
        onRowsPerPageChange(Number.parseInt(event.target.value, 10));
      }
    },
    [onRowsPerPageChange],
  );

  const tfStyle = useMemo(
    () => ({
      padding: theme.spacing(2),
      textAlign: "left" as const,
      borderTop: `2px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    }),
    [theme],
  );

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: { from: number; to: number; count: number }) =>
      strings.pagination.displayedRows(
        from,
        to,
        typeof count === "number" ? count : to,
      ),
    [strings],
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
    [strings],
  );

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
              rowsPerPageOptions={rowsPerPageOptions}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              labelRowsPerPage={strings.pagination.rowsPerPage}
              labelDisplayedRows={labelDisplayedRows}
              getItemAriaLabel={getItemAriaLabel}
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
                      style={{ marginRight: 8, verticalAlign: "middle" }}
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

export default PaginationFooter;

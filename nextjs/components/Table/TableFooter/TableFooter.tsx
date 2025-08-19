import type React from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, TablePagination } from "@mui/material";
import { useTableContext } from "../Table/TableContext";
import { useTableRowsContext } from "../Table/TableRowsContext";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableLocale } from "@/locale/table/TableLocaleContext";

interface TableFooterProps {
  loadedRows?: number;
}

const PaginationFooter: React.FC<TableFooterProps> = ({ loadedRows = 0 }) => {
  const theme = useTheme();
  const { strings } = useTableLocale();

  const { paginationInfo: paginatorInfo } = useTableContext();

  const {
    totalRows = 0,
    rowSelectionEnabled,
    selectedRowIds,
  } = useTableRowsContext();

  const { visibleColumns } = useTableColumnContext();

  const { isLoading, onPageChange, onRowsPerPageChange, rowsPerPageOptions } =
    useTableContext();

  // Handle page change (MUI uses 0-indexed pages, our API uses 1-indexed)
  const handlePageChange = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage + 1);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(Number.parseInt(event.target.value, 10));
    }
  };
  const tfStyle = {
    padding: theme.spacing(2),
    textAlign: "left" as const,
    borderTop: `2px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  };

  return (
    <div style={tfStyle}>
      {paginatorInfo ? (
        // Render pagination controls when paginatorInfo is provided
        <TablePagination
          component="div"
          count={paginatorInfo.total}
          page={paginatorInfo.currentPage - 1} // Convert 1-indexed to 0-indexed
          rowsPerPage={paginatorInfo.perPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage={strings.pagination.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            strings.pagination.displayedRows(
              from,
              to,
              typeof count === "number" ? count : to
            )
          }
          getItemAriaLabel={(type) => {
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
          }}
        />
      ) : (
        // Render standard footer when not using pagination
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <span>
            {rowSelectionEnabled && selectedRowIds.length > 0 ? (
              <strong style={{ color: theme.palette.primary.main }}>
                `${selectedRowIds.length} $
                {selectedRowIds.length === 1 ? "row" : "rows"} selected`
              </strong>
            ) : (
              `${visibleColumns.length} visibleColumns`
            )}
          </span> */}
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
  );
};

export default PaginationFooter;

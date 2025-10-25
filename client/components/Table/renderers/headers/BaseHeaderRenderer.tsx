import React, { useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Tooltip, Badge } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  UnfoldMore,
  FilterList,
} from "@mui/icons-material";
import { OrderSortDirection } from "@/client/graphql/generated/gql/graphql";

/**
 * Props for BaseHeaderRenderer
 */
export type BaseHeaderRendererProps = {
  /** Label to display (can be string or React component) */
  label: React.ReactNode;

  /** Sortable */
  sortable?: boolean;

  /** Filterable */
  filterable?: boolean;

  /** Callback when sort button is clicked */
  onSort?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Function that renders the filter popover with anchor element and close handler */
  filterPopoverRenderer?: (
    anchorEl: HTMLElement | null,
    onClose: () => void
  ) => React.ReactNode;

  /** Current sort direction */
  sortDirection?: OrderSortDirection | null;

  /** Whether the column is currently filtered */
  isFiltered?: boolean;

  /** Tooltip text for sort button */
  sortTooltip?: string;

  /** Tooltip text for filter button */
  filterTooltip?: string;
};

// Styled Components
const HeaderContent = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  overflow: "hidden",
  padding: 0,
  gap: 1,
});

const ColumnLabel = styled("span")({
  flexGrow: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 500,
  fontSize: "0.875rem",
});

const IconsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  gap: 8,
});

const HeaderIconButton = styled(IconButton)({
  padding: 0,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
});

const FilterIconButton = styled(HeaderIconButton, {
  shouldForwardProp: prop => prop !== "isFiltered",
})<{ isFiltered?: boolean }>(({ theme, isFiltered }) => ({
  color: isFiltered ? theme.palette.primary.main : "inherit",
}));

/**
 * BaseHeaderRenderer Component
 *
 * Provides a standard header layout with:
 * - Column label (truncated if too long)
 * - Sort button with direction indicators
 * - Filter button with active badge
 * - Support for custom filter popovers
 *
 * @example
 * ```tsx
 * <BaseHeaderRenderer
 *   label="Student Name"
 *   onSort={() => handleSort('name')}
 *   sortDirection="ASC"
 *   onFilter={(e) => handleFilterOpen(e)}
 *   isFiltered={!!filters.name}
 *   filterPopoverRenderer={() => (
 *     <TextFilterPopover
 *       anchorEl={filterAnchor}
 *       open={activeFilter === 'name'}
 *       onClose={handleFilterClose}
 *       value={filters.name}
 *       onChange={handleFilterChange}
 *     />
 *   )}
 * />
 * ```
 */
export const BaseHeaderRenderer = ({
  label,
  sortable = true,
  filterable = true,
  onSort,
  filterPopoverRenderer,
  sortDirection = null,
  isFiltered = false,
  sortTooltip = "Sort",
  filterTooltip = "Filter",
}: BaseHeaderRendererProps): React.ReactElement => {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const handleSortClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSort?.(e);
    },
    [onSort]
  );

  const handleFilterClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setFilterAnchor(e.currentTarget);
    },
    []
  );

  const handleFilterClose = useCallback(() => {
    setFilterAnchor(null);
  }, []);

  return (
    <HeaderContent>
      <ColumnLabel>{label}</ColumnLabel>
      <IconsContainer>
        {sortable && onSort && (
          <Tooltip title={sortTooltip}>
            <HeaderIconButton
              onClick={handleSortClick}
              aria-label={`Sort by ${label}`}
              size="small"
            >
              {sortDirection === "ASC" ? (
                <ArrowUpward fontSize="small" />
              ) : sortDirection === "DESC" ? (
                <ArrowDownward fontSize="small" />
              ) : (
                <UnfoldMore fontSize="small" />
              )}
            </HeaderIconButton>
          </Tooltip>
        )}
        {filterable && filterPopoverRenderer && (
          <>
            <Badge
              invisible={!isFiltered}
              color="primary"
              variant="dot"
              sx={{ "& .MuiBadge-dot": { top: 2, right: 2 } }}
            >
              <Tooltip title={filterTooltip}>
                <FilterIconButton
                  onClick={handleFilterClick}
                  isFiltered={isFiltered}
                  aria-label={`Filter by ${label}`}
                  size="small"
                >
                  <FilterList fontSize="small" />
                </FilterIconButton>
              </Tooltip>
            </Badge>
            {filterPopoverRenderer(filterAnchor, handleFilterClose)}
          </>
        )}
      </IconsContainer>
    </HeaderContent>
  );
};

BaseHeaderRenderer.displayName = "BaseHeaderRenderer";

export default BaseHeaderRenderer;

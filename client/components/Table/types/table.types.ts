// Keep existing types for backward compatibility during migration
export interface LoadMoreParams {
  visibleStartIndex: number;
  visibleStopIndex: number;
}

/**
 * Pagination information matching GraphQL PageInfo type
 */
export interface PageInfo {
  count: number;
  currentPage: number;
  firstItem?: number | null;
  hasMorePages: boolean;
  lastItem?: number | null;
  lastPage: number;
  perPage: number;
  total: number;
  // Legacy cursor-based pagination properties for compatibility
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

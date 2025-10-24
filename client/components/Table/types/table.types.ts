// Keep existing types for backward compatibility during migration
export interface LoadMoreParams {
  visibleStartIndex: number;
  visibleStopIndex: number;
}

/**
 * Pagination information
 */
export interface PageInfo {
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

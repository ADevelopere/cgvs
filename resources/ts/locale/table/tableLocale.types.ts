// Define the shape of the locale strings. Group them by concern.
export interface TableLocaleSort {
  title: string; // e.g., "Sort"
  ascending: string; // e.g., "Sort Ascending"
  descending: string; // e.g., "Sort Descending"
  clear: string; // e.g., "Clear Sort"
}

export interface TableLocaleFilter {
  title: string; // e.g., "Filter"
  apply: string; // e.g., "Apply"
  clear: string; // e.g., "Clear Filter"
  clearAll: string; // e.g., "Clear All Filters"
  empty: string; // e.g., "Is Empty"
  notEmpty: string; // e.g., "Is Not Empty"
  operation: string;
  value: string;
  cancel: string;
  // Add more generic filter strings if needed, specific ones can be per type
}

export interface TableLocaleTextFilterOps {
  contains: string;
  notContains: string;
  equals: string;
  notEquals: string;
  startsWith: string;
  endsWith: string;
  isEmpty: string;
  isNotEmpty: string;
}

export interface TableLocaleNumberFilterOps {
  equals: string;
  notEquals: string;
  greaterThan: string;
  greaterThanOrEqual: string;
  lessThan: string;
  lessThanOrEqual: string;
  isEmpty: string;
  isNotEmpty: string;
}

export interface TableLocaleDateFilterOps {
  between: string;
  is: string;
  isNot: string;
  isAfter: string;
  isBefore: string;
  isOnOrAfter: string;
  isOnOrBefore: string;
  from: string; // e.g., "From"
  to: string; // e.g., "To"
  isEmpty: string;
  isNotEmpty: string;
}

export interface TableLocalePagination {
  rowsPerPage: string; // e.g., "Rows per page:"
  displayedRows: (from: number, to: number, count: number) => string; // e.g., "{from}-{to} of {count}"
  firstPage: string; // e.g., "First page"
  previousPage: string; // e.g., "Previous page"
  nextPage: string; // e.g., "Next page"
  lastPage: string; // e.g., "Last page"
}

export interface TableLocaleGeneral {
  loading: string; // e.g., "Loading..."
  noData: string; // e.g., "No data to display"
  actions: string; // e.g., "Actions" (for action columns)
  columnVisibility: string; // e.g., "Show/Hide Columns"
  // Add other general strings
}

export interface TableLocaleSelection {
  selectAll: string;
  rowsSelected: (count: number) => string;
  deselectAll: string;
  selectRow: string;
  deselectRow: string;
}

export interface TableLocaleColumn {
  pin: string;
  pinLeft: string;
  pinRight: string;
  unpin: string;
  hide: string;
  autosize: string;
  showColumnManager: string;
}

// The complete locale object structure
export interface TableLocale {
  sort: TableLocaleSort;
  filter: TableLocaleFilter;
  textFilterOps: TableLocaleTextFilterOps;
  numberFilterOps: TableLocaleNumberFilterOps;
  dateFilterOps: TableLocaleDateFilterOps;
  pagination: TableLocalePagination;
  general: TableLocaleGeneral;
  selection: TableLocaleSelection;
  column: TableLocaleColumn;
  // Add more groups as needed, e.g., for column actions, specific component labels
}

// Define the supported locales as a union type for type safety
// Start with 'en', add more as you implement them (e.g., 'ar')
export type SupportedLocale = 'en' | 'ar'; // Add 'ar-EG', 'en-US' if you need regional variants

// Type for the dictionary holding all locale definitions
export type LocaleDictionary = Record<SupportedLocale, TableLocale>;

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
  valueRequired: string; // e.g., "Value is required for this operation"
  invalidNumber: string; // e.g., "Please enter a valid number"
  dateRequired: string; // e.g., "Date is required for this operation"
  endDateRequired: string; // e.g., "End date is required for between operation"
  startDateBeforeEnd: string; // e.g., "Start date must be before end date"
  date: string; // e.g., "Date"
  startDate: string; // e.g., "Start Date"
  endDate: string; // e.g., "End Date"
  // Add more generic filter strings if needed, specific ones can be per type
}

export interface TableLocaleTextFilterOps {
  [key: string]: string;

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
  [key: string]: string;

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
  [key: string]: string;

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
  rowOf: string; // e.g., "row" (singular)
  rowsOf: string; // e.g., "rows" (plural)
  of: string; // e.g., "of"
  columnsVisible: string; // e.g., "columns visible"
  // Add other general strings
  cancel: string;
  confirm: string;
  clear: string;
  delete: string;
}

export interface TableLocaleSelection {
  selectAll: string;
  rowsSelected: (count: number) => string;
  deselectAll: string;
  selectRow: string;
  deselectRow: string;
}

export interface TableLocaleBooleanFilterOps {
  [key: string]: string;

  all: string;
  true: string;
  false: string;
}

export interface TableLocaleColumn {
  pin: string;
  pinLeft: string;
  pinRight: string;
  unpin: string;
  hide: string;
  autosize: string;
  showColumnManager: string;
  resize: string;
}

export interface TableLocaleValidation {
  required: string; // e.g., "Value is required"
  invalidNumber: string; // e.g., "Please enter a valid number"
  invalidValue: string; // e.g., "Invalid value"
  invalidDate: string; // e.g., "Invalid date"
  minValue: (min: number) => string; // e.g., "Value must be at least {min}"
  maxValue: (max: number) => string; // e.g., "Value must be at most {max}"
  maxDecimals: (decimals: number) => string; // e.g., "Maximum {decimals} decimal places allowed"
  minDate: (date: string) => string; // e.g., "Date must be after {date}"
  maxDate: (date: string) => string; // e.g., "Date must be before {date}"
}

// The complete locale object structure
export interface TableLocale {
  sort: TableLocaleSort;
  filter: TableLocaleFilter;
  textFilterOps: TableLocaleTextFilterOps;
  numberFilterOps: TableLocaleNumberFilterOps;
  dateFilterOps: TableLocaleDateFilterOps;
  booleanFilterOps: TableLocaleBooleanFilterOps;
  pagination: TableLocalePagination;
  general: TableLocaleGeneral;
  selection: TableLocaleSelection;
  column: TableLocaleColumn;
  validation: TableLocaleValidation;
  // Add more groups as needed, e.g., for column actions, specific component labels
}

// Define the supported locales as a union type for type safety
// Start with 'en', add more as you implement them (e.g., 'ar')
export type SupportedLocale = "en" | "ar"; // Add 'ar-EG', 'en-US' if you need regional variants

// Type for the dictionary holding all locale definitions
export type LocaleDictionary = Record<SupportedLocale, TableLocale>;

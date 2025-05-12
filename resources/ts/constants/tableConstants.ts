import { Column } from "@/types/table.type"

// Column definitions with server operation support
export const TABLE_COLUMNS: Column[] = [
  {
    id: "id",
    label: "ID",
    type: "number",
    accessor: "id",
    editable: false,
    sortable: true,
    filterable: true,
    filterMode: "popover",
    // Server operations
    serverSortable: true,
    serverFilterable: true,
  },
  {
    id: "name",
    label: "Full Name",
    type: "text",
    accessor: "name",
    editable: true,
    sortable: true,
    filterable: true,
    filterMode: "popover",
    // Server operations
    serverSortable: true,
    serverFilterable: true,
  },
  {
    id: "date",
    label: "Registration Date",
    type: "date",
    accessor: "date",
    editable: true,
    sortable: true,
    filterable: true,
    filterMode: "popover",
    // Server operations
    serverSortable: true,
    serverFilterable: true,
  },
  {
    id: "email",
    label: "Email Address",
    type: "text",
    accessor: "email",
    editable: true,
    sortable: true,
    filterable: true,
    filterMode: "popover",
    // Server operations
    serverSortable: false,
    serverFilterable: true,
  },
  {
    id: "status",
    label: "Status",
    type: "text",
    accessor: "status",
    editable: true,
    sortable: true,
    filterable: true,
    filterMode: "inline",
    // Server operations
    serverSortable: true,
    serverFilterable: false,
  },
]

// Table pagination and data constants
export const TOTAL_ROWS = 10000
export const PAGE_SIZE = 200
export const DEFAULT_ROWS_PER_PAGE = 50
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

// Status options for demo data
export const STATUS_OPTIONS = ["Active", "Inactive", "Pending", "Suspended"]

// Simulated network delay in milliseconds
export const SIMULATED_NETWORK_DELAY = 300
export const SIMULATED_LOAD_MORE_DELAY = 800

export const TABLE_CHECKBOX_CONTAINER_SIZE = 64
export const TABLE_CHECKBOX_WIDTH = 48
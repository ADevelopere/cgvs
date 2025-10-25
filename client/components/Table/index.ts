// Main Table component
export { Table } from "./core/Table";

// TableRenderer (for advanced use cases)
export { TableRenderer } from "./core/TableRenderer";

/**
 * @deprecated TableProvider is deprecated. Use Table component directly instead.
 * The Table component now includes provider functionality built-in.
 */
export { Table as TableProvider } from "./core/Table";

// Core components (if needed externally)
export * from "./core";

// Types
export type * from "./types";

// Contexts
export * from "./contexts";

// Renderers (including filters)
export * from "./renderers";

// Components
export * from "./components";

// Utils (if needed externally)
export * from "./utils";

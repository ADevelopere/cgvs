import React from "react";

/**
 * Base properties shared by all column types
 */
export type BaseColumnProps<TColumnId extends string = string> = {
  /** Unique identifier for the column */
  id: TColumnId;

  /** Optional label for column (used in column management UI) */
  label?: string;

  /** Whether the column can be resized */
  resizable?: boolean;

  /** Initial width of the column in pixels */
  initialWidth?: number;

  /** Minimum width constraint in pixels */
  minWidth?: number;

  /** Maximum width constraint in pixels */
  maxWidth?: number;

  /** LocalStorage key for persisting column width */
  widthStorageKey?: string;
};

/**
 * View-only column (non-editable)
 */
export type Column<TRowData, TColumnId extends string = string> = BaseColumnProps<TColumnId> & {
  type: "viewonly";

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: (props: { column: Column<TRowData, TColumnId> }) => React.ReactNode;

  /**
   * Renders the cell content in view mode
   */
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;
};

/**
 * Editable column with inline editing support
 */
export type EditableColumn<TRowData, TValue, TColumnId extends string = string> = BaseColumnProps<TColumnId> & {
  type: "editable";

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: (props: {
    column: EditableColumn<TRowData, TValue, TColumnId>;
  }) => React.ReactNode;

  /**
   * Renders the cell content in view mode
   */
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;

  /**
   * Renders the cell content in edit mode
   * Called when user double-clicks the cell or triggers edit mode
   */
  editRenderer: (props: {
    row: TRowData;
    onSave: (value: TValue) => Promise<void>;
    onCancel: () => void;
  }) => React.ReactNode;

  /**
   * Callback when cell value is saved
   * @param rowId - ID of the row being edited
   * @param value - New value to save
   */
  onUpdate?: (rowId: TRowData[keyof TRowData], value: TValue) => Promise<void>;
};

/**
 * Union type representing any column in a table
 * TValue defaults to any field type in TRowData
 */
export type AnyColumn<TRowData, TColumnId extends string = string, TValue = TRowData[keyof TRowData]> =
  | Column<TRowData, TColumnId>
  | EditableColumn<TRowData, TValue, TColumnId>;

/**
 * Type guard to check if column is editable
 */
export function isEditableColumn<TRowData, TValue, TColumnId extends string = string>(
  column: AnyColumn<TRowData, TColumnId, TValue>
): column is EditableColumn<TRowData, TValue, TColumnId> {
  return column.type === "editable";
}

import React from "react";

/**
 * Base properties shared by all column types
 */
export type BaseColumnProps = {
  /** Unique identifier for the column */
  id: string;

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
export type Column<TRowData> = BaseColumnProps & {
  type: "viewonly";

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: () => React.ReactNode;

  /**
   * Renders the cell content in view mode
   */
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;
};

/**
 * Editable column with inline editing support
 */
export type EditableColumn<
  TRowData,
  TValue,
  TRowId extends string | number = string | number,
> = BaseColumnProps & {
  type: "editable";

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: () => React.ReactNode;

  /**
   * Renders the cell content in view mode
   */
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;

  /**
   * Renders the cell content in edit mode
   * Called when user double-clicks the cell or triggers edit mode
   *
   * @param props.row - The row data
   * @param props.onSave - Callback provided by DataCell that wraps column.onUpdate
   *                       Pass this directly to your edit renderer component.
   *                       DO NOT wrap it again (e.g., avoid: onSave={async value => onSave(value)})
   * @param props.onCancel - Callback to exit edit mode without saving
   * @param props.onErrorChange - Callback to notify parent of error state changes (for red cell border)
   *
   * @example
   * editRenderer: ({ row, onSave, onCancel, onErrorChange }) => (
   *   <TextEditRenderer
   *     value={row.name}
   *     onSave={onSave}  // Pass through directly
   *     onCancel={onCancel}
   *     onErrorChange={onErrorChange}
   *   />
   * )
   */
  editRenderer: (props: {
    row: TRowData;
    onSave: (value: TValue | null | undefined) => Promise<void>;
    onCancel: () => void;
    onErrorChange?: (error: string | null) => void;
  }) => React.ReactNode;

  /**
   * Callback when cell value is saved
   * This is called by DataCell.handleSave, which is triggered by the onSave
   * callback passed to editRenderer.
   *
   * Flow: editRenderer component calls onSave → DataCell.handleSave → column.onUpdate
   *
   * @param rowId - ID of the row being edited
   * @param value - New value to save
   */
  onUpdate?: (rowId: TRowId, value: TValue | null | undefined) => Promise<void>;
};

/**
 * Union type representing any column in a table
 * TValue defaults to any field type in TRowData
 */
export type AnyColumn<
  TRowData,
  TRowId extends string | number = string | number,
> = Column<TRowData> | EditableColumn<TRowData, unknown, TRowId>;

/**
 * Type guard to check if column is editable
 */
export function isEditableColumn<
  TRowData,
  TRowId extends string | number = string | number,
>(
  column: AnyColumn<TRowData, TRowId>
): column is EditableColumn<TRowData, unknown, TRowId> {
  return column.type === "editable";
}

export type PinPosition = "left" | "right" | null;

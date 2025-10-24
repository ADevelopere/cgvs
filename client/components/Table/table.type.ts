import React from 'react';

/**
 * Base properties shared by all column types
 */
export type BaseColumnProps = {
  /** Unique identifier for the column */
  id: string;

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
  type: 'viewonly';

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: (props: { column: Column<TRowData> }) => React.ReactNode;

  /**
   * Renders the cell content in view mode
   */
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;
};

/**
 * Editable column with inline editing support
 */
export type EditableColumn<TRowData> = BaseColumnProps & {
  type: 'editable';

  /**
   * Renders the column header
   * Consumer has full control over header rendering (sort, filter, label, etc.)
   */
  headerRenderer: (props: { column: EditableColumn<TRowData> }) => React.ReactNode;

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
    onSave: (value: unknown) => Promise<void>;
    onCancel: () => void;
  }) => React.ReactNode;

  /**
   * Callback when cell value is saved
   * @param rowId - ID of the row being edited
   * @param value - New value to save
   */
  onUpdate?: (rowId: number, value: unknown) => Promise<void>;
};

/**
 * Union type of all column types
 */
export type AnyColumn<TRowData> = Column<TRowData> | EditableColumn<TRowData>;

/**
 * Type guard to check if column is editable
 */
export function isEditableColumn<TRowData>(
  column: AnyColumn<TRowData>
): column is EditableColumn<TRowData> {
  return column.type === 'editable';
}

// Keep existing types for backward compatibility during migration
export interface LoadMoreParams {
  visibleStartIndex: number;
  visibleStopIndex: number;
}

export type PinPosition = "left" | "right" | null;

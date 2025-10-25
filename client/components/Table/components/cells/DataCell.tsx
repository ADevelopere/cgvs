"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import { AnyColumn, isEditableColumn } from "../../types";

type DataCellProps<
  TRowData,
  TRowId extends string | number = string | number,
> = {
  column: AnyColumn<TRowData, TRowId>;
  row: TRowData;
  rowId: TRowId;
  cellStyle: CSSProperties;
  cellEditingStyle: CSSProperties;
  getColumnPinPosition: (columnId: string) => "left" | "right" | null;
  getColumnWidth: (columnId: string) => number | undefined;
  pinnedLeftStyle: React.CSSProperties;
  pinnedRightStyle: React.CSSProperties;
};

/**
 * DataCell Component
 *
 * Manages cell state and delegates rendering to column renderers:
 * - Uses column.viewRenderer for view mode
 * - Uses column.editRenderer for edit mode (if editable)
 * - Handles double-click to enter edit mode
 * - Manages save/cancel callbacks
 */
const DataCellComponent = <
  TRowData,
  TValue,
  TRowId extends string | number = string | number,
>({
  column,
  row,
  rowId,
  cellStyle,
  cellEditingStyle,
  getColumnPinPosition,
  getColumnWidth,
  pinnedLeftStyle,
  pinnedRightStyle,
}: DataCellProps<TRowData, TRowId>) => {
  const [isEditing, setIsEditing] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null);

  // Determine if column is editable
  const editable = useMemo(() => isEditableColumn(column), [column]);

  // Calculate cell style based on pin position
  const computedCellStyle = useMemo<CSSProperties>(() => {
    const pinPosition = getColumnPinPosition(column.id);
    const width = getColumnWidth(column.id);

    let style: CSSProperties = {
      ...cellStyle,
      maxWidth: width,
      minWidth: width,
      width: width,
    };

    if (pinPosition === "left") {
      style = { ...style, ...pinnedLeftStyle };
    } else if (pinPosition === "right") {
      style = { ...style, ...pinnedRightStyle };
    }

    if (isEditing) {
      style = { ...style, ...cellEditingStyle };
    }

    return style;
  }, [
    column.id,
    cellStyle,
    cellEditingStyle,
    isEditing,
    getColumnPinPosition,
    getColumnWidth,
    pinnedLeftStyle,
    pinnedRightStyle,
  ]);

  // Handle double-click to enter edit mode
  const handleDoubleClick = useCallback(() => {
    if (editable && !isEditing) {
      setIsEditing(true);
    }
  }, [editable, isEditing]);

  /**
   * Handle save - called by edit renderers via the onSave callback
   * This wraps column.onUpdate and manages edit state
   *
   * Flow: EditRenderer calls onSave → this function → column.onUpdate
   */
  const handleSave = useCallback(
    async (value: TValue) => {
      if (isEditableColumn(column) && column.onUpdate) {
        try {
          await column.onUpdate(rowId, value);
          setIsEditing(false);
        } catch (_error) {
          // Error handling - could show toast/snackbar here
          // Don't exit edit mode on error
        }
      } else {
        // No onUpdate handler, just exit edit mode
        setIsEditing(false);
      }
    },
    [column, rowId]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Handle click outside to cancel
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside the cell
      if (cellRef.current && !cellRef.current.contains(target)) {
        // Don't cancel if clicking on MUI components rendered in portals
        // These include Select menus, Autocomplete dropdowns, DatePicker calendars, MuiTelInput menus, etc.
        const isClickOnMuiPortal = (target as Element).closest?.(
          ".MuiPopover-root, .MuiMenu-root, .MuiAutocomplete-popper, .MuiPickersPopper-root, .MuiDateCalendar-root, .MuiPickersLayout-root, .MuiTelInput-Menu"
        );

        if (!isClickOnMuiPortal) {
          handleCancel();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, handleCancel]);

  // Handle Escape key to cancel
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, handleCancel]);

  return (
    <td
      ref={cellRef}
      style={computedCellStyle}
      onDoubleClick={handleDoubleClick}
      role={editable ? "gridcell" : undefined}
      aria-readonly={!editable}
    >
      <div style={{ padding: "8px 12px", overflow: "hidden" }}>
        {isEditing && isEditableColumn(column)
          ? // Render edit mode
            // Pass handleSave as onSave callback to editRenderer
            // editRenderer should pass this directly to its edit component
            column.editRenderer({
              row,
              onSave: value => handleSave(value as TValue),
              onCancel: handleCancel,
            })
          : // Render view mode
            column.viewRenderer({ row })}
      </div>
    </td>
  );
};

DataCellComponent.displayName = "DataCell";

export const DataCell = React.memo(
  DataCellComponent
) as typeof DataCellComponent;

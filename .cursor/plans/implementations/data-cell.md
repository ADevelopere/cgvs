# DataCell Complete Implementation

**File: `client/components/Table/TableBody/DataCell.tsx`**

Refactored to use `column.viewRenderer` and `column.editRenderer` instead of built-in type-based rendering.

## Complete Implementation

```typescript
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnyColumn, isEditableColumn } from '@/client/components/Table/table.type';

type DataCellProps<TRowData = any> = {
  column: AnyColumn<TRowData>;
  row: TRowData;
  rowId: number;
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
const DataCell = <TRowData,>({
  column,
  row,
  rowId,
  cellStyle,
  cellEditingStyle,
  getColumnPinPosition,
  getColumnWidth,
  pinnedLeftStyle,
  pinnedRightStyle,
}: DataCellProps<TRowData>) => {
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
    
    if (pinPosition === 'left') {
      style = { ...style, ...pinnedLeftStyle };
    } else if (pinPosition === 'right') {
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
  
  // Handle save
  const handleSave = useCallback(
    async (value: unknown) => {
      if (isEditableColumn(column) && column.onUpdate) {
        try {
          await column.onUpdate(rowId, value);
          setIsEditing(false);
        } catch (error) {
          // Error handling - could show toast/snackbar here
          console.error('Failed to update cell:', error);
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
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, handleCancel]);
  
  // Handle Escape key to cancel
  useEffect(() => {
    if (!isEditing) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing, handleCancel]);
  
  return (
    <td
      ref={cellRef}
      style={computedCellStyle}
      onDoubleClick={handleDoubleClick}
      role={editable ? 'gridcell' : undefined}
      aria-readonly={!editable}
    >
      <div style={{ padding: '8px 12px', overflow: 'hidden' }}>
        {isEditing && isEditableColumn(column) ? (
          // Render edit mode
          column.editRenderer({ row, onSave: handleSave, onCancel: handleCancel })
        ) : (
          // Render view mode
          column.viewRenderer({ row })
        )}
      </div>
    </td>
  );
};

DataCell.displayName = 'DataCell';

export default React.memo(DataCell) as typeof DataCell;
```

## Key Changes from Old Implementation

### Removed
- ✗ `CellContentRenderer` component usage
- ✗ Type-based rendering logic (text, number, date, etc.)
- ✗ Built-in input components
- ✗ Type-specific validation logic
- ✗ Direct access to `cellValue` prop

### Kept
- ✓ Double-click to edit
- ✓ Save/Cancel handling
- ✓ Pinned cell styling
- ✓ Cell width management
- ✓ Keyboard shortcuts (Escape to cancel)
- ✓ Click outside to cancel

### New
- ✓ Calls `column.viewRenderer({ row })` for view mode
- ✓ Calls `column.editRenderer({ row, onSave, onCancel })` for edit mode
- ✓ Fully generic with TypeScript `<TRowData>`
- ✓ Type guard for editable columns
- ✓ Consumer controls all rendering and validation

## Integration Example

```typescript
// In TableBody.tsx
{rows.map(row => (
  <tr key={row.id}>
    {columns.map(column => (
      <DataCell
        key={column.id}
        column={column}
        row={row}
        rowId={row.id}
        cellStyle={cellStyle}
        cellEditingStyle={cellEditingStyle}
        getColumnPinPosition={getColumnPinPosition}
        getColumnWidth={getColumnWidth}
        pinnedLeftStyle={pinnedLeftStyle}
        pinnedRightStyle={pinnedRightStyle}
      />
    ))}
  </tr>
))}
```

## Error Handling

The `handleSave` function includes basic error handling. For production use, you may want to:

1. Show error messages to users (toast/snackbar)
2. Add retry logic
3. Implement optimistic updates
4. Add loading states

Example with error display:

```typescript
const handleSave = useCallback(
  async (value: unknown) => {
    if (isEditableColumn(column) && column.onUpdate) {
      try {
        await column.onUpdate(rowId, value);
        setIsEditing(false);
        showSuccessToast('Cell updated successfully');
      } catch (error) {
        showErrorToast('Failed to update cell. Please try again.');
        // Keep edit mode open so user can retry
      }
    } else {
      setIsEditing(false);
    }
  },
  [column, rowId]
);
```

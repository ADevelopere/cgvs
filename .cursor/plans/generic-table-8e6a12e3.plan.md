<!-- 8e6a12e3-b21d-4927-bf81-8a3dd1c9bfb5 17321b2e-94e3-47f9-8b82-cd5a1726f6f8 -->

# Generic Table Component Refactor

## Overview

Transform the Table component from a type-based system to a fully generic renderer-based architecture, eliminating built-in column types and empowering consumers with complete control over rendering.

## Core Type System Changes

### 1. Update `client/components/Table/table.type.ts`

**Delete:**

- `ColumnTypes` enum entirely
- All type-specific properties: `accessor`, `label`, `getValue`, `metadata`
- All validation properties: `minLength`, `maxLength`, `pattern`, `minValue`, `maxValue`, `decimalPlaces`, `minDate`, `maxDate`, `format`, `multiple`, `options`, `required`
- `sortable`, `filterable`, `editable` flags (moved to renderer responsibility)

**New Type Structure:**

[See table-types.md](./implementations/table-types.md)

### 2. Make All Contexts Generic

**Files to update:**

- `TableContext.tsx` → `TableProvider<TRowData>`
  - Change `data: any[]` to `data: TRowData[]`
  - Change `columns: EditableColumn[]` to `columns: AnyColumn<TRowData>[]`
  - Update all context type definitions to use generic `TRowData`

- `TableColumnContext.tsx` → `TableColumnsProvider<TRowData>`
  - Change `allColumns: EditableColumn[]` to `allColumns: AnyColumn<TRowData>[]`
  - Change `visibleColumns: EditableColumn[]` to `visibleColumns: AnyColumn<TRowData>[]`
  - Update context provider to accept generic type

- `TableDataContext.tsx` → `TableDataProvider<TRowData>`
  - Keep existing filter/sort state management (applyTextFilter, applyNumberFilter, applyDateFilter, etc.)
  - Keep existing TableCellEditingState for virtualization support
  - Filter and sort logic remains in context but is accessed by individual headerRenderers

- `TableRowsContext.tsx` → `TableRowsProvider<TRowData>`
  - Update to use generic data type
  - Keep all existing functionality

**Important:** Filter state management stays in `TableDataContext` - individual headerRenderers will access it via `useTableDataContext()` hook.

## Refactor Core Table Components

### 3. Update `TableHeader/ColumnHeaderCell.tsx`

**Remove:**

- All filter handling logic
- All sort handling logic
- Filter icon rendering
- Sort icon rendering
- Label rendering

**Keep:**

- Resize handle rendering and logic
- Options menu (three-dot menu for pinning, hiding, etc.)
- Column width management
- Pinned column styling

**New:**

- Call `column.headerRenderer({ column })` to render ALL header content
- Consumer's headerRenderer has complete control over label, sort button, filter button, icons, etc.

**New Structure:**

[See column-header-cell.md](./implementations/column-header-cell.md)

### 4. Update `TableBody/DataCell.tsx`

**Remove:**

- All built-in rendering logic
- `CellContentRenderer` usage
- `cellValue` prop and extraction logic
- Type-based switching logic

**Keep:**

- Double-click to edit handling
- Edit state management (isEditing state)
- Save/Cancel callbacks
- Pinned cell styling
- Cell width management
- Keyboard shortcuts (Escape to cancel)
- Click outside to cancel

**New:**

- Pass entire `row` object to renderers (not extracted cellValue)
- Call `column.viewRenderer({ row })` for view mode
- Call `column.editRenderer({ row, onSave, onCancel })` for edit mode
- Use `isEditableColumn(column)` type guard to check if editable

**New Structure:**

[See data-cell.md](./implementations/data-cell.md)

### 5. Update `TableBody/DataRow.tsx`

**Remove:**

- Import and usage of `getCellValue` from `DataCell.util.ts`
- Line 205: `const cellValue = getCellValue(column, rowData);`

**Update:**

- Pass `row={rowData}` to DataCell instead of `cellValue={cellValue}`
- DataCell will pass the full row object to renderers

### 6. Delete `TableBody/DataCell.util.ts`

**Delete entire file** - These utility functions (`getCellValue`, `formatCellValue`, `formatInputValue`) are no longer needed:

- Renderers receive the full `row` object and extract values themselves
- No built-in type-based formatting logic
- Each renderer handles its own formatting

### 7. Mark as Deprecated (DO NOT DELETE)

Add deprecation comments to these files - they will be kept for manual cleanup later:

**Files to mark as deprecated:**

- `client/components/Table/TableBody/CellContentRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/TextVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/NumberVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/DateVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/SelectVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/ReadyStatusCellRenderer.tsx`

[See deprecation-comment.md](./implementations/deprecation-comment.md)

## Create Reusable Renderer Utilities

### 8. Create `client/components/Table/renderers/` Directory Structure

```
renderers/
├── headers/
│   ├── BaseHeaderRenderer.tsx
│   ├── createSortableHeader.tsx
│   ├── createFilterableHeader.tsx
│   └── createSimpleHeader.tsx
├── filters/
│   ├── TextFilterPopover.tsx
│   ├── NumberFilterPopover.tsx
│   ├── DateFilterPopover.tsx
│   ├── SelectFilterPopover.tsx
│   ├── BooleanFilterPopover.tsx
│   └── index.ts
├── view/
│   ├── TextViewRenderer.tsx
│   ├── NumberViewRenderer.tsx
│   ├── DateViewRenderer.tsx
│   ├── BooleanViewRenderer.tsx
│   ├── SelectViewRenderer.tsx
│   ├── CountryViewRenderer.tsx
│   ├── PhoneViewRenderer.tsx
│   └── ReadyStatusViewRenderer.tsx
├── edit/
│   ├── TextEditRenderer.tsx
│   ├── NumberEditRenderer.tsx
│   ├── DateEditRenderer.tsx
│   ├── BooleanEditRenderer.tsx
│   ├── SelectEditRenderer.tsx
│   ├── CountryEditRenderer.tsx
│   └── PhoneEditRenderer.tsx
└── index.ts
```

### 9. Implement BaseHeaderRenderer Component

**File: `renderers/headers/BaseHeaderRenderer.tsx`**

This is the optional reusable base component that provides standard header layout with sort and filter slots.

**Features:**

- Displays column label with truncation
- Optional sort button with direction indicators (ASC/DESC/none)
- Optional filter button with active badge
- Renders consumer-provided filter popover
- Handles click events and passes them to consumer callbacks
- Fully styled to match current table header appearance

**Important:** This is a UTILITY component for consumers to use in their headerRenderer functions. It does NOT manage filter/sort state itself - consumers pass in callbacks that access TableDataContext.

[See base-header-renderer.md](./implementations/base-header-renderer.md)

### 10. Create Filter Popover Components

**Location: `client/components/Table/renderers/filters/`**

Create NEW reusable filter popover components (separate from old ones in TableHeader/):

- **TextFilterPopover.tsx** - Text field with operators (contains, equals, starts with, ends with)
- **NumberFilterPopover.tsx** - Number range inputs with operators (=, >, <, >=, <=, between)
- **DateFilterPopover.tsx** - Date picker with range support (before, after, between, on)
- **SelectFilterPopover.tsx** - Checkboxes for multi-select options
- **BooleanFilterPopover.tsx** - Radio buttons for true/false/all

**MUST maintain:**

- Exact same UI layout and styling as current filter popovers in `TableHeader/`
- Same operator options and behavior
- Same validation and error handling
- Same "Apply" and "Clear" button behavior
- Same keyboard navigation and accessibility
- Same debouncing for text input

**Props structure:**

```typescript
interface FilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  value: FilterValue | null;
  onApply: (value: FilterValue) => void;
  onClear: () => void;
}
```

**Integration pattern:**

Consumers use these in their headerRenderer by:

1. Managing filter anchor state (which filter popover is open)
2. Calling `applyTextFilter`/`applyNumberFilter`/`applyDateFilter` from `useTableDataContext()`
3. Checking filter state with `getActiveTextFilter`/etc from context

**Note:** Old filter popovers in `client/components/Table/TableHeader/` will be marked as deprecated but NOT deleted.

### 11. Implement View Renderers

**Location: `client/components/Table/renderers/view/`**

Extract rendering logic from `CellContentRenderer.tsx` into individual view renderers:

- `TextViewRenderer.tsx` - Simple text display with ellipsis
  - Props: `{ value: string | number }`
  - Renders text with truncation

- `NumberViewRenderer.tsx` - Number formatting
  - Props: `{ value: number, decimals?: number, locale?: string }`
  - Formats numbers with locale-specific formatting

- `DateViewRenderer.tsx` - Date formatting
  - Props: `{ value: Date | string, format?: string }`
  - Formats dates using specified format

- `BooleanViewRenderer.tsx` - Checkbox display (read-only)
  - Props: `{ value: boolean }`
  - Shows checked/unchecked checkbox

- `SelectViewRenderer.tsx` - Option label display
  - Props: `{ value: any, options: Array<{ label: string, value: any }> }`
  - Displays the label for selected value

- `CountryViewRenderer.tsx` - Flag + country name
  - Props: `{ value: CountryCode, strings: CountryTranslations }`
  - Shows flag image and translated country name

- `PhoneViewRenderer.tsx` - Phone number in LTR
  - Props: `{ value: string }`
  - Displays phone with LTR direction

- `ReadyStatusViewRenderer.tsx` - Ready status badge
  - Based on `ReadyStatusCellRenderer.tsx`
  - Non-editable, view-only renderer
  - Props: `{ value: boolean | string }`
  - Shows ready status badge/chip

**Implementation notes:**

- Each renderer is a simple React component that receives value/config props
- Extract existing rendering logic from `CellContentRenderer.tsx` view mode sections
- Use `useCallback` and `useMemo` where appropriate
- Keep styling consistent with current table appearance

### 12. Implement Edit Renderers

**Location: `client/components/Table/renderers/edit/`**

Extract editing logic from `CellContentRenderer.tsx` into individual edit renderers:

- `TextEditRenderer.tsx` - TextField with validation
  - Props: `{ value: string, onSave: (v: string) => Promise<void>, onCancel: () => void, validator?: (v: string) => string | null }`
  - TextField with Enter to save, Escape to cancel

- `NumberEditRenderer.tsx` - Number input
  - Props: `{ value: number, onSave: (v: number) => Promise<void>, onCancel: () => void, min?: number, max?: number }`
  - Number input with validation

- `DateEditRenderer.tsx` - Date picker
  - Props: `{ value: Date | string, onSave: (v: string) => Promise<void>, onCancel: () => void }`
  - MUI DatePicker component

- `BooleanEditRenderer.tsx` - Checkbox/Switch
  - Props: `{ value: boolean, onSave: (v: boolean) => Promise<void>, onCancel: () => void }`
  - Immediately saves on toggle

- `SelectEditRenderer.tsx` - Select dropdown
  - Props: `{ value: any, options: Array<{ label: string, value: any }>, onSave: (v: any) => Promise<void>, onCancel: () => void }`
  - MUI Select component

- `CountryEditRenderer.tsx` - Autocomplete with flags
  - Props: `{ value: CountryCode, onSave: (v: CountryCode) => Promise<void>, onCancel: () => void, strings: CountryTranslations }`
  - Autocomplete with country flags

- `PhoneEditRenderer.tsx` - MuiTelInput
  - Props: `{ value: string, onSave: (v: string) => Promise<void>, onCancel: () => void }`
  - Phone number input with country code

**Implementation notes:**

- Extract editing logic from `CellContentRenderer.tsx` edit mode sections
- Each renderer manages its own local state and validation
- Call `onSave` with new value when user confirms
- Call `onCancel` when user presses Escape or clicks away
- Use Material-UI components for consistency

### 13. Template Consumer Strategy

**NO template-specific renderers will be created.** Template consumers will use the basic renderers (Text, Number, Date, Select, ReadyStatus) directly.

**Template-specific validation logic:**

Template consumers will wrap basic edit renderers with their own validation logic based on `TemplateVariable` configuration:

```typescript
// Example: Template variable with validation
const editRenderer = ({ row, onSave, onCancel }) => {
  const handleSave = async (value: string) => {
    // Apply template-specific validation
    if (templateVariable.minLength && value.length < templateVariable.minLength) {
      throw new Error(`Minimum length is ${templateVariable.minLength}`);
    }
    if (templateVariable.pattern && !new RegExp(templateVariable.pattern).test(value)) {
      throw new Error('Value does not match required pattern');
    }
    // Call the actual save
    await onSave(value);
  };

  return <TextEditRenderer value={row.value} onSave={handleSave} onCancel={onCancel} />;
};
```

**Benefits of this approach:**

- Reduces code duplication - no need for separate template renderer implementations
- Template consumers have full control over validation logic
- Basic renderers remain simple and reusable
- Validation logic lives closer to the business domain (template variables)
- Easier to maintain - only one set of renderers to update

### 14. Create Header Utility Functions (Optional)

**Location: `client/components/Table/renderers/headers/`**

Create optional utility functions for common header patterns:

- **createSimpleHeader.tsx** - Just a label, no sort/filter
- **createSortableHeader.tsx** - Label + sort button
- **createFilterableHeader.tsx** - Label + filter button

These are helper functions that return headerRenderer functions for common use cases. Consumers can use these or create custom headerRenderers.

## Update Table Consumers

### 16. Update `client/views/student/column.ts` + `useStudentTable.tsx`

Convert student table columns to new renderer API:

**Changes in column.ts:**

1. Change column definitions to use new type structure
2. Add headerRenderer for each column
3. Add viewRenderer and editRenderer
4. Move validation logic to validators passed to edit renderers

**Changes in useStudentTable.tsx:**

1. Keep validators as separate functions
2. Update column building to use new renderer functions
3. Integrate with TableDataContext for filter/sort

[See build-student-columns.md](./implementations/build-student-columns.md)

### 17. Update RecipientVariableDataTable Consumer

**File: `client/views/template/manage/data/RecipientVariableDataTable.tsx`**

**Changes:**

1. Update TableProvider to use generic type: `<TableProvider<RecipientWithVariableValues>>`
2. Pass columns from updated `buildDataColumns` function
3. No changes needed to TableProvider props structure - contexts are backward compatible
4. Update TypeScript types to use `AnyColumn<RecipientWithVariableValues>[]`

**Template Variable Columns:**

For template variable columns, use basic renderers (TextEditRenderer, NumberEditRenderer, DateEditRenderer, SelectEditRenderer) wrapped with template-specific validation logic based on `TemplateVariable` config:

- Extract min/max/pattern/options from TemplateVariable
- Pass validation logic to basic renderer props or wrap onSave callback
- Use SelectEditRenderer with options from TemplateVariable.options
- Use ReadyStatusViewRenderer for the ready status column

### 18. Update StudentsInGroupTable Consumer

**File: `client/views/template/manage/recipient/StudentsInGroupTable.tsx`**

**Changes:**

1. Convert column definitions to use renderer-based API
2. Update to use `TableProvider<Student>` with generic type
3. Add headerRenderer, viewRenderer, editRenderer to each column
4. Integrate filters using TableDataContext methods

### 19. Update StudentsNotInGroupTable Consumer

**File: `client/views/template/manage/recipient/StudentsNotInGroupTable.tsx`**

**Changes:**

1. Convert column definitions to use renderer-based API
2. Update to use `TableProvider<Student>` with generic type
3. Add headerRenderer, viewRenderer, editRenderer to each column
4. Integrate filters using TableDataContext methods

### 20. Update TableBody Component

**File: `client/components/Table/TableBody/TableBody.tsx`**

**Changes:**

1. Update to pass `row` prop to DataCell instead of extracting cellValue
2. Remove any getCellValue usage
3. Ensure generic types flow through properly

## Final Exports and Documentation

### 21. Update Exports

**File: `client/components/Table/renderers/index.ts`**

Export all renderers, filters, and utilities for easy consumer imports:

```typescript
// Headers
export * from "./headers/BaseHeaderRenderer";
export * from "./headers/createSortableHeader";
export * from "./headers/createFilterableHeader";
export * from "./headers/createSimpleHeader";

// Filters
export * from "./filters/TextFilterPopover";
export * from "./filters/NumberFilterPopover";
export * from "./filters/DateFilterPopover";
export * from "./filters/SelectFilterPopover";
export * from "./filters/BooleanFilterPopover";

// View Renderers
export * from "./view/TextViewRenderer";
export * from "./view/NumberViewRenderer";
export * from "./view/DateViewRenderer";
export * from "./view/BooleanViewRenderer";
export * from "./view/SelectViewRenderer";
export * from "./view/CountryViewRenderer";
export * from "./view/PhoneViewRenderer";
export * from "./view/ReadyStatusViewRenderer";

// Edit Renderers
export * from "./edit/TextEditRenderer";
export * from "./edit/NumberEditRenderer";
export * from "./edit/DateEditRenderer";
export * from "./edit/BooleanEditRenderer";
export * from "./edit/SelectEditRenderer";
export * from "./edit/CountryEditRenderer";
export * from "./edit/PhoneEditRenderer";
```

[See renderers-export.md](./implementations/renderers-export.md)

### 22. Add Performance Optimizations

Ensure all new components use:

- `useCallback` for event handlers
- `useMemo` for computed values
- `React.memo` for component memoization where appropriate
- Proper dependency arrays
- Avoid inline function definitions in render props

### 23. Mark Old Files as Deprecated

Add deprecation comments to old files (manual cleanup will be done later):

**Files to mark as deprecated:**

- `client/components/Table/TableHeader/FilterPopover.tsx`
- `client/components/Table/TableHeader/TextFilterPopover.tsx`
- `client/components/Table/TableHeader/NumberFilterPopover.tsx`
- `client/components/Table/TableHeader/DateFilterPopover.tsx`
- `client/components/Table/TableBody/CellContentRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/TextVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/NumberVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/DateVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/SelectVariableCellRenderer.tsx`
- `client/views/template/manage/data/components/cellRenderers/ReadyStatusCellRenderer.tsx`

[See deprecation-comment.md](./implementations/deprecation-comment.md)

## Implementation Order

1. **Phase 1: Type System** (Steps 1)
   - Update table.type.ts with new generic types
   - This is the foundation for everything else

2. **Phase 2: Contexts** (Step 2)
   - Make all contexts generic
   - Ensure backward compatibility with existing filter/sort logic

3. **Phase 3: Core Components** (Steps 3-7)
   - Update ColumnHeaderCell
   - Update DataCell
   - Update DataRow
   - Delete DataCell.util.ts
   - Mark deprecated files

4. **Phase 4: Renderer Library** (Steps 8-14)
   - Create directory structure
   - Implement BaseHeaderRenderer
   - Implement filter popovers
   - Implement view renderers (including ReadyStatusViewRenderer)
   - Implement edit renderers
   - Create header utilities
   - Document template consumer strategy (use basic renderers with custom validation)

5. **Phase 5: Consumer Updates** (Steps 15-20)
   - Update buildDataColumns
   - Update student table
   - Update RecipientVariableDataTable
   - Update StudentsInGroupTable
   - Update StudentsNotInGroupTable
   - Update TableBody

6. **Phase 6: Finalization** (Steps 21-23)
   - Create exports
   - Add performance optimizations
   - Add deprecation comments

## Testing Checklist

- [ ] All table consumers render correctly
- [ ] Editing functionality works in all tables
- [ ] Validation displays correctly in edit mode
- [ ] Sorting works when implemented in headerRenderer
- [ ] Filtering works for all filter types (text, number, date, select, country, phone)
- [ ] Filter badges show/hide correctly when filters are applied/cleared
- [ ] Column resizing persists to localStorage
- [ ] Column pinning (left/right) works correctly
- [ ] Column hiding/showing works correctly
- [ ] Pagination works correctly
- [ ] Row selection works if enabled
- [ ] Double-click to edit works
- [ ] Escape key cancels edit
- [ ] Click outside cancels edit
- [ ] Enter key saves edit
- [ ] No TypeScript errors
- [ ] All components properly memoized
- [ ] No console warnings
- [ ] Virtualization works with large datasets
- [ ] Edit state persists during virtualization (scroll up/down)

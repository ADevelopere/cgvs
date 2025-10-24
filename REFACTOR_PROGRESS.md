# Table Component Refactor Progress

## Completed ✓

### Phase 1: Type System (COMPLETE)
- ✓ Updated `table.type.ts` with new generic types
  - New `Column<TRowData>` for view-only columns
  - New `EditableColumn<TRowData>` for editable columns
  - New `AnyColumn<TRowData>` union type
  - Added `isEditableColumn` type guard
  - Removed old `ColumnTypes` enum and type-specific properties

### Phase 2: Contexts (COMPLETE)
- ✓ Made `TableContext` generic with `<TRowData>`
- ✓ Made `TableColumnContext` generic with `<TRowData>`
- ✓ Made `TableDataContext` generic with `<TRowData>`
- ✓ Made `TableRowsContext` generic with `<TRowData>`
- ✓ Updated all context hooks to use generics
- ✓ Simplified `applyFilter` to remove type-specific logic

### Phase 3: Core Components (COMPLETE)
- ✓ Refactored `ColumnHeaderCell.tsx` to use `column.headerRenderer`
  - Removed all filter/sort handling
  - Kept resize, options menu, pinning functionality
- ✓ Refactored `DataCell.tsx` to use renderers
  - Now accepts `row` instead of `cellValue`
  - Calls `column.viewRenderer({ row })` for view mode
  - Calls `column.editRenderer({ row, onSave, onCancel })` for edit mode
  - Uses `isEditableColumn` type guard
- ✓ Updated `DataRow.tsx` to pass `row` to DataCell
- ✓ Deleted `DataCell.util.ts` (no longer needed)
- ✓ Marked deprecated files with deprecation comments:
  - CellContentRenderer.tsx
  - TextVariableCellRenderer.tsx
  - NumberVariableCellRenderer.tsx
  - DateVariableCellRenderer.tsx
  - SelectVariableCellRenderer.tsx
  - ReadyStatusCellRenderer.tsx

### Phase 4: Renderer Library (PARTIAL)
- ✓ Created directory structure: `renderers/{headers,filters,view,edit,template}`
- ✓ Implemented `BaseHeaderRenderer` component
- ✓ Implemented `TextFilterPopover` component
- ✓ Implemented `NumberFilterPopover` component
- ✓ Implemented `TextViewRenderer` component
- ✓ Implemented `TextEditRenderer` component
- ✓ Created basic `index.ts` export file

## Still TODO ⏳

### Phase 4: Renderer Library (REMAINING)

#### Filter Popovers
- [ ] DateFilterPopover
- [ ] SelectFilterPopover
- [ ] BooleanFilterPopover

#### View Renderers
- [ ] NumberViewRenderer
- [ ] DateViewRenderer
- [ ] BooleanViewRenderer
- [ ] SelectViewRenderer
- [ ] CountryViewRenderer
- [ ] PhoneViewRenderer

#### Edit Renderers
- [ ] NumberEditRenderer
- [ ] DateEditRenderer
- [ ] BooleanEditRenderer
- [ ] SelectEditRenderer
- [ ] CountryEditRenderer
- [ ] PhoneEditRenderer

#### Template Renderers
- [ ] TemplateTextRenderers (view + edit)
- [ ] TemplateNumberRenderers (view + edit)
- [ ] TemplateDateRenderers (view + edit)
- [ ] TemplateSelectRenderers (view + edit)
- [ ] ReadyStatusViewRenderer

#### Header Utilities
- [ ] createSimpleHeader
- [ ] createSortableHeader
- [ ] createFilterableHeader

### Phase 5: Consumer Updates
- [ ] Update `buildDataColumns.ts` to use new renderer API
- [ ] Update `client/views/student/column.ts` and `useStudentTable.tsx`
- [ ] Update `RecipientVariableDataTable.tsx`
- [ ] Update `StudentsInGroupTable.tsx`
- [ ] Update `StudentsNotInGroupTable.tsx`
- [ ] Update `TableBody.tsx` component
- [ ] Update `TableHeader.tsx` component to work with new API

### Phase 6: Finalization
- [ ] Complete `renderers/index.ts` with all exports
- [ ] Add performance optimizations (React.memo, useCallback, useMemo)
- [ ] Mark remaining old filter popovers as deprecated
- [ ] Update locale strings (add missing pinLeft, pinRight, unpin, hide)
- [ ] Run full test suite
- [ ] Fix remaining TypeScript errors

## Known Issues

### TypeScript Errors (66 total)
The following files still have TypeScript errors because they use the old API:
- `ColumnVisibilityPanel.tsx` - accessing `column.label`
- `TableHeader.tsx` - accessing `column.filterable`, `column.type`, `column.label`
- `CellContentRenderer.tsx` and deprecated renderers - importing deleted types
- `buildDataColumns.ts` - using old `ColumnTypes` enum
- `student/column.ts` - importing deleted `BaseColumn` type
- Various consumer files - using non-generic `EditableColumn` type

These will be resolved in Phase 5 when we update the consumers.

### Linting Warnings
- Minor `@typescript-eslint/no-explicit-any` warnings in generic type definitions (expected)
- All unused variable warnings have been fixed

## Next Steps

1. **Complete Phase 4**: Implement remaining renderer components
   - Priority: Date, Number, Boolean, and Select renderers (most commonly used)
   - Template renderers can be done after basic renderers

2. **Start Phase 5**: Update one consumer at a time
   - Start with `buildDataColumns.ts` as a reference implementation
   - Then update student tables
   - Finally update recipient tables

3. **Fix TableHeader.tsx**: This is a critical file that needs updating to work with the new API

4. **Update Locale**: Add missing locale strings for column operations

## Testing Plan

Once consumers are updated, test:
- [ ] Column rendering with custom renderers
- [ ] Editing functionality
- [ ] Validation in edit mode
- [ ] Sorting
- [ ] Filtering (all types)
- [ ] Column resizing
- [ ] Column pinning
- [ ] Column hiding/showing
- [ ] Pagination
- [ ] Row selection
- [ ] Virtualization

## Migration Guide for Consumers

### Old API:
```typescript
{
  id: 'name',
  type: ColumnTypes.text,
  label: 'Name',
  accessor: 'name',
  editable: true,
  sortable: true,
  filterable: true,
  onUpdate: handleUpdate,
}
```

### New API:
```typescript
{
  id: 'name',
  type: 'editable',
  headerRenderer: ({ column }) => (
    <BaseHeaderRenderer
      column={column}
      label="Name"
      onSort={handleSort}
      onFilter={handleFilter}
      sortDirection={sortDirection}
      isFiltered={isFiltered}
      filterPopoverRenderer={() => <TextFilterPopover ... />}
    />
  ),
  viewRenderer: ({ row }) => <TextViewRenderer value={row.name} />,
  editRenderer: ({ row, onSave, onCancel }) => (
    <TextEditRenderer
      value={row.name}
      onSave={onSave}
      onCancel={onCancel}
      validator={validateName}
    />
  ),
  onUpdate: handleUpdate,
}
```


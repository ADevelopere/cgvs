# Table Component Refactor Progress

## Completed ✓

### Phase 1: Type System (COMPLETE) ✅

- ✓ Updated `table.type.ts` with new generic types
  - New `Column<TRowData>` for view-only columns
  - New `EditableColumn<TRowData>` for editable columns
  - New `AnyColumn<TRowData>` union type
  - Added `isEditableColumn` type guard
  - Removed old `ColumnTypes` enum and type-specific properties

### Phase 2: Contexts (COMPLETE) ✅

- ✓ Made `TableContext` generic with `<TRowData>`
- ✓ Made `TableColumnContext` generic with `<TRowData>`
- ✓ Made `TableDataContext` generic with `<TRowData>`
- ✓ Made `TableRowsContext` generic with `<TRowData>`
- ✓ Updated all context hooks to use generics
- ✓ Simplified `applyFilter` to remove type-specific logic

### Phase 3: Core Components (COMPLETE) ✅

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

### Phase 4: Renderer Library (COMPLETE) ✅

#### Directory Structure ✓

- ✓ Created `renderers/{headers,filters,view,edit,template}` directories

#### Headers ✓

- ✓ BaseHeaderRenderer component

#### Filter Popovers ✓

- ✓ TextFilterPopover
- ✓ NumberFilterPopover
- ✓ DateFilterPopover

#### View Renderers ✓

- ✓ TextViewRenderer
- ✓ NumberViewRenderer
- ✓ DateViewRenderer
- ✓ BooleanViewRenderer
- ✓ SelectViewRenderer

#### Edit Renderers ✓

- ✓ TextEditRenderer
- ✓ NumberEditRenderer
- ✓ DateEditRenderer
- ✓ BooleanEditRenderer
- ✓ SelectEditRenderer

#### Exports ✓

- ✓ Updated `renderers/index.ts` with all exports

**Note:** Template renderers removed per user request - basic renderers will be used instead.
**Note:** Country and Phone renderers skipped - can be added later if needed.

## Still TODO ⏳

### Phase 5: Consumer Updates (CRITICAL - NEXT PRIORITY)

#### Step 1: Update TableHeader.tsx (BLOCKER)

- [ ] **CRITICAL:** `TableHeader.tsx` needs updating to work with new API
  - Remove direct access to `column.label`, `column.filterable`, `column.type`
  - Update column rendering to use `headerRenderer`
  - This is blocking other consumers

#### Step 2: Update buildDataColumns.ts (REFERENCE IMPLEMENTATION)

- [ ] Convert `buildDataColumns.ts` to use new renderer API
  - Change return type to `AnyColumn<RecipientWithVariableValues>[]`
  - Remove `type: ColumnTypes` → use `type: 'viewonly' | 'editable'`
  - Add `headerRenderer` using `BaseHeaderRenderer`
  - Add `viewRenderer` and `editRenderer`
  - This will serve as a reference for other consumers

#### Step 3: Update Other Consumers

- [ ] Update `client/views/student/column.ts` and `useStudentTable.tsx`
- [ ] Update `RecipientVariableDataTable.tsx`
- [ ] Update `StudentsInGroupTable.tsx`
- [ ] Update `StudentsNotInGroupTable.tsx`
- [ ] Update `TableBody.tsx` component
- [ ] Update `ColumnVisibilityPanel.tsx` (remove `column.label` access)

### Phase 6: Finalization

- [ ] Add missing locale strings (pinLeft, pinRight, unpin, hide)
- [ ] Mark old filter popovers as deprecated
- [ ] Run full test suite
- [ ] Fix remaining TypeScript errors
- [ ] Performance audit and optimizations

## Current Status

### TypeScript Errors: ~66

The following files still have TypeScript errors because they use the old API:

- `ColumnVisibilityPanel.tsx` - accessing `column.label`
- `TableHeader.tsx` - accessing `column.filterable`, `column.type`, `column.label` **← BLOCKER**
- `CellContentRenderer.tsx` and deprecated renderers - importing deleted types
- `buildDataColumns.ts` - using old `ColumnTypes` enum
- `student/column.ts` - importing deleted `BaseColumn` type
- Various consumer files - using non-generic `EditableColumn` type

### Linting: ✅ Clean

All new renderer files pass linting checks.

## Implementation Progress: ~65% Complete

✅ **Completed:**

- Type System (Phase 1)
- Contexts (Phase 2)
- Core Components (Phase 3)
- Renderer Library (Phase 4)

⏳ **In Progress:**

- Consumer Updates (Phase 5) - **NEEDS TO START**

❌ **Not Started:**

- Finalization (Phase 6)

## Next Steps (Priority Order)

### 1. Update TableHeader.tsx (HIGHEST PRIORITY - BLOCKER)

This file is preventing compilation and needs immediate attention:

- Remove references to `column.label`, `column.filterable`, `column.type`
- The file needs to work with the new renderer-based API
- Without this fix, other consumers cannot be properly tested

### 2. Create Reference Implementation

Update `buildDataColumns.ts` as a reference implementation showing how to:

- Define columns with `headerRenderer`, `viewRenderer`, `editRenderer`
- Integrate with `BaseHeaderRenderer`
- Use filter popovers
- Handle sorting and filtering

### 3. Systematic Consumer Updates

Once we have a reference implementation and TableHeader is fixed:

- Update student table columns
- Update recipient table columns
- Test each consumer as it's updated

### 4. Add Missing Locale Strings

Add to locale files:

```typescript
{
  pinLeft: 'Pin Left',
  pinRight: 'Pin Right',
  unpin: 'Unpin',
  hide: 'Hide',
}
```

## Migration Example

### Before (Old API):

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

### After (New API):

```typescript
{
  id: 'name',
  type: 'editable',
  headerRenderer: ({ column }) => (
    <BaseHeaderRenderer
      column={column}
      label="Name"
      onSort={() => handleSort('name')}
      onFilter={(e) => setFilterAnchor(e.currentTarget)}
      sortDirection={getSortDirection('name')}
      isFiltered={!!getActiveTextFilter('name')}
      filterPopoverRenderer={() => (
        <TextFilterPopover
          anchorEl={filterAnchor}
          open={activeFilter === 'name'}
          onClose={() => setFilterAnchor(null)}
          columnId="name"
          columnLabel="Name"
          value={getActiveTextFilter('name')}
          onApply={applyTextFilter}
          onClear={() => clearFilter('name')}
        />
      )}
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
- [ ] Edit state persistence during virtualization

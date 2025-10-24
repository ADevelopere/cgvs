<!-- 29a891ca-c78a-46bc-b30e-2277a08f39a3 79723f56-9407-4f78-be1c-0c8c8aff078c -->
# Table Component Restructure Plan

## Status: Types Already Migrated ✓

- `types/` directory created with 4 files
- Old `table.type.ts` deleted
- Old `TableHeader/types.ts` deleted
- Type imports already updated

## Phase 1: Create Directory Structure (Terminal)

Create new directories:

```bash
mkdir -p client/components/Table/contexts
mkdir -p client/components/Table/core
mkdir -p client/components/Table/components/cells
mkdir -p client/components/Table/components/header
mkdir -p client/components/Table/components/panels
mkdir -p client/components/Table/utils
```

## Phase 2: Move Context Files (Terminal)

Move all context files from `Table/` to `contexts/`:

```bash
git mv client/components/Table/Table/TableContext.tsx client/components/Table/contexts/
git mv client/components/Table/Table/TableColumnContext.tsx client/components/Table/contexts/
git mv client/components/Table/Table/TableDataContext.tsx client/components/Table/contexts/
git mv client/components/Table/Table/TableRowsContext.tsx client/components/Table/contexts/
```

## Phase 3: Move Core Components (Terminal)

Move main table components to `core/`:

```bash
git mv client/components/Table/Table/Table.tsx client/components/Table/core/
git mv client/components/Table/TableHeader/TableHeader.tsx client/components/Table/core/
git mv client/components/Table/TableBody/TableBody.tsx client/components/Table/core/
git mv client/components/Table/TableFooter/TableFooter.tsx client/components/Table/core/
```

## Phase 4: Move Cell Components (Terminal)

Move cell-related components to `components/cells/`:

```bash
git mv client/components/Table/TableBody/DataCell.tsx client/components/Table/components/cells/
git mv client/components/Table/TableBody/DataRow.tsx client/components/Table/components/cells/
```

## Phase 5: Move Header Components (Terminal)

Move header-related components to `components/header/`:

```bash
git mv client/components/Table/TableHeader/ColumnHeaderCell.tsx client/components/Table/components/header/
git mv client/components/Table/TableHeader/ColumnOptionsMenu.tsx client/components/Table/components/header/
git mv client/components/Table/TableHeader/ResizeHandle.tsx client/components/Table/components/header/
```

## Phase 6: Move Panel Components (Terminal)

Move panel components:

```bash
git mv client/components/Table/Table/ColumnVisibilityPanel.tsx client/components/Table/components/panels/
```

## Phase 7: Move Utils (Terminal)

Move utility files:

```bash
git mv client/components/Table/TableHeader/utils.ts client/components/Table/utils/header.utils.ts
```

## Phase 8: Delete Duplicate Filters (Terminal)

Delete duplicate filter popovers from TableHeader (keep ones in `renderers/filters/`):

```bash
rm client/components/Table/TableHeader/FilterPopover.tsx
rm client/components/Table/TableHeader/TextFilterPopover.tsx
rm client/components/Table/TableHeader/NumberFilterPopover.tsx
rm client/components/Table/TableHeader/DateFilterPopover.tsx
```

## Phase 9: Clean Up Empty Directories (Terminal)

Remove now-empty directories:

```bash
rmdir client/components/Table/Table
rmdir client/components/Table/TableBody
rmdir client/components/Table/TableHeader
rmdir client/components/Table/TableFooter
```

## Phase 10: Create Barrel Exports

Create `types/index.ts`:

```typescript
export * from './column.type';
export * from './table.types';
export * from './filter.types';
export * from './header.types';
```

Create `contexts/index.ts`:

```typescript
export * from './TableContext';
export * from './TableColumnContext';
export * from './TableDataContext';
export * from './TableRowsContext';
```

Create `core/index.ts`:

```typescript
export { default as Table } from './Table';
export { default as TableHeader } from './TableHeader';
export { default as TableBody } from './TableBody';
export { default as TableFooter } from './TableFooter';
```

Create `components/cells/index.ts`:

```typescript
export { default as DataCell } from './DataCell';
export { default as DataRow } from './DataRow';
```

Create `components/header/index.ts`:

```typescript
export { default as ColumnHeaderCell } from './ColumnHeaderCell';
export { default as ColumnOptionsMenu } from './ColumnOptionsMenu';
export { default as ResizeHandle } from './ResizeHandle';
```

Create `components/panels/index.ts`:

```typescript
export { default as ColumnVisibilityPanel } from './ColumnVisibilityPanel';
```

Create `components/index.ts`:

```typescript
export * from './cells';
export * from './header';
export * from './panels';
```

Create `utils/index.ts`:

```typescript
export * from './header.utils';
```

Update `renderers/index.ts` to include filters:

```typescript
// Headers
export * from './headers/BaseHeaderRenderer';

// Filters
export { default as TextFilterPopover } from './filters/TextFilterPopover';
export { default as NumberFilterPopover } from './filters/NumberFilterPopover';
export { default as DateFilterPopover } from './filters/DateFilterPopover';

// View Renderers (existing exports)
// Edit Renderers (existing exports)
```

## Phase 11: Update Internal Imports

Update imports within Table directory components to use new paths:

**Files needing import updates:**

1. `core/Table.tsx` - Update context imports
2. `core/TableHeader.tsx` - Update to use filter popovers from `renderers/filters/`, header components from `components/header/`, utils from `utils/`
3. `core/TableBody.tsx` - Update cell component imports
4. `components/cells/DataCell.tsx` - Update type imports, context imports
5. `components/cells/DataRow.tsx` - Update type imports, context imports
6. `components/header/ColumnHeaderCell.tsx` - Update type imports, filter imports from `renderers/filters/`
7. `components/header/ColumnOptionsMenu.tsx` - Update type imports
8. `components/panels/ColumnVisibilityPanel.tsx` - Update context imports
9. All context files in `contexts/` - Update type imports to `../types/`

## Phase 12: Update External Imports

Update imports in files outside Table directory (20 files found):

**Template views:**

- `client/views/template/manage/data/components/cellRenderers/*.tsx` (5 files)
- `client/views/template/manage/data/columns/buildDataColumns.ts`
- `client/views/template/manage/data/RecipientVariableDataTable.tsx`
- `client/views/template/manage/recipient/columns.ts`
- `client/views/template/manage/recipient/StudentsNotInGroupTable.tsx`
- `client/views/template/manage/recipient/StudentsInGroupTable.tsx`

**Student views:**

- `client/views/student/hook/utils/filter.ts`
- `client/views/student/useStudentTable.tsx`
- `client/views/student/column.ts`
- `client/views/student/StudentTable.tsx`

Update to use new barrel exports from `client/components/Table` main index.

## Phase 13: Create Main Barrel Export

Create/update `client/components/Table/index.ts`:

```typescript
// Main Table component
export { default as Table } from './core/Table';

// Core components (if needed externally)
export * from './core';

// Types
export type * from './types';

// Contexts
export * from './contexts';

// Renderers (including filters)
export * from './renderers';

// Components
export * from './components';

// Utils (if needed externally)
export * from './utils';
```

## Phase 14: Verification

1. Run linter: `~/.bun/bin/bun lint`
2. Run TypeScript check: `~/.bun/bin/bun tsc`
3. Fix any import errors
4. Test table functionality in the application

## Summary of Changes

- **Created:** 8 new directories (contexts, core, components/{cells,header,panels}, utils)
- **Moved:** 16 files to new locations
- **Deleted:** 4 duplicate filter files
- **Created:** 9 barrel export files (index.ts)
- **Updated:** ~36 files with new import paths (16 internal + 20 external)

### To-dos

- [ ] Create new directory structure (contexts, core, components, utils)
- [ ] Move context files from Table/ to contexts/ using git mv
- [ ] Move core components (Table, TableHeader, TableBody, TableFooter) to core/
- [ ] Move cell components (DataCell, DataRow) to components/cells/
- [ ] Move header components (ColumnHeaderCell, ColumnOptionsMenu, ResizeHandle) to components/header/
- [ ] Move ColumnVisibilityPanel to components/panels/
- [ ] Move utils.ts to utils/header.utils.ts
- [ ] Delete duplicate filter popovers from TableHeader/
- [ ] Remove empty directories (Table/, TableBody/, TableHeader/, TableFooter/)
- [ ] Create index.ts barrel exports in all new directories
- [ ] Update imports within Table directory (~16 files)
- [ ] Update imports in external files (template views, student views - 20 files)
- [ ] Create/update main index.ts for Table component
- [ ] Run linter and TypeScript checks, fix any errors
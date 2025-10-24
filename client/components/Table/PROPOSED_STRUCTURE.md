# Table Component - Proposed Restructure

## Current Issues

1. **Duplicate filter popovers** - Filter components exist in both `renderers/filters/` and `TableHeader/`
2. **Scattered types** - Types spread across `table.type.ts`, `TableHeader/types.ts`, and `TableHeader/utils.ts`
3. **Mixed concerns** - The `Table/` subdirectory mixes the main Table component with contexts and feature components
4. **Unclear hierarchy** - Related components are separated across multiple directories

## Proposed Structure

```
client/components/Table/
│
├── index.ts                          # Main export file
│
├── types/                            # All TypeScript types and interfaces
│   ├── index.ts                      # Barrel export
│   ├── column.types.ts               # Column definitions (from table.type.ts)
│   ├── table.types.ts                # Table-level types (PageInfo, LoadMoreParams, etc.)
│   ├── filter.types.ts               # Filter-related types
│   └── header.types.ts               # Header-related types (from TableHeader/types.ts)
│
├── contexts/                         # React contexts
│   ├── index.ts                      # Barrel export
│   ├── TableContext.tsx              # Main table context
│   ├── TableColumnContext.tsx        # Column management context
│   ├── TableDataContext.tsx          # Data management context
│   └── TableRowsContext.tsx          # Rows management context
│
├── core/                             # Core table components
│   ├── Table.tsx                     # Main Table component
│   ├── TableHeader.tsx               # Header component (from TableHeader/)
│   ├── TableBody.tsx                 # Body component (from TableBody/)
│   └── TableFooter.tsx               # Footer component (from TableFooter/)
│
├── components/                       # Feature components
│   │
│   ├── cells/                        # Cell-related components
│   │   ├── index.ts
│   │   ├── DataCell.tsx              # From TableBody/DataCell.tsx
│   │   └── DataRow.tsx               # From TableBody/DataRow.tsx
│   │
│   ├── header/                       # Header-related components
│   │   ├── index.ts
│   │   ├── ColumnHeaderCell.tsx      # From TableHeader/ColumnHeaderCell.tsx
│   │   ├── ColumnOptionsMenu.tsx     # From TableHeader/ColumnOptionsMenu.tsx
│   │   └── ResizeHandle.tsx          # From TableHeader/ResizeHandle.tsx
│   │
│   ├── filters/                      # Filter components (CONSOLIDATED)
│   │   ├── index.ts
│   │   ├── FilterPopover.tsx         # Base filter popover (from TableHeader/)
│   │   ├── TextFilterPopover.tsx     # Consolidated from both locations
│   │   ├── NumberFilterPopover.tsx   # Consolidated from both locations
│   │   └── DateFilterPopover.tsx     # Consolidated from both locations
│   │
│   └── panels/                       # Panel components
│       ├── index.ts
│       └── ColumnVisibilityPanel.tsx # From Table/ColumnVisibilityPanel.tsx
│
├── renderers/                        # Cell renderers
│   ├── index.ts                      # Barrel export with all renderers
│   │
│   ├── headers/                      # Header renderers
│   │   ├── index.ts
│   │   └── BaseHeaderRenderer.tsx
│   │
│   ├── view/                         # View mode renderers
│   │   ├── index.ts
│   │   ├── TextViewRenderer.tsx
│   │   ├── NumberViewRenderer.tsx
│   │   ├── DateViewRenderer.tsx
│   │   ├── BooleanViewRenderer.tsx
│   │   └── SelectViewRenderer.tsx
│   │
│   └── edit/                         # Edit mode renderers
│       ├── index.ts
│       ├── TextEditRenderer.tsx
│       ├── NumberEditRenderer.tsx
│       ├── DateEditRenderer.tsx
│       ├── BooleanEditRenderer.tsx
│       └── SelectEditRenderer.tsx
│
└── utils/                            # Utility functions
    ├── index.ts
    └── header.utils.ts               # From TableHeader/utils.ts
```

## Benefits of New Structure

### 1. Clear Separation of Concerns
- **types/** - All type definitions in one place
- **contexts/** - All React contexts grouped together
- **core/** - Core table components that form the main structure
- **components/** - Feature components organized by functionality
- **renderers/** - Cell rendering logic isolated
- **utils/** - Utility functions separate from components

### 2. Eliminated Duplication
- Filter popovers consolidated into single `components/filters/` directory
- No duplicate FilterPopover components
- Easier to maintain and update filters

### 3. Improved Discoverability
- Related components grouped together (cells, headers, filters, panels)
- Clear naming convention: feature-based directories
- Easy to find specific functionality

### 4. Better Scalability
- Easy to add new filter types in `components/filters/`
- New renderers go in appropriate `renderers/` subdirectory
- New utility functions in `utils/`
- New contexts in `contexts/`

### 5. Cleaner Imports
```typescript
// Before (confusing paths)
import { TextFilterPopover } from '../TableHeader/TextFilterPopover';
import { TextFilterPopover } from '../renderers/filters/TextFilterPopover'; // Wait, which one?

// After (clear and unambiguous)
import { TextFilterPopover } from '../components/filters';
import { TextViewRenderer } from '../renderers/view';
import { TableContext } from '../contexts';
import { ColumnType } from '../types';
```

### 6. Logical Component Hierarchy

```
Table (core component)
  ├─ TableHeader (core)
  │    ├─ ColumnHeaderCell (component)
  │    ├─ ResizeHandle (component)
  │    └─ FilterPopover (component)
  │
  ├─ TableBody (core)
  │    ├─ DataRow (component)
  │    └─ DataCell (component)
  │
  └─ TableFooter (core)
```

## Migration Strategy

### Phase 1: Create New Structure (No Breaking Changes)
1. Create new directory structure
2. Copy (don't move) files to new locations
3. Update imports within copied files
4. Test that everything works

### Phase 2: Update Imports
1. Update all imports throughout the codebase to use new paths
2. Use barrel exports (`index.ts`) for cleaner imports
3. Test thoroughly

### Phase 3: Clean Up
1. Remove duplicate files from old locations
2. Remove empty directories
3. Update documentation

## File Movement Map

### Types
```
table.type.ts                          → types/column.types.ts (column-related)
                                       → types/table.types.ts (PageInfo, etc.)
TableHeader/types.ts                   → types/header.types.ts
                                       → types/filter.types.ts (filter-related)
TableHeader/utils.ts                   → utils/header.utils.ts
```

### Contexts
```
Table/TableContext.tsx                 → contexts/TableContext.tsx
Table/TableColumnContext.tsx           → contexts/TableColumnContext.tsx
Table/TableDataContext.tsx             → contexts/TableDataContext.tsx
Table/TableRowsContext.tsx             → contexts/TableRowsContext.tsx
```

### Core Components
```
Table/Table.tsx                        → core/Table.tsx
TableHeader/TableHeader.tsx            → core/TableHeader.tsx
TableBody/TableBody.tsx                → core/TableBody.tsx
TableFooter/TableFooter.tsx            → core/TableFooter.tsx
```

### Feature Components
```
TableBody/DataCell.tsx                 → components/cells/DataCell.tsx
TableBody/DataRow.tsx                  → components/cells/DataRow.tsx

TableHeader/ColumnHeaderCell.tsx       → components/header/ColumnHeaderCell.tsx
TableHeader/ColumnOptionsMenu.tsx      → components/header/ColumnOptionsMenu.tsx
TableHeader/ResizeHandle.tsx           → components/header/ResizeHandle.tsx

Table/ColumnVisibilityPanel.tsx        → components/panels/ColumnVisibilityPanel.tsx
```

### Filters (Consolidation Required)
```
TableHeader/FilterPopover.tsx          → components/filters/FilterPopover.tsx
TableHeader/TextFilterPopover.tsx      → components/filters/TextFilterPopover.tsx (primary)
renderers/filters/TextFilterPopover.tsx → DELETE (duplicate)
TableHeader/NumberFilterPopover.tsx    → components/filters/NumberFilterPopover.tsx (primary)
renderers/filters/NumberFilterPopover.tsx → DELETE (duplicate)
TableHeader/DateFilterPopover.tsx      → components/filters/DateFilterPopover.tsx (primary)
renderers/filters/DateFilterPopover.tsx → DELETE (duplicate)
```

### Renderers (Keep Structure)
```
renderers/headers/                     → renderers/headers/ (no change)
renderers/view/                        → renderers/view/ (no change)
renderers/edit/                        → renderers/edit/ (no change)
renderers/index.ts                     → renderers/index.ts (update paths)
```

## Recommended Barrel Exports

### `client/components/Table/index.ts`
```typescript
// Main Table component
export { default as Table } from './core/Table';

// Types (most commonly used)
export type {
  AnyColumn,
  Column,
  EditableColumn,
  BaseColumnProps,
  PageInfo,
  LoadMoreParams,
} from './types';

// Contexts
export * from './contexts';

// Renderers
export * from './renderers';

// Components (selective exports)
export { ColumnVisibilityPanel } from './components/panels';
```

### `types/index.ts`
```typescript
export * from './column.types';
export * from './table.types';
export * from './filter.types';
export * from './header.types';
```

### `contexts/index.ts`
```typescript
export * from './TableContext';
export * from './TableColumnContext';
export * from './TableDataContext';
export * from './TableRowsContext';
```

### `renderers/index.ts`
```typescript
export * from './headers';
export * from './view';
export * from './edit';
```

### `components/filters/index.ts`
```typescript
export * from './FilterPopover';
export * from './TextFilterPopover';
export * from './NumberFilterPopover';
export * from './DateFilterPopover';
```

## Notes

1. **Before moving files**: Check for any external imports to ensure nothing breaks
2. **Consider using git mv**: To preserve file history during migration
3. **Update tests**: Any test files that import from Table components
4. **Documentation**: Update any documentation referencing old paths
5. **Code review**: Have the team review the structure before implementation

## Priority Order

1. **High Priority** - Consolidate duplicate filter popovers (reduce confusion)
2. **High Priority** - Move types to dedicated directory (improve maintainability)
3. **Medium Priority** - Reorganize contexts (clearer structure)
4. **Medium Priority** - Split core from feature components (better organization)
5. **Low Priority** - Create barrel exports (cleaner imports, can be done incrementally)


# Fix Table Linting Errors with Full Type Safety

## Overview

Complete type safety refactor to eliminate all `any`/`unknown` types and establish proper generic type flow. Remove filter/sort logic from contexts (handled by headerRenderer per the generic table plan).

## Documentation Created

- `TABLE_LINT_ERRORS_ANALYSIS.md` - Component hierarchy graph, error analysis, dependency graph
- `TABLE_TYPE_SAFETY_PLAN.md` - Complete type safety architecture and implementation plan

## Core Principles

1. ❌ NO `any` or `unknown` types
2. ❌ NO `Record<string, unknown>` casting  
3. ✅ Generic type parameters flow through entire hierarchy
4. ✅ Explicit type definitions where generics aren't applicable
5. ✅ Filter/sort removed from table contexts (handled by headerRenderer)

## Generic Type Parameters

```typescript
TRowData      // Row data type (e.g., Student)
TRowId        // Row ID type (string | number)
TColumnId     // Column ID type (string literal union)
TValue        // Cell value type per column
```

## Implementation Plan

### Phase 1: Update Type Definitions

**File: `client/components/Table/table.type.ts`**

1. Update `BaseColumnProps` to be generic with `TColumnId`:
   ```typescript
   export type BaseColumnProps<TColumnId extends string = string> = {
     id: TColumnId;
     // ... rest
   };
   ```

2. Update `Column` type to include `TRowData` and `TColumnId`:
   ```typescript
   export type Column<TRowData, TColumnId extends string = string> = 
     BaseColumnProps<TColumnId> & {
       type: "viewonly";
       headerRenderer: (props: { column: Column<TRowData, TColumnId> }) => React.ReactNode;
       viewRenderer: (props: { row: TRowData }) => React.ReactNode;
     };
   ```

3. Update `EditableColumn` to include `TRowData`, `TValue`, and `TColumnId`:
   ```typescript
   export type EditableColumn<TRowData, TValue, TColumnId extends string = string> = 
     BaseColumnProps<TColumnId> & {
       type: "editable";
       headerRenderer: (props: { column: EditableColumn<TRowData, TValue, TColumnId> }) => React.ReactNode;
       viewRenderer: (props: { row: TRowData }) => React.ReactNode;
       editRenderer: (props: {
         row: TRowData;
         onSave: (value: TValue) => Promise<void>;
         onCancel: () => void;
       }) => React.ReactNode;
       onUpdate?: (rowId: TRowData[keyof TRowData], value: TValue) => Promise<void>;
     };
   ```

4. Update `AnyColumn` union type:
   ```typescript
   export type AnyColumn<TRowData, TColumnId extends string = string, TValue = TRowData[keyof TRowData]> =
     | Column<TRowData, TColumnId>
     | EditableColumn<TRowData, TValue, TColumnId>;
   ```

5. Add explicit `PageInfo` type (from GraphQL schema)

### Phase 2: Refactor TableContext

**File: `client/components/Table/Table/TableContext.tsx`**

1. **REMOVE** all filter/sort related:

   - Remove `initialOrderBy` prop
   - Remove any filter state references
   - Remove any sort state references

2. Update `TableContextType`:
   ```typescript
   export type TableContextType<TRowData, TColumnId extends string = string> = {
     data: TRowData[];
     isLoading?: boolean;
     columns: AnyColumn<TRowData, TColumnId>[];
     pageInfo?: PageInfo | null;
     pageSize: number;
     setPageSize: (newPageSize: number) => void;
     onPageChange?: (newPage: number) => void;
     onRowsPerPageChange?: (newRowsPerPage: number) => void;
     rowsPerPageOptions?: number[];
     footerStartContent?: ReactNode;
     footerEndContent?: ReactNode;
     hideRowsPerPage?: boolean;
     compact?: boolean;
   };
   ```

3. Change `TableProvider` signature:

   - Line 70: Replace `<TRowData = any,>` with:
   ```typescript
   export const TableProvider = <
     TRowData,
     TRowId extends string | number = string | number,
     TColumnId extends string = string
   >
   ```


4. Update `TableProviderProps` to include generics and remove filter/sort props

5. Remove `initialOrderBy` from provider implementation (line 83, 108, 131)

### Phase 3: Refactor TableColumnContext

**File: `client/components/Table/Table/TableColumnContext.tsx`**

1. Update `TableColumnContextType`:
   ```typescript
   export type TableColumnContextType<TRowData, TColumnId extends string = string> = {
     allColumns: AnyColumn<TRowData, TColumnId>[];
     columnWidths: Record<TColumnId, number>;
     visibleColumns: AnyColumn<TRowData, TColumnId>[];
     hiddenColumns: TColumnId[];
     pinnedColumns: Record<TColumnId, PinPosition>;
     // ... methods with TColumnId parameter types
   };
   ```

2. Update `TableColumnsProviderProps`:
   ```typescript
   export type TableColumnsProviderProps<TRowData, TColumnId extends string = string> = {
     children: ReactNode;
     initialWidths: Record<TColumnId, number>;
     onResizeColumn?: (columnId: TColumnId, newWidth: number) => void;
     // ... other callbacks
   };
   ```

3. Update provider signature (Line 48-56)

4. **FIXED ERROR:** Line 38 unused `TRowData` will be used in the type definitions above

### Phase 4: Refactor TableDataContext  

**File: `client/components/Table/Table/TableDataContext.tsx`**

1. **DELETE** all filter/sort logic:

   - Remove `orderByClause` state and methods (lines 31-40)
   - Remove `filters` state and methods (lines 42-77)
   - Remove `tempFilterValues` state (lines 49-52)
   - Remove all filter helper methods (lines 54-76)
   - Remove `sort` and `getSortDirection` methods (lines 289-328)

2. Update `TableCellEditingState` to be generic:
   ```typescript
   export type TableCellEditingState<TValue> = {
     isEditing: boolean;
     tmpValue: TValue;  // Line 27: FIXED - was `any`, now `TValue`
     errorMessage: string | null;
   };
   ```

3. Simplify `TableDataContextType` to ONLY editing state:
   ```typescript
   export type TableDataContextType<TColumnId extends string = string> = {
     getEditingState: <TValue>(
       rowId: string | number,
       columnId: TColumnId
     ) => TableCellEditingState<TValue> | null;
     
     setEditingState: <TValue>(
       rowId: string | number,
       columnId: TColumnId,
       state: TableCellEditingState<TValue> | null
     ) => void;
   };
   ```

4. Update `TableDataProviderProps`:
   ```typescript
   export type TableDataProviderProps<TRowData, TColumnId extends string = string> = {
     children: React.ReactNode;
   };
   ```

5. **FIXED ERROR:** Line 93 unused `TRowData` will be used in props if needed, otherwise prefix with `_`

6. Simplify provider implementation to only manage editing state

### Phase 5: Refactor TableRowsContext

**File: `client/components/Table/Table/TableRowsContext.tsx`**

1. **REMOVE** unused `TValue` generic from `TableRowsContextType`:
   ```typescript
   // Line 19: FIXED ERROR - Remove TValue
   export type TableRowsContextType<TRowData, TRowId extends string | number> = {
     rowSelectionEnabled: boolean;
     isAllRowsSelected?: boolean;
     selectedRowIds: TRowId[];
     toggleAllRowsSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
     toggleRowSelection: (rowId: TRowId) => void;
     clearAllSelections: () => void;
     rowHeights: Record<TRowId, number>;
     resizeRowHeight: (rowId: TRowId, newHeight: number) => void;
     getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;
     totalRows: number;
     loadMoreRowsIfNeeded: (visibleStartIndex: number, visibleStopIndex: number) => Promise<void>;
     getRowId: (row: TRowData) => TRowId;
     enableRowResizing: boolean;
   };
   ```

2. Update `TableRowsProviderProps`:
   ```typescript
   export type TableRowsProviderProps<TRowData, TRowId extends string | number = string | number> = {
     children: ReactNode;
     onLoadMoreRows?: (params: LoadMoreParams) => Promise<void>;
     getRowStyle?: (rowData: TRowData, rowIndex: number) => React.CSSProperties;
     onRowResize?: (rowId: TRowId, newHeight: number) => void;
     getRowId: (row: TRowData) => TRowId;
     pageInfo?: PageInfo | null;
     totalRows?: number;
     pageSize?: number;
     rowSelectionEnabled?: boolean;
     enableRowResizing?: boolean;
     selectedRowIds?: TRowId[];
     onSelectionChange?: (selectedIds: TRowId[]) => void;
   };
   ```

3. Update provider signature and implementation

### Phase 6: Refactor Utility Functions

**File: `client/components/Table/TableHeader/utils.ts`**

1. **DELETE** all filter-related functions:

   - `getActiveTextFilter` (lines 15-39)
   - `getActiveNumberFilter` (lines 44-59)
   - `getActiveDateFilter` (lines 64-79)

2. Update `getSelectAllCheckboxState` with generics:
   ```typescript
   // Lines 84-100: FIXED - Replace `any[]` and `any` with generics
   export const getSelectAllCheckboxState = <TRowData, TRowId extends string | number>(
     data: TRowData[],
     selectedRowIds: TRowId[],
     getRowId: (row: TRowData) => TRowId
   ): boolean | null => {
     if (!data || data.length === 0 || !selectedRowIds) return false;
     
     const selectableRowIds = data.map(row => getRowId(row));
     const selectedCount = selectableRowIds.filter(id =>
       selectedRowIds.includes(id)
     ).length;
     
     if (selectedCount === 0) return false;
     if (selectedCount === selectableRowIds.length) return true;
     return null;
   };
   ```


### Phase 7: Refactor Renderer Components

**File: `client/components/Table/renderers/edit/SelectEditRenderer.tsx`**

1. Add generic type parameter:
   ```typescript
   export interface SelectEditRendererProps<TValue> {
     value: TValue;  // Line 6: FIXED
     options: Array<{ label: string; value: TValue }>;  // Line 8: FIXED
     onSave: (value: TValue) => Promise<void>;  // Line 10: FIXED
     onCancel: () => void;
   }
   
   export const SelectEditRenderer = <TValue,>({
     value,
     options,
     onSave,
     onCancel,
   }: SelectEditRendererProps<TValue>): JSX.Element => {
     // ...
   ```

2. Fix event handler type:
   ```typescript
   // Line 28: FIXED - Use SelectChangeEvent from MUI
   const handleChange = useCallback(
     async (event: SelectChangeEvent<TValue>) => {
       const newValue = event.target.value as TValue;
       // ...
     },
     [onSave, isSaving]
   );
   ```


**File: `client/components/Table/renderers/view/SelectViewRenderer.tsx`**

1. Add generic type parameter:
   ```typescript
   export interface SelectViewRendererProps<TValue> {
     value: TValue;  // Line 6: FIXED
     options: Array<{ label: string; value: TValue }>;  // Line 8: FIXED
     tooltip?: boolean;
   }
   
   export const SelectViewRenderer = <TValue,>({
     value,
     options,
     tooltip = true,
   }: SelectViewRendererProps<TValue>): JSX.Element => {
     // ...
   ```


**File: `client/components/Table/TableBody/CellContentRenderer.tsx`**

- **SKIP** - Already marked as deprecated, will be removed later

## Verification Steps

After all changes:

1. **Run Linter:**
   ```bash
   ~/.bun/bin/bun lint client/components/Table
   ```


Expected: 0 errors, 0 warnings

2. **Run TypeScript Check:**
   ```bash
   ~/.bun/bin/bun tsc
   ```


Expected: 0 errors (may need to fix consuming code)

3. **Check Each File:**

   - `table.type.ts` - ✅ No errors
   - `TableContext.tsx` - ✅ No errors (was 1 warning)
   - `TableColumnContext.tsx` - ✅ No errors (was 1 error)
   - `TableDataContext.tsx` - ✅ No errors (was 1 error + 1 warning)
   - `TableRowsContext.tsx` - ✅ No errors (was 1 error)
   - `TableHeader/utils.ts` - ✅ No errors (was 4 warnings)
   - `renderers/edit/SelectEditRenderer.tsx` - ✅ No errors (was 4 warnings)
   - `renderers/view/SelectViewRenderer.tsx` - ✅ No errors (was 2 warnings)
   - `CellContentRenderer.tsx` - ⏭️ Skipped (deprecated)

## Expected Results

**Before:** 19 problems (3 errors, 16 warnings)

**After:** 0 problems (0 errors, 0 warnings)

**Files Fixed:**

- 3 TypeScript errors → ✅ Fixed
- 16 any/unknown warnings → ✅ Fixed  
- 1 deprecated file → ⏭️ Skipped

## Breaking Changes for Consumers

Consumers will need to:

1. Add generic type parameters to `TableProvider`
2. Remove filter/sort props from `TableProvider`
3. Implement filter/sort in custom `headerRenderer` functions
4. Update column definitions to use new generic types

## To-dos

- [ ] Phase 1: Update table.type.ts with generic column types
- [ ] Phase 2: Refactor TableContext - remove filter/sort, add generics
- [ ] Phase 3: Refactor TableColumnContext - add generics
- [ ] Phase 4: Refactor TableDataContext - remove filter/sort, fix tmpValue
- [ ] Phase 5: Refactor TableRowsContext - remove unused TValue
- [ ] Phase 6: Refactor utils.ts - delete filter functions, add generics
- [ ] Phase 7: Refactor renderers - add generic TValue
- [ ] Verify: Run lint and tsc - expect 0 errors/warnings
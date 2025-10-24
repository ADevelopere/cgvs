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

```typescript
type BaseColumnProps = {
  id: string;
  resizable?: boolean;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  widthStorageKey?: string;
};

type Column<TRowData> = BaseColumnProps & {
  type: 'viewonly';
  headerRenderer: (props: { column: Column<TRowData> }) => React.ReactNode;
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;
};

type EditableColumn<TRowData> = BaseColumnProps & {
  type: 'editable';
  headerRenderer: (props: { column: EditableColumn<TRowData> }) => React.ReactNode;
  viewRenderer: (props: { row: TRowData }) => React.ReactNode;
  editRenderer: (props: {
    row: TRowData;
    onSave: (value: unknown) => Promise<void>;
    onCancel: () => void;
  }) => React.ReactNode;
  onUpdate?: (rowId: number, value: unknown) => Promise<void>;
};

type AnyColumn<TRowData> = Column<TRowData> | EditableColumn<TRowData>;
```

### 2. Make All Contexts Generic

**Files to update:**

- `TableContext.tsx` → `TableProvider<TRowData>`
- `TableColumnContext.tsx` → `TableColumnsProvider<TRowData>`
- `TableDataContext.tsx` → `TableDataProvider<TRowData>`
- `TableRowsContext.tsx` → `TableRowsProvider<TRowData>`

Update all to use `columns: AnyColumn<TRowData>[]` and `data: TRowData[]`

## Refactor Core Table Components

### 3. Update `TableHeader/ColumnHeaderCell.tsx`

**Remove:**

- All filter handling logic
- All sort handling logic (keep only the callback to pass to headerRenderer)
- Filter icon rendering
- Sort icon rendering

**Keep:**

- Resize handle rendering
- Options menu (three-dot menu for pinning, hiding, etc.)
- Call `column.headerRenderer({ column })` to render the header content

**New Structure:**

```typescript
const ColumnHeaderCell = <TRowData,>({ column, ... }) => {
  return (
    <StyledTh>
      <HeaderContainer>
        <HeaderInner>
          {/* Render custom header */}
          {column.headerRenderer({ column })}
          
          {/* Table-managed options menu */}
          <HeaderIconButton onClick={handleOptionsClick}>
            <MoreVert fontSize="small" />
          </HeaderIconButton>
        </HeaderInner>
        {column.resizable !== false && <ResizeHandle onResize={handleResizeStart} />}
      </HeaderContainer>
    </StyledTh>
  );
};
```

### 4. Update `TableBody/DataCell.tsx`

**Remove:**

- All built-in rendering logic
- `CellContentRenderer` usage

**New Structure:**

```typescript
const DataCell = <TRowData,>({ column, row, ... }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = useCallback(async (value: unknown) => {
    if (column.type === 'editable' && column.onUpdate) {
      await column.onUpdate(rowId, value);
    }
    setIsEditing(false);
  }, [column, rowId]);
  
  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  return (
    <td onDoubleClick={() => column.type === 'editable' && setIsEditing(true)}>
      <div style={cellStyle}>
        {isEditing && column.type === 'editable'
          ? column.editRenderer({ row, onSave: handleSave, onCancel: handleCancel })
          : column.viewRenderer({ row })}
      </div>
    </td>
  );
};
```

### 5. Delete `TableBody/CellContentRenderer.tsx`

Remove this file entirely as rendering is now handled by custom renderers.

## Create Reusable Renderer Utilities

### 6. Create `client/components/Table/renderers/` Directory Structure

```
renderers/
├── headers/
│   ├── BaseHeaderRenderer.tsx
│   ├── createSortableHeader.tsx
│   ├── createFilterableHeader.tsx
│   └── createSimpleHeader.tsx
├── view/
│   ├── TextViewRenderer.tsx
│   ├── NumberViewRenderer.tsx
│   ├── DateViewRenderer.tsx
│   ├── BooleanViewRenderer.tsx
│   ├── SelectViewRenderer.tsx
│   ├── CountryViewRenderer.tsx
│   └── PhoneViewRenderer.tsx
├── edit/
│   ├── TextEditRenderer.tsx
│   ├── NumberEditRenderer.tsx
│   ├── DateEditRenderer.tsx
│   ├── BooleanEditRenderer.tsx
│   ├── SelectEditRenderer.tsx
│   ├── CountryEditRenderer.tsx
│   └── PhoneEditRenderer.tsx
├── template/
│   ├── TemplateTextRenderers.tsx (view + edit)
│   ├── TemplateNumberRenderers.tsx (view + edit)
│   ├── TemplateDateRenderers.tsx (view + edit)
│   ├── TemplateSelectRenderers.tsx (view + edit)
│   └── ReadyStatusViewRenderer.tsx
└── index.ts
```

### 7. Implement BaseHeaderRenderer Component

**File: `renderers/headers/BaseHeaderRenderer.tsx`**

This is the optional base component with 3 slots:

```typescript
type BaseHeaderRendererProps<TRowData> = {
  column: AnyColumn<TRowData>;
  label: React.ReactNode; // Can be a component, not just text
  onSort?: () => void;
  onFilter?: () => void;
  filterPopoverRenderer?: () => React.ReactNode;
  sortDirection?: 'ASC' | 'DESC' | null;
  isFiltered?: boolean;
};

const BaseHeaderRenderer = <TRowData,>({
  label,
  onSort,
  onFilter,
  filterPopoverRenderer,
  sortDirection,
  isFiltered,
}: BaseHeaderRendererProps<TRowData>) => {
  return (
    <HeaderContent>
      <ColumnLabel>{label}</ColumnLabel>
      <IconsContainer>
        {onSort && (
          <Tooltip title="Sort">
            <HeaderIconButton onClick={onSort}>
              {sortDirection === 'ASC' ? <ArrowUpward /> : 
               sortDirection === 'DESC' ? <ArrowDownward /> : 
               <UnfoldMore />}
            </HeaderIconButton>
          </Tooltip>
        )}
        {onFilter && (
          <>
            <Badge invisible={!isFiltered} color="primary" variant="dot">
              <HeaderIconButton onClick={onFilter}>
                <FilterList />
              </HeaderIconButton>
            </Badge>
            {filterPopoverRenderer && filterPopoverRenderer()}
          </>
        )}
      </IconsContainer>
    </HeaderContent>
  );
};
```

### 8. Implement View Renderers

Extract from `CellContentRenderer.tsx`:

- `TextViewRenderer` - simple text display with ellipsis
- `NumberViewRenderer` - number formatting
- `DateViewRenderer` - date formatting
- `BooleanViewRenderer` - checkbox display
- `SelectViewRenderer` - option label display
- `CountryViewRenderer` - flag + country name (from existing code)
- `PhoneViewRenderer` - phone number in LTR

Each with `useCallback` and `useMemo` where appropriate.

### 9. Implement Edit Renderers

Extract from `CellContentRenderer.tsx`:

- `TextEditRenderer` - TextField with validation
- `NumberEditRenderer` - Number input
- `DateEditRenderer` - Date picker
- `BooleanEditRenderer` - Checkbox/Switch
- `SelectEditRenderer` - Select dropdown
- `CountryEditRenderer` - Autocomplete with flags (from existing code)
- `PhoneEditRenderer` - MuiTelInput (from existing code)

All renderers receive `{ row, onSave, onCancel }` props.

### 10. Implement Template Renderers

Create new generic versions in `renderers/template/`:

- **TemplateTextRenderers** - Based on `TextVariableCellRenderer.tsx`
  - Export `TemplateTextViewRenderer` and `TemplateTextEditRenderer`
  - Convert to use new API: receive `row` and extract value
  - Pass validation constraints as parameters/config

- **TemplateNumberRenderers** - Based on `NumberVariableCellRenderer.tsx`
  - Export `TemplateNumberViewRenderer` and `TemplateNumberEditRenderer`

- **TemplateDateRenderers** - Based on `DateVariableCellRenderer.tsx`
  - Export `TemplateDateViewRenderer` and `TemplateDateEditRenderer`

- **TemplateSelectRenderers** - Based on `SelectVariableCellRenderer.tsx`
  - Export `TemplateSelectViewRenderer` and `TemplateSelectEditRenderer`

- **ReadyStatusViewRenderer** - Based on `ReadyStatusCellRenderer.tsx`
  - Non-editable, view-only renderer

All using `useCallback` and `useMemo` for optimization.

## Update All Consumers

### 11. Update `client/views/template/manage/data/columns/buildDataColumns.ts`

Convert from old API to new renderer-based API:

```typescript
export const buildDataColumns = (
  variables: Graphql.TemplateVariable[],
  strings: RecipientVariableDataTranslation,
  onUpdateCell: (rowId: number, columnId: string, value: unknown) => Promise<void>
): AnyColumn<RecipientWithVariableValues>[] => {
  
  const columns: AnyColumn<RecipientWithVariableValues>[] = [
    {
      id: "studentName",
      type: "viewonly",
      resizable: true,
      initialWidth: 200,
      widthStorageKey: "recipient_variable_data_student_name_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          label={strings.studentName}
          onSort={() => { /* sort handler */ }}
        />
      ),
      viewRenderer: ({ row }) => (
        <TextViewRenderer value={row.studentName} />
      ),
    },
    // ... variable columns
  ];
  
  // For each variable, create column with appropriate renderers
  sortedVariables.forEach(variable => {
    columns.push({
      id: `var_${variable.id}`,
      type: "editable",
      resizable: true,
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer label={variable.name || `Variable ${variable.id}`} />
      ),
      viewRenderer: ({ row }) => {
        const value = row.variableValues?.[variable.id];
        switch(variable.type) {
          case "TEXT": return <TemplateTextViewRenderer value={value} config={variable} />;
          case "NUMBER": return <TemplateNumberViewRenderer value={value} config={variable} />;
          // ...
        }
      },
      editRenderer: ({ row, onSave, onCancel }) => {
        const value = row.variableValues?.[variable.id];
        switch(variable.type) {
          case "TEXT": return <TemplateTextEditRenderer value={value} onSave={onSave} onCancel={onCancel} config={variable} />;
          // ...
        }
      },
      onUpdate: (rowId, value) => onUpdateCell(rowId, `var_${variable.id}`, value),
    });
  });
  
  return columns;
};
```

### 12. Update `client/views/student/column.ts` + `useStudentTable.tsx`

Convert static column definitions to use new renderer API:

```typescript
export const buildStudentColumns = (
  strings: StudentTranslations,
  onUpdate: (rowId: number, field: string, value: unknown) => Promise<void>
): AnyColumn<Student>[] => [
  {
    id: "name",
    type: "editable",
    resizable: true,
    widthStorageKey: "student_table_student_name_column_width",
    headerRenderer: ({ column }) => (
      <BaseHeaderRenderer
        label={strings.name}
        onSort={/* sort handler */}
        onFilter={/* filter handler */}
        filterPopoverRenderer={/* custom text filter */}
      />
    ),
    viewRenderer: ({ row }) => <TextViewRenderer value={row.name} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <TextEditRenderer 
        value={row.name}
        onSave={onSave}
        onCancel={onCancel}
      />
    ),
    onUpdate: (rowId, value) => onUpdate(rowId, "name", value),
  },
  {
    id: "email",
    type: "editable",
    // ... similar structure
  },
  {
    id: "dateOfBirth",
    type: "editable",
    viewRenderer: ({ row }) => <DateViewRenderer value={row.dateOfBirth} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <DateEditRenderer value={row.dateOfBirth} onSave={onSave} onCancel={onCancel} />
    ),
    // ...
  },
  {
    id: "gender",
    type: "editable",
    viewRenderer: ({ row }) => <SelectViewRenderer value={row.gender} options={genderOptions} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <SelectEditRenderer value={row.gender} options={genderOptions} onSave={onSave} onCancel={onCancel} />
    ),
    // ...
  },
  {
    id: "nationality",
    type: "editable",
    viewRenderer: ({ row }) => <CountryViewRenderer value={row.nationality} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <CountryEditRenderer value={row.nationality} onSave={onSave} onCancel={onCancel} />
    ),
    // ...
  },
  {
    id: "phoneNumber",
    type: "editable",
    viewRenderer: ({ row }) => <PhoneViewRenderer value={row.phoneNumber} />,
    editRenderer: ({ row, onSave, onCancel }) => (
      <PhoneEditRenderer value={row.phoneNumber} onSave={onSave} onCancel={onCancel} />
    ),
    // ...
  },
  {
    id: "createdAt",
    type: "viewonly",
    viewRenderer: ({ row }) => <DateViewRenderer value={row.createdAt} />,
    // ...
  },
];
```

### 13. Update RecipientVariableDataTable Consumer

**File: `client/views/template/manage/data/RecipientVariableDataTable.tsx`**

Update to use new `TableProvider<RecipientWithVariableValues>` and pass generic columns.

### 14. Update StudentsInGroupTable Consumer

**File: `client/views/template/manage/recipient/StudentsInGroupTable.tsx`**

Convert column definitions to use renderer-based API.

### 15. Update StudentsNotInGroupTable Consumer

**File: `client/views/template/manage/recipient/StudentsNotInGroupTable.tsx`**

Convert column definitions to use renderer-based API.

## Optimization Requirements

### 16. Add Performance Optimizations

Ensure all components use:

- `useCallback` for event handlers
- `useMemo` for computed values
- `React.memo` for component memoization where appropriate
- Proper dependency arrays

## Final Cleanup

### 17. Update Exports

**File: `client/components/Table/renderers/index.ts`**

Export all renderers for easy consumer imports:

```typescript
export * from './headers/BaseHeaderRenderer';
export * from './headers/createSortableHeader';
export * from './view/TextViewRenderer';
export * from './edit/TextEditRenderer';
export * from './template/TemplateTextRenderers';
// ... etc
```

### 18. Delete Unused Files

Remove:

- Old template cell renderers from `client/views/template/manage/data/components/cellRenderers/`
- `TableBody/DataCell.util.ts` (if no longer needed)

## Testing Checklist

- All table consumers render correctly
- Editing functionality works in all tables
- Sorting works when implemented in headerRenderer
- Filtering works when implemented in headerRenderer
- Column resizing, pinning, hiding still work
- No TypeScript errors
- All components properly memoized
- No console warnings

### To-dos

- [ ] Update table.type.ts with new generic Column/EditableColumn types, remove ColumnTypes enum and all type-specific properties
- [ ] Make all context providers generic (TableProvider, TableColumnsProvider, TableDataProvider, TableRowsProvider)
- [ ] Delete FilterPopover.tsx, TextFilterPopover.tsx, NumberFilterPopover.tsx, DateFilterPopover.tsx
- [ ] Refactor ColumnHeaderCell.tsx to call column.headerRenderer and remove built-in filter/sort rendering
- [ ] Refactor DataCell.tsx to call column.viewRenderer/editRenderer, remove CellContentRenderer usage
- [ ] Delete CellContentRenderer.tsx
- [ ] Create BaseHeaderRenderer component with 3 slots (label, onSort, onFilter)
- [ ] Create all view renderers (Text, Number, Date, Boolean, Select, Country, Phone)
- [ ] Create all edit renderers (Text, Number, Date, Boolean, Select, Country, Phone)
- [ ] Create template renderers (TemplateText, TemplateNumber, TemplateDate, TemplateSelect, ReadyStatus)
- [ ] Create header utilities (createSortableHeader, createFilterableHeader, createSimpleHeader)
- [ ] Update buildDataColumns.ts to use new renderer-based API
- [ ] Update StudentTable column.ts and useStudentTable.tsx to use new renderer-based API
- [ ] Update RecipientVariableDataTable.tsx to use generic TableProvider and new columns
- [ ] Update StudentsInGroupTable.tsx to use new renderer-based API
- [ ] Update StudentsNotInGroupTable.tsx to use new renderer-based API
- [ ] Create renderers/index.ts to export all renderers
- [ ] Add useCallback, useMemo, React.memo optimizations to all new components
- [ ] Delete old template cell renderers and unused utility files
<!-- 5867c15c-3f64-436e-bc89-41f01a6114c6 547d2034-4499-4376-bc10-15f739ed6795 -->

# Recipient Variable Data Management UI Implementation

## Overview

Create a new main tab "Data" in template management where users can view and edit variable values for all recipients in a selected group. The table will have dynamic columns based on template variables, full validation, and a ready status indicator.

## Architecture

Following the established pattern from recipient and student tables:

- **GraphQL Layer**: Documents for queries and mutations
- **Apollo Layer**: Mutations hook with cache updates
- **Store Layer**: Zustand store for UI state and query params
- **Operations Layer**: Business logic combining Apollo + Store + Notifications
- **UI Layer**: Components in `client/views/template/manage/data/`

## Implementation Steps

### 1. Update Tab Configuration

**Files**:

- `client/views/template/manage/useTemplateManagementStore.ts`
- `client/views/template/manage/ManagementTabList.tsx`
- `client/views/template/manage/TemplateManagementPage.tsx`

**Changes**:

- Add `"data"` to `TemplateManagementTabType` union
- Add new tab in `ManagementTabList` component
- Add `TabPanel` for data tab in `TemplateManagementPage`
- Update `initialTabErrors` and `isValidTab` helper

### 2. Create GraphQL Documents

**File**: `client/views/template/manage/data/hooks/recipientVariableData.documents.ts`

**Documents to create**:

```typescript
-recipientVariableValuesByGroupQuery -
  // Fetches all recipients with variable values for a group
  // Uses: recipientVariableValuesByGroup(recipientGroupId, limit, offset)

  setRecipientVariableValuesMutation;
// Updates variable values for a recipient
// Uses: setRecipientVariableValues(recipientGroupItemId, values)
```

**Run after creation**:

1. `~/.bun/bin/bun run generate:gqlSchema` (from package.json)
2. `~/.bun/bin/bun run codegen --watch` (in background for auto-regeneration)

### 3. Create Apollo Mutations Hook

**File**: `client/views/template/manage/data/hooks/useRecipientVariableDataApolloMutations.ts`

**Pattern**: Follow `useRecipientApolloMutations.ts` structure

- Use `useMutation` for setRecipientVariableValues
- Implement cache update logic:
  - Find and update the specific row in `recipientVariableValuesByGroup` query cache
  - Update the `variableValues` map for the updated recipient
  - Preserve pagination and other recipients

### 4. Create Zustand Store

**File**: `client/views/template/manage/data/stores/useRecipientVariableDataStore.ts`

**Pattern**: Follow `useRecipientStore.ts` structure with persistence

**State**:

```typescript
{
  selectedGroup: TemplateRecipientGroup | null;
  selectedGroupId: number | null; // for persistence
  queryParams: {
    recipientGroupId: number;
    limit: number;
    offset: number;
  }
  // No filters needed - this is pure data entry
}
```

**Actions**:

- `setSelectedGroup(group)`
- `setQueryParams(params)`
- `setPagination(limit, offset)`
- `reset()`

**Persistence**: Use sessionStorage with keys for selectedGroupId and queryParams

### 5. Create Operations Hook

**File**: `client/views/template/manage/data/hooks/useRecipientVariableDataOperations.tsx`

**Pattern**: Follow `useRecipientOperations.tsx` structure

**Operations**:

- `updateRecipientVariableValue(recipientGroupItemId, variableId, value)` - Single cell update
- `onPageChange(newPage)` - Update store pagination
- `onRowsPerPageChange(newRowsPerPage)` - Update store pagination
- All operations show notifications (success/error)
- Handle validation errors from backend

### 6. Build Dynamic Columns

**File**: `client/views/template/manage/data/columns/buildDataColumns.ts`

**Function**: `buildDataColumns(variables: TemplateVariable[], strings: any)`

**Logic**:

1. Start with Student Name column (non-editable, sortable, resizable)
2. Sort variables by `.order` property
3. For each variable, create column based on type:
   - `TEXT`: text column with min/max length validation
   - `NUMBER`: number column with min/max/decimal validation
   - `DATE`: date column with min/max date validation
   - `SELECT`: select column with options, support for multiple selection

4. Add Ready Status column (non-editable, shows checkmark/x icon)
5. Set `widthStorageKey` for each resizable column
6. All variable columns are editable and resizable

**Column Structure**:

```typescript
{
  id: `var_${variable.id}`,
  type: mapVariableTypeToColumnType(variable.type),
  label: variable.name,
  accessor: (row) => row.variableValues[variable.id],
  editable: true,
  resizable: true,
  required: variable.required,
  // Type-specific validation properties
}
```

### 7. Create Specialized Cell Renderers

**File**: `client/views/template/manage/data/components/cellRenderers/`

**New Renderers** (following pattern from `client/components/Table/TableBody/CellContentRenderer.tsx`):

**a) NumberVariableCellRenderer.tsx**

- View mode: Format with decimal places
- Edit mode: NumberField with step based on decimalPlaces
- Validation: min/max value, decimal places constraint
- Handle null value for "none" state

**b) DateVariableCellRenderer.tsx**

- View mode: Formatted date display
- Edit mode: DatePicker with min/max constraints
- Validation: date range, format
- Handle null value for "none" state

**c) TextVariableCellRenderer.tsx**

- View mode: Text with truncation/tooltip
- Edit mode: TextField with character counter
- Validation: min/max length, pattern matching
- Handle null value for "none" state

**d) SelectVariableCellRenderer.tsx**

- View mode: Display selected option(s)
- Edit mode:
  - Single select: Autocomplete with "None" option + clear button
  - Multiple select: Autocomplete with checkboxes + clear all
- Validation: required field check
- Allow clearing via backspace/delete key
- Special "None" option that sets value to null

**e) ReadyStatusCellRenderer.tsx**

- View mode only (non-editable)
- Logic: Check if all required variables have valid values
- Display: Green checkmark icon if ready, red X if not
- Tooltip: Show which required fields are missing/invalid

### 8. Create Validation Logic

**File**: `client/views/template/manage/data/utils/validation.ts`

**Functions**:

```typescript
- validateTextVariable(value, variable: TemplateTextVariable): string | null
- validateNumberVariable(value, variable: TemplateNumberVariable): string | null
- validateDateVariable(value, variable: TemplateDateVariable): string | null
- validateSelectVariable(value, variable: TemplateSelectVariable): string | null
- isRecipientReady(variableValues, variables): boolean
```

**Ready Status Logic**:

- Get all required variables
- For each required variable, check if value exists and passes validation
- Return true only if all required variables are valid

### 9. Create Main Table Component

**File**: `client/views/template/manage/data/RecipientVariableDataTable.tsx`

**Pattern**: Follow `StudentsInGroupTable.tsx` structure

**Features**:

- Use `TableProvider` with dynamic columns from `buildDataColumns`
- Fetch data with `useQuery` (recipientVariableValuesByGroup)
- Support pagination (limit/offset based)
- Column width initialization with localStorage persistence
- Editable cells with validation
- Handle cell updates via operations hook
- Show loading states

**Data Transformation**:

```typescript
// Transform backend data to table format
data.map(recipient => ({
  id: recipient.recipientGroupItemId,
  studentName: recipient.studentName,
  variableValues: recipient.variableValues,
  // ready status computed in column accessor
}));
```

### 10. Create Group Selector Component

**File**: `client/views/template/manage/data/RecipientVariableDataGroupSelector.tsx`

**Pattern**: Reuse or adapt `RecipientGroupSelector.tsx`

- Dropdown to select recipient group
- Show group name and student count
- Update store when selection changes
- Persist selection to store

### 11. Create Main Tab Component

**File**: `client/views/template/manage/data/RecipientVariableDataTab.tsx`

**Pattern**: Follow `RecipientsManagementTab.tsx` structure

**Layout**:

```
┌─────────────────────────────────────┐
│  Group Selector (right-aligned)     │
├─────────────────────────────────────┤
│                                     │
│  Recipient Variable Data Table      │
│  (with pagination)                  │
│                                     │
└─────────────────────────────────────┘
```

**Features**:

- Query template variables with `useQuery(templateVariablesByTemplateIdQuery)`
- Query recipient groups for selector
- Show loading/error states
- Show "Select a group" prompt if no group selected
- Initialize store with persisted group selection

### 12. Create Locale Strings

**File**: `client/locale/components/RecipientVariableData.ts`

**Type Definition**:

```typescript
export type RecipientVariableDataTranslation = {
  // Tab label
  tabDataManagement: string;

  // Headers
  studentName: string;
  readyStatus: string;
  ready: string;
  notReady: string;

  // Actions
  selectGroup: string;
  selectGroupPrompt: string;

  // Success messages
  valueUpdatedSuccess: string;

  // Error messages
  errorFetchingData: string;
  errorUpdatingValue: string;
  validationError: string;

  // Validation messages
  requiredField: string;
  invalidNumber: string;
  numberTooLow: string;
  numberTooHigh: string;
  invalidDate: string;
  dateTooEarly: string;
  dateTooLate: string;
  textTooShort: string;
  textTooLong: string;
  patternMismatch: string;
  invalidSelection: string;

  // Status tooltips
  missingRequiredFields: string;
  invalidValues: string;
  allRequiredFieldsComplete: string;
};
```

**Update**: `client/locale/components/index.ts` to export new type

**Add translations** to Arabic/English locale files following existing pattern

### 13. Register New Tab in Template Management

**File**: `client/views/template/manage/TemplateManagementPage.tsx`

**Changes**:

- Import `RecipientVariableDataTab`
- Add `<TabPanel value="data">` with the new component
- Pass template prop

### 14. Update Table Cell Renderer Registry

**File**: `client/components/Table/TableBody/CellContentRenderer.tsx`

**Changes**:

- Import new cell renderers
- Add to `editRenderers` and `viewRenderers` objects:
  - `templateText`: TextVariableCellRenderer
  - `templateNumber`: NumberVariableCellRenderer
  - `templateDate`: DateVariableCellRenderer
  - `templateSelect`: SelectVariableCellRenderer
  - `readyStatus`: ReadyStatusCellRenderer

**Alternative**: Create separate renderer registry in data feature

### 15. Testing & Quality Checks

After implementation:

1. Run `~/.bun/bin/bun lint` - Fix any linting issues
2. Run `~/.bun/bin/bun tsc` - Fix TypeScript errors
3. Manual testing:
   - Group selection persistence
   - Cell editing with validation
   - Pagination
   - Ready status updates
   - Null/empty value handling for SELECT
   - Column resizing and persistence

## Key Implementation Notes

### Cell Update Flow

```
User edits cell → Validate → Update via operations hook →
Apollo mutation → Backend validation → Cache update →
UI reflects change → Show notification
```

### Ready Status Calculation

- Performed in column accessor
- Re-calculated on every cell value change
- Only considers required variables
- Must pass validation, not just be non-null

### SELECT Variable "None" Option

- Add special option: `{ label: strings.none, value: null }`
- Clear button removes all selections
- Backspace/delete on empty input clears value
- Backend accepts null value

### Column Type Mapping

```typescript
TEXT → "templateText"
NUMBER → "templateNumber"
DATE → "templateDate"
SELECT → "templateSelect"
```

### Pagination

- Backend uses limit/offset (not page number)
- Convert page number to offset: `(page - 1) * limit`
- Store both limit and calculated offset in store

## File Structure

```
client/views/template/manage/data/
├── RecipientVariableDataTab.tsx          (main tab component)
├── RecipientVariableDataTable.tsx        (table component)
├── RecipientVariableDataGroupSelector.tsx (group selector)
├── columns/
│   └── buildDataColumns.ts               (dynamic column builder)
├── components/
│   └── cellRenderers/
│       ├── TextVariableCellRenderer.tsx
│       ├── NumberVariableCellRenderer.tsx
│       ├── DateVariableCellRenderer.tsx
│       ├── SelectVariableCellRenderer.tsx
│       └── ReadyStatusCellRenderer.tsx
├── hooks/
│   ├── recipientVariableData.documents.ts (GraphQL)
│   ├── useRecipientVariableDataApolloMutations.ts
│   └── useRecipientVariableDataOperations.tsx
├── stores/
│   └── useRecipientVariableDataStore.ts
└── utils/
    └── validation.ts
```

## Dependencies

- Existing table infrastructure: `client/components/Table/`
- Template variables query: reuse from variables tab
- Recipient groups query: reuse from recipient tab
- Country/Phone/Date components: reuse from student table

### To-dos

- [ ] Update tab configuration in useTemplateManagementStore, ManagementTabList, and TemplateManagementPage
- [ ] Create GraphQL documents for recipientVariableValuesByGroup query and setRecipientVariableValues mutation
- [ ] Run generate:gqlSchema and start codegen watch
- [ ] Create useRecipientVariableDataApolloMutations hook with cache updates
- [ ] Create useRecipientVariableDataStore with persistence for group selection and pagination
- [ ] Create useRecipientVariableDataOperations hook combining Apollo, store, and notifications
- [ ] Create validation utilities for each variable type and ready status checker
- [ ] Create buildDataColumns function to generate dynamic columns from template variables
- [ ] Create TextVariableCellRenderer component with view and edit modes
- [ ] Create NumberVariableCellRenderer component with decimal validation
- [ ] Create DateVariableCellRenderer component with date range validation
- [ ] Create SelectVariableCellRenderer component with None option and clear functionality
- [ ] Create ReadyStatusCellRenderer component showing validation status
- [ ] Create RecipientVariableDataGroupSelector component
- [ ] Create RecipientVariableDataTable component with pagination and editing
- [ ] Create RecipientVariableDataTab main component with layout and state management
- [ ] Create RecipientVariableDataTranslation type and add Arabic/English translations
- [ ] Update locale component exports to include new translation type
- [ ] Register new Data tab in TemplateManagementPage
- [ ] Run lint and tsc checks, fix any errors

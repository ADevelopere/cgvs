<!-- b1e9aa36-b045-4a01-8d45-230242fc6ae2 1824c965-82e7-4ca3-b62d-50aedb38222f -->
# UseNumberDataSourceState Implementation

Implement `useNumberDataSourceState` hook for managing numberDataSource state for NumberElement. Unlike `TextDataSourceInput` and `DateDataSourceInput` which are OneOf types (discriminated unions), `NumberDataSourceInput` is a simple object with a `variableId` field, making this implementation simpler and more similar to hooks like `useCountryPropsState`.

## Implementation Steps

### 1. Mutation document exists

- **File**: `client/views/template/manage/editor/glqDocuments/element/number.documents.ts`
- The mutation document `updateNumberElementDataSourceMutationDocument` should already exist
- Uses `NumberDataSourceStandaloneInput` and returns `NumberElementDataSourceUpdateResponse`
- Verify the document exists, no changes needed if it does

### 2. Add types to number/types.ts

- **File**: `client/views/template/manage/editor/form/element/number/types.ts`
- Add `SanitizedNumberDataSourceFormState` type (same as `NumberDataSourceInput`, no sanitization needed)
- Add `UpdateNumberDataSourceWithElementIdFn` type that takes `(elementId: number, dataSource: NumberDataSourceInput) => void`
- Keep existing `DataSourceFormErrors` export (already defined as `FormErrors<NumberDataSourceInput>`)
- Note: Since `NumberDataSourceInput` is a simple object (not OneOf), we can still use `Action<T>` pattern, but for simplicity and consistency with dataSource hooks, we'll use the same pattern as `useTextDataSourceState` - replace entire dataSource.

### 3. Create numberDataSource conversion utility

- **File**: `client/views/template/manage/editor/form/element/number/types.ts`
- Create `numberDataSourceToInput` utility function
- Converts `NumberDataSource` (query type) to `NumberDataSourceInput` (input type)
- Since NumberDataSource only has `numberVariableId`, the conversion is:
  ```typescript
  { variableId: numberDataSource.numberVariableId ?? 0 }
  ```


### 4. Create useNumberDataSourceState hook

- **File**: `client/views/template/manage/editor/form/hooks/useNumberDataSourceState.ts`
- Extract numberDataSource state from NumberElement only:
  - NumberElement: `element.numberDataSource`
  - Other elements: return null (don't have numberDataSource)
- Uses the `numberDataSourceToInput` utility to convert `NumberDataSource` (query output) to `NumberDataSourceInput` (form input)
- Uses the existing `validateNumberDataSource` from `element/number/numberValidators.ts` for validation
- Uses the existing `updateNumberElementDataSourceMutationDocument` from `glqDocuments/element/number.documents.ts`
- Since `NumberDataSourceInput` is a simple object (not OneOf), but to maintain consistency with dataSource hooks, use similar pattern:
  - State is stored as `NumberDataSourceInput` (entire object with `variableId`)
  - Update function accepts the entire `NumberDataSourceInput` (not individual field actions)
  - Validation validates the entire dataSource
- Returns `{ getState, updateFn, pushUpdate, errors }` where:
  - `getState(elementId)`: Returns `NumberDataSourceInput | null` (null if element is not NumberElement)
  - `updateFn(elementId, dataSource)`: Updates numberDataSource state for elementId (replaces entire dataSource)
  - `pushUpdate(elementId)`: Immediately saves numberDataSource state for elementId
  - `errors`: Map of elementId → errors

### 5. Handle state extraction and conversion

- Extract numberDataSource from NumberElement using `numberDataSourceToInput` utility:
  ```typescript
  if (element.__typename === "NumberElement" && element.numberDataSource) {
    return numberDataSourceToInput(element.numberDataSource);
  }
  return null;
  ```

- Convert to mutation input:
  ```typescript
  // NumberDataSourceInput to NumberDataSourceStandaloneInput
  // NumberDataSourceStandaloneInput includes elementId
  {
    elementId: elementId,
    dataSource: state
  }
  ```


### 6. Validation approach

- Since `NumberDataSourceInput` is a simple object, validation is straightforward
- Use `validateNumberDataSource(dataSource)` which returns `DataSourceFormErrors`
- The validator checks that `variableId` is provided and > 0:
  - `variableId`: must be > 0

### 7. Update function pattern

- For consistency with other dataSource hooks (`useTextDataSourceState`, `useDateDataSourceState`), use the same pattern:
  - The update function signature: `(elementId: number, dataSource: NumberDataSourceInput) => void`
  - This replaces the entire dataSource rather than updating individual fields
  - Follow the same implementation pattern as `useTextDataSourceState` or `useDateDataSourceState`

### 8. Element type detection

- Only NumberElement should be processed
- Return null from `extractInitialState` if element is not NumberElement
- Type guard to check if element is NumberElement

### 9. Export hook

- **File**: `client/views/template/manage/editor/form/hooks/index.ts`
- Export `useNumberDataSourceState` and its types

## Key Implementation Details

### Element Types with numberDataSource

- NumberElement ✓ (only one)
- TextElement ✗ (no numberDataSource)
- DateElement ✗ (no numberDataSource)
- ImageElement ✗ (no numberDataSource)
- CountryElement ✗ (no numberDataSource)
- GenderElement ✗ (no numberDataSource)
- QRCodeElement ✗ (no numberDataSource)

### State Conversion

- Query output: `NumberDataSource` (has `numberVariableId?: number | null`)
- Form input: `NumberDataSourceInput` (has `variableId: number`)
- Mutation input: `NumberDataSourceStandaloneInput` (wraps dataSource with elementId)
- Create `numberDataSourceToInput` utility for conversion:
  ```typescript
  { variableId: numberDataSource.numberVariableId ?? 0 }
  ```


### Mutation Structure

The mutation takes:

```typescript
{
  elementId: number,
  dataSource: NumberDataSourceInput  // { variableId: number }
}
```

### Validation

- Uses `validateNumberDataSource` which validates the entire `NumberDataSourceInput` object
- Returns `DataSourceFormErrors` which has `variableId?: string` error field
- Validation checks:
  - `variableId`: must be provided and > 0

### Special Consideration: Simple Object Pattern

Unlike `TextDataSourceInput` and `DateDataSourceInput` which are OneOf types, `NumberDataSourceInput` is a simple object:

- Only has one field: `variableId: number`
- NUMBER elements only support TEMPLATE_NUMBER_VARIABLE data source type
- Still use the same pattern as other dataSource hooks for consistency (replace entire object)

## Files to Create/Modify

### New Files

- `client/views/template/manage/editor/form/hooks/useNumberDataSourceState.ts`

### Modified Files

- `client/views/template/manage/editor/form/element/number/types.ts` (add UpdateNumberDataSourceWithElementIdFn, SanitizedNumberDataSourceFormState, and numberDataSourceToInput utility)
- `client/views/template/manage/editor/form/hooks/index.ts` (export useNumberDataSourceState)

### Note

- The mutation document should already exist in `number.documents.ts`, verify it exists
- The `validateNumberDataSource` validator already exists in `numberValidators.ts`
- Reference `useTextDataSourceState.ts` or `useDateDataSourceState.ts` as a guide, but the implementation will be simpler since NumberDataSourceInput is not a OneOf type
- The conversion utility is simpler since NumberDataSource only has one field

### To-dos

- [ ] Add UpdateTextDataSourceWithElementIdFn and SanitizedTextDataSourceFormState types to text/types.ts
- [ ] Create useTextDataSourceState hook - may need specialized implementation for OneOf type or adapter pattern
- [ ] Export useTextDataSourceState in hooks/index.ts
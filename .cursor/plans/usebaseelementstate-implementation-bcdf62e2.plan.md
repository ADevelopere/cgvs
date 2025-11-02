<!-- b1e9aa36-b045-4a01-8d45-230242fc6ae2 1824c965-82e7-4ca3-b62d-50aedb38222f -->
# UseDateDataSourceState Implementation

Implement `useDateDataSourceState` hook for managing dateDataSource state for DateElement. This follows a similar pattern to `useTextDataSourceState`, requiring special handling because `DateDataSourceInput` is a OneOf type (discriminated union) rather than a simple object with individual fields.

## Implementation Steps

### 1. Mutation document exists

- **File**: `client/views/template/manage/editor/glqDocuments/element/date.documents.ts`
- The mutation document `updateDateElementDataSourceMutationDocument` already exists
- Uses `DateDataSourceStandaloneInput` and returns `DateDataSourceUpdateResponse`
- No changes needed

### 2. Add types and utility to date/types.ts

- **File**: `client/views/template/manage/editor/form/element/date/types.ts`
- Add `SanitizedDateDataSourceFormState` type (same as `DateDataSourceInput`, no sanitization needed)
- Add `UpdateDateDataSourceWithElementIdFn` type that takes `(elementId: number, dataSource: DateDataSourceInput) => void`
- Keep existing `DateDataSourceFormErrors` export
- Create `dateDataSourceToInput` utility function similar to `textDataSourceToInput`:
  - Converts `DateDataSource` (query union type) to `DateDataSourceInput` (OneOf input type)
  - Handles all variants:
    - `DateDataSourceStatic` → `{ static: { value } }`
    - `DateDataSourceStudentField` → `{ studentField: { field } }`
    - `DateDataSourceCertificateField` → `{ certificateField: { field } }`
    - `DateDataSourceTemplateVariable` → `{ templateVariable: { variableId } }`
- Note: Since `DateDataSourceInput` is a OneOf type, we can't use the standard `Action<T>` pattern for individual fields. The update function will replace the entire dataSource.

### 3. Create useDateDataSourceState hook

- **File**: `client/views/template/manage/editor/form/hooks/useDateDataSourceState.ts`
- Follow the pattern from `useTextDataSourceState.ts` since both handle OneOf types
- Extract dateDataSource state from DateElement only:
  - DateElement: `element.dateDataSource`
  - Other elements: return null (don't have dateDataSource)
- Uses the `dateDataSourceToInput` utility to convert `DateDataSource` (query output) to `DateDataSourceInput` (form input)
- Uses the existing `validateDateDataSource` from `element/date/dateValidators.ts` for validation
- Uses the existing `updateDateElementDataSourceMutationDocument` from `glqDocuments/element/date.documents.ts`
- Since `DateDataSourceInput` is a OneOf type (not a simple object), we need a specialized approach:
  - State is stored as `DateDataSourceInput` (the entire discriminated union)
  - Update function accepts the entire `DateDataSourceInput` (not individual field actions)
  - Validation validates the entire dataSource
  - Use similar pattern to `useTextDataSourceState` - likely needs custom implementation rather than generic `useElementState`
- Returns `{ getState, updateFn, pushUpdate, errors }` where:
  - `getState(elementId)`: Returns `DateDataSourceInput | null` (null if element is not DateElement)
  - `updateFn(elementId, dataSource)`: Updates dateDataSource state for elementId (replaces entire dataSource)
  - `pushUpdate(elementId)`: Immediately saves dateDataSource state for elementId
  - `errors`: Map of elementId → errors

### 4. Handle state extraction and conversion

- Extract dateDataSource from DateElement using `dateDataSourceToInput` utility:
  ```typescript
  if (element.__typename === "DateElement" && element.dateDataSource) {
    return dateDataSourceToInput(element.dateDataSource);
  }
  return null;
  ```

- Convert to mutation input:
  ```typescript
  // DateDataSourceInput to DateDataSourceStandaloneInput
  // DateDataSourceStandaloneInput includes elementId
  {
    elementId: elementId,
    dataSource: state
  }
  ```


### 5. Validation approach

- Since `DateDataSourceInput` is a OneOf type, we need to validate the entire object
- Use `validateDateDataSource(dataSource)` which returns `DateDataSourceFormErrors`
- The validator checks which variant is active and validates accordingly:
  - `static`: validates value is not empty
  - `studentField`: validates field is provided
  - `certificateField`: validates field is provided
  - `templateVariable`: validates variableId > 0

### 6. Update function pattern

- Unlike other hooks that use `Action<T>` pattern for individual fields, this hook needs to replace the entire `DateDataSourceInput`
- The update function signature will be: `(elementId: number, dataSource: DateDataSourceInput) => void`
- This replaces the entire dataSource rather than updating individual fields
- Follow the same pattern as `useTextDataSourceState` (likely custom implementation for OneOf types)

### 7. Element type detection

- Only DateElement should be processed
- Return null from `extractInitialState` if element is not DateElement
- Type guard to check if element is DateElement

### 8. Export hook

- **File**: `client/views/template/manage/editor/form/hooks/index.ts`
- Export `useDateDataSourceState` and its types

## Key Implementation Details

### Element Types with dateDataSource

- DateElement ✓ (only one)
- TextElement ✗ (no dateDataSource)
- ImageElement ✗ (no dateDataSource)
- NumberElement ✗ (no dateDataSource)
- CountryElement ✗ (no dateDataSource)
- GenderElement ✗ (no dateDataSource)
- QRCodeElement ✗ (no dateDataSource)

### State Conversion

- Query output: `DateDataSource` (discriminated union with __typename)
- Form input: `DateDataSourceInput` (OneOf input type)
- Mutation input: `DateDataSourceStandaloneInput` (wraps dataSource with elementId)
- Create `dateDataSourceToInput` utility for conversion (similar to `textDataSourceToInput`)

### Mutation Structure

The mutation takes:

```typescript
{
  elementId: number,
  dataSource: DateDataSourceInput
}
```

### Validation

- Uses `validateDateDataSource` which validates the entire `DateDataSourceInput` object
- Returns `DateDataSourceFormErrors` which is a partial object with error messages
- Validation depends on which variant of the OneOf is active:
  - `static`: requires non-empty value
  - `studentField`: requires field
  - `certificateField`: requires field
  - `templateVariable`: requires variableId > 0

### Special Consideration: OneOf Type Pattern

Since `DateDataSourceInput` is a OneOf type (discriminated union), the update pattern is different:

- Cannot use individual field updates (Action pattern)
- Must replace entire dataSource
- The update function takes the entire `DateDataSourceInput` rather than `Action<DateDataSourceInput>`
- Follow the same implementation pattern as `useTextDataSourceState`

## Files to Create/Modify

### New Files

- `client/views/template/manage/editor/form/hooks/useDateDataSourceState.ts`

### Modified Files

- `client/views/template/manage/editor/form/element/date/types.ts` (add UpdateDateDataSourceWithElementIdFn, SanitizedDateDataSourceFormState, and dateDataSourceToInput utility)
- `client/views/template/manage/editor/form/hooks/index.ts` (export useDateDataSourceState)

### Note

- The mutation document already exists in `date.documents.ts`, so no changes needed there
- Reference `useTextDataSourceState.ts` as a guide since it handles a similar OneOf type pattern
- The `validateDateDataSource` validator already exists in `dateValidators.ts`

### To-dos

- [ ] Add UpdateTextDataSourceWithElementIdFn and SanitizedTextDataSourceFormState types to text/types.ts
- [ ] Create useTextDataSourceState hook - may need specialized implementation for OneOf type or adapter pattern
- [ ] Export useTextDataSourceState in hooks/index.ts
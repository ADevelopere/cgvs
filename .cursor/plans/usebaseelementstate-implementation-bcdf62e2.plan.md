<!-- bcdf62e2-2746-4a3b-9f42-acaba75a5d56 a066d828-6ebf-4cd3-b0f3-99582ca0e57c -->
# UseBaseElementState Implementation

Implement `useBaseElementState` hook for managing base element properties across all element types. This is a proof-of-concept implementation before extending to other state types.

## Implementation Steps

### 1. Extend types.ts with ActionWithElementId

- **File**: `client/views/template/manage/editor/form/types.ts`
- Add `ActionWithElementId<T>` type that extends `Action<T>` with `elementId: number`
- Used for update functions that need elementId context

### 2. Create mutation document for updateElementCommonProperties

- **File**: `client/views/template/manage/editor/glqDocuments/element/element.documents.ts`
- Add `updateElementCommonPropertiesMutationDocument` using GraphQL mutation
- Mutation takes `CertificateElementBaseUpdateInput` and returns `CertificateElement`
- Use existing GraphQL schema: `updateElementCommonProperties(input: CertificateElementBaseUpdateInput!): CertificateElement`

### 3. Create generic useElementState hook

- **File**: `client/views/template/manage/editor/form/hooks/useElementState.ts`
- Generic hook that manages state scoped by elementId
- Accepts either `templateId: number` OR `elements: GQL.CertificateElementUnion[]`
- If `templateId` provided, uses `elementsByTemplateIdQueryDocument` query
- State management:
  - `Map<number, T>` for elementId → state
  - `Map<number, FormErrors<T>>` for elementId → errors
  - `Map<number, T>` for elementId → pending updates
- Features:
  - `getState(elementId)`: Returns state, creating from element data if missing
  - `updateFn(elementId, action)`: Validates, updates state/errors, triggers debounced mutation
  - `pushUpdate(elementId)`: Immediately flushes pending update for elementId
- Debounce: 10 second timeout (same as TemplateConfigAutoUpdateForm)
- Cleanup: Save pending updates on unmount
- Parameters:
  - `templateId` or `elements`
  - `validator`: Field validator function
  - `extractInitialState`: Function to extract initial state from element
  - `mutationFn`: Function to call mutation `(elementId, state) => Promise<void>`

### 4. Create useBaseElementState hook

- **File**: `client/views/template/manage/editor/form/hooks/useBaseElementState.ts`
- Uses `useElementState` with base-specific configuration
- Extracts base state from `element.base` property
- Uses `validateBaseElementField` from `element/base/cretElementBaseValidator.ts`
- Creates mutation function using `updateElementCommonPropertiesMutationDocument`
- Returns `{ getState, updateFn, pushUpdate, errors }` where:
  - `getState(elementId)`: Returns `CertificateElementBaseInput`
  - `updateFn(elementId, action)`: Updates base state for elementId
  - `pushUpdate(elementId)`: Immediately saves base state for elementId
  - `errors`: Map of elementId → errors

### 5. Handle state conversion

- Convert `CertificateElementBase` (from query) to `CertificateElementBaseInput` (for form)
- Map `CertificateElementBaseUpdateInput` fields correctly (excludes `templateId`, includes `id`)
- Handle all element types: Text, Image, Date, Number, Country, QRCode, Gender (all have `base` property)

### 6. Export hook

- **File**: `client/views/template/manage/editor/form/hooks/index.ts`
- Export `useBaseElementState` for easy importing

## Key Implementation Details

### State Conversion

```typescript
// From query (CertificateElementBase) to form input (CertificateElementBaseInput)
const baseInput: CertificateElementBaseInput = {
  templateId: element.template.id,
  alignment: element.base.alignment,
  description: element.base.description ?? "",
  height: element.base.height,
  hidden: element.base.hidden ?? false,
  name: element.base.name,
  positionX: element.base.positionX,
  positionY: element.base.positionY,
  renderOrder: element.base.renderOrder,
  width: element.base.width,
};

// To mutation input (CertificateElementBaseUpdateInput)
const updateInput: CertificateElementBaseUpdateInput = {
  id: element.base.id,
  alignment: state.alignment,
  description: state.description,
  height: state.height,
  hidden: state.hidden,
  name: state.name,
  positionX: state.positionX,
  positionY: state.positionY,
  renderOrder: state.renderOrder,
  width: state.width,
};
```

### Debounce Pattern

- Use `useEffect` with 10 second timeout
- Clear timeout on state change (debounce reset)
- Save pending updates on unmount
- Per-elementId debouncing (separate timers per element)

### Mutation Integration

- Use `useMutation` hook with `updateElementCommonPropertiesMutationDocument`
- No cache updates needed (minimal mutation)
- Handle errors and show notifications

## Files to Create/Modify

### New Files

- `client/views/template/manage/editor/form/hooks/useElementState.ts`
- `client/views/template/manage/editor/form/hooks/useBaseElementState.ts`
- `client/views/template/manage/editor/form/hooks/index.ts`

### Modified Files

- `client/views/template/manage/editor/form/types.ts` (add ActionWithElementId)
- `client/views/template/manage/editor/glqDocuments/element/element.documents.ts` (add mutation document)

### To-dos

- [ ] Add ActionWithElementId<T> type to types.ts for elementId-aware actions
- [ ] Create updateElementCommonPropertiesMutationDocument in element.documents.ts
- [ ] Create generic useElementState hook with debounce, state management, and mutation integration
- [ ] Create useBaseElementState hook using useElementState with base-specific config
- [ ] Export useBaseElementState in hooks/index.ts
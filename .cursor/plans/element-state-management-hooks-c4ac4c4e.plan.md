<!-- c4ac4c4e-3d23-48d0-87c4-8b49cfaf5fb3 457bfcfa-8677-4361-a699-f967159b8c63 -->
# Element State Management Hooks

## Overview

Create generic hooks (one per state type) to manage element input states scoped by elementId. Each hook handles state management, validation, debounced updates, and mutation calls.

## Implementation Steps

### 1. Extend types.ts with elementId-aware action type

- **File**: `client/views/template/manage/editor/form/types.ts`
- Add new type `ActionWithElementId<T>` that extends `Action<T>` with `elementId: number`
- This will be used for update functions that accept elementId

### 2. Add minimal mutation functions to element mutation hooks

- **Files**: 
  - `client/views/template/manage/editor/hooks/element/useImageElementMutation.ts`
  - `client/views/template/manage/editor/hooks/element/useTextElementMutation.ts`
  - `client/views/template/manage/editor/hooks/element/useDateElementMutation.ts`
  - `client/views/template/manage/editor/hooks/element/useNumberElementMutation.ts`
  - `client/views/template/manage/editor/hooks/element/useCountryElementMutation.ts`
  - `client/views/template/manage/editor/hooks/element/useQRCodeElementMutation.ts`
- For each hook, add minimal mutation functions (no cache updates) for sub-object mutations:
  - `updateImageElementSpecPropsMutation`
  - `updateTextElementDataSourceMutation`
  - `updateDateElementDataSourceMutation`, `updateDateElementSpecPropsMutation`
  - `updateNumberElementDataSourceMutation`, `updateNumberElementSpecPropsMutation`
  - `updateCountryElementSpecPropsMutation`
  - `updateQRCodeElementSpecPropsMutation`
- Use existing mutation documents from `glqDocuments/element/`

### 3. Create base hook implementation pattern

- **File**: `client/views/template/manage/editor/form/hooks/useElementState.ts` (generic implementation)
- Generic hook structure:
  - Accepts `templateId` OR `elements: GQL.CertificateElementUnion[]`
  - If templateId provided, uses `elementsByTemplateIdQueryDocument` query (same as EditorTab.tsx)
  - State storage: `Map<elementId, State>` and `Map<elementId, Errors>`
  - State getter: creates state from element data if missing, then returns
  - Update function: validates using provided validator, updates state/errors, triggers debounced mutation
  - Debounce: 10 seconds (same as TemplateConfigAutoUpdateForm)
  - Push function: immediately flushes pending updates (bypasses debounce)
  - Cleanup: save on unmount if pending changes (similar to TemplateConfigAutoUpdateForm)

### 4. Create specific hooks per state type

- **Files** (under `client/views/template/manage/editor/form/hooks/`):
  - `useBaseElementState.ts` - for `CertificateElementBaseInput`
  - `useTextPropsState.ts` - for `TextPropsInput`
  - `useDatePropsState.ts` - for `DateElementSpecPropsInput`
  - `useImagePropsState.ts` - for `ImageElementSpecPropsInput`
  - `useNumberPropsState.ts` - for `NumberElementSpecPropsInput`
  - `useCountryPropsState.ts` - for `CountryElementCountryPropsInput`
  - `useQRCodePropsState.ts` - for `QRCodeElementSpecPropsInput`
  - `useTextDataSourceState.ts` - for `TextDataSourceInput`
  - `useDateDataSourceState.ts` - for `DateDataSourceInput`
  - `useNumberDataSourceState.ts` - for `NumberDataSourceInput`
- Each hook:
  - Uses the generic pattern
  - Imports appropriate validator from `element/{type}/`
  - Extracts initial state from element data based on element type
  - Maps elementId to appropriate mutation function from mutation hooks
  - Returns: `{ getState, updateFn, pushUpdate, errors }` per elementId

### 5. Handle element type detection and state extraction

- Each hook needs to:
  - Detect element type from `CertificateElementUnion`
  - Extract initial state from correct property (base, textProps, etc.)
  - Map elementId to correct mutation function based on element type
  - Handle cases where element doesn't have the requested state type (e.g., QRCode doesn't have textProps)

### 6. Mutation integration

- Hooks will call mutation functions from existing mutation hooks
- Need to get mutation hook instance per elementId
- Strategy: Create a registry or pass mutation hooks as parameters
- Alternative: Each hook instantiates all mutation hooks and selects based on element type

### 7. Export and index

- **File**: `client/views/template/manage/editor/form/hooks/index.ts`
- Export all state hooks for easy importing

## Key Implementation Details

### State Structure

```typescript
// Internal state structure
const states = new Map<number, T>(); // elementId -> state
const errors = new Map<number, FormErrors<T>>(); // elementId -> errors
const pendingUpdates = new Map<number, T>(); // elementId -> pending state
```

### Debounce Pattern

- Similar to TemplateConfigAutoUpdateForm (lines 164-179)
- 10 second timeout
- Clear on state change
- Push function clears timeout and immediately executes

### Initial State Creation

- When `getState(elementId)` is called for non-existent elementId:

  1. Find element in elements array
  2. Extract state from element (e.g., `element.base`, `element.textProps`)
  3. Store in states map
  4. Return state

### Mutation Mapping

- Each state type needs to map to appropriate mutation:
  - base → depends on element type (updateTextElement, updateDateElement, etc.)
  - textProps → updateTextElement (for Text), updateDateElement (for Date), etc.
  - Specific props → standalone mutations (updateImageElementSpecProps, etc.)
- Need helper to determine which mutation to call based on element type

## Files to Create/Modify

### New Files

- `client/views/template/manage/editor/form/hooks/useElementState.ts` (generic base)
- `client/views/template/manage/editor/form/hooks/useBaseElementState.ts`
- `client/views/template/manage/editor/form/hooks/useTextPropsState.ts`
- `client/views/template/manage/editor/form/hooks/useDatePropsState.ts`
- `client/views/template/manage/editor/form/hooks/useImagePropsState.ts`
- `client/views/template/manage/editor/form/hooks/useNumberPropsState.ts`
- `client/views/template/manage/editor/form/hooks/useCountryPropsState.ts`
- `client/views/template/manage/editor/form/hooks/useQRCodePropsState.ts`
- `client/views/template/manage/editor/form/hooks/useTextDataSourceState.ts`
- `client/views/template/manage/editor/form/hooks/useDateDataSourceState.ts`
- `client/views/template/manage/editor/form/hooks/useNumberDataSourceState.ts`
- `client/views/template/manage/editor/form/hooks/index.ts`

### Modified Files

- `client/views/template/manage/editor/form/types.ts` (add ActionWithElementId)
- All mutation hooks in `client/views/template/manage/editor/hooks/element/` (add sub-object mutations)

### To-dos

- [ ] Extend types.ts with ActionWithElementId<T> type for elementId-aware actions
- [ ] Add minimal mutation functions (no cache) to all element mutation hooks for sub-object updates
- [ ] Create generic useElementState.ts hook with debounce, state management, and mutation integration pattern
- [ ] Create useBaseElementState.ts hook for managing base element states
- [ ] Create useTextPropsState.ts hook for managing textProps states across elements
- [ ] Create hooks for dateProps, imageProps, numberProps, countryProps, qrCodeProps
- [ ] Create hooks for textDataSource, dateDataSource, numberDataSource
- [ ] Create index.ts to export all hooks
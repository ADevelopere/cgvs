# Fix Template Variable Pattern to Match TemplatePane

## Current WRONG Pattern (Same as Recipient Groups)

**Files violating pattern:**
- `hooks/templateVariable.operations.ts` - Contains `useTemplateVariableApolloQueries` (queries in hook) ❌
- `hooks/useTemplateVariableOperations.ts` - Has `useEffect` to sync query data to store ❌
- Stores hold data (`variables`, `loading`, `error`) instead of just UI state ❌

## Correct Pattern (TemplatePane)

1. **Apollo Mutations Hook** (`useTemplateVariableApolloMutations.ts`)
   - Only mutations (create, update, delete)
   - Each mutation updates `templateVariablesByTemplateId` query cache
   - Uses `cache.updateQuery` API

2. **UI Store** (keep existing stores but remove data)
   - NO data storage (no variables, loading, error)
   - Only UI state: selection, modal state, etc.

3. **Operations Hook** (`useTemplateVariableOperations.ts`)
   - Calls Apollo mutations
   - Handles notifications
   - Returns mutation functions only

4. **Components**
   - Call `useQuery` directly
   - Pass data down as props
   - No sync logic

## Implementation Steps

### Step 1: Create `useTemplateVariableApolloMutations.ts`

**NEW FILE:** `client/views/template/manage/variables/hooks/useTemplateVariableApolloMutations.ts`

```typescript
"use client";

import React from "react";
import { useMutation } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./templateVariable.documents";

export const useTemplateVariableApolloMutations = () => {
  // Create text variable mutation
  const [createTextMutation] = useMutation(
    Documents.createTemplateTextVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateTextVariable) return;
        const newVariable = data.createTemplateTextVariable;
        const templateId = newVariable.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: Documents.templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId: [
                ...existing.templateVariablesByTemplateId,
                newVariable,
              ],
            };
          }
        );
      },
    }
  );

  // Similar for createNumberMutation, createDateMutation, createSelectMutation
  // Similar for updateTextMutation, updateNumberMutation, updateDateMutation, updateSelectMutation
  // Similar for deleteMutation

  return React.useMemo(
    () => ({
      createTextVariable: createTextMutation,
      createNumberVariable: createNumberMutation,
      createDateVariable: createDateMutation,
      createSelectVariable: createSelectMutation,
      updateTextVariable: updateTextMutation,
      updateNumberVariable: updateNumberMutation,
      updateDateVariable: updateDateMutation,
      updateSelectVariable: updateSelectMutation,
      deleteVariable: deleteMutation,
    }),
    [createTextMutation, createNumberMutation, createDateMutation, createSelectMutation, updateTextMutation, updateNumberMutation, updateDateMutation, updateSelectMutation, deleteMutation]
  );
};
```

### Step 2: Simplify Data Store

**MODIFY:** `client/views/template/manage/variables/stores/useTemplateVariableDataStore.ts`

**Remove:**
- `variables: TemplateVariable[]`
- `loading: boolean`
- `error: string | null`
- `setVariables`, `setLoading`, `setError`, `addVariable`, `updateVariable`, `removeVariable`

**Keep only:**
- `templateId: number | null`
- `setTemplateId: (id: number) => void`

### Step 3: Rewrite `useTemplateVariableOperations.ts`

**REWRITE:** `client/views/template/manage/variables/hooks/useTemplateVariableOperations.ts`

**Remove:**
- Import and call to `useTemplateVariableApolloQueries`
- `useEffect` that syncs query data to store
- Return values: `variables`, `loading`, `error`, `refetch`

**Keep only:**
- Mutation operations: `createVariable`, `updateVariable`, `deleteVariable`
- UI state management via stores

### Step 4: Update Components

**MODIFY:** `client/views/template/manage/variables/TemplateVariableManagement.tsx`

Add direct `useQuery` call:
```typescript
const TemplateVariableManagement: React.FC<Props> = ({ template }) => {
  const operations = useTemplateVariableOperations();
  const modal = useTemplateVariableModal();
  const selection = useTemplateVariableSelection();

  // Direct query - Apollo auto-refetches, no manual sync
  const { data, loading } = useQuery(
    templateVariablesByTemplateIdQueryDocument,
    {
      variables: { templateId: template.id },
      skip: !template.id,
      fetchPolicy: "cache-first",
    }
  );

  const variables = data?.templateVariablesByTemplateId || [];

  return (
    <div>
      <VariableList variables={variables} />
      {/* ... */}
    </div>
  );
};
```

### Step 5: Update Child Components

- `VariableList.tsx` - Accept `variables` as prop (not from store)
- `VariableModal.tsx` - Use `useQuery` to fetch selected variable by ID if needed

### Step 6: Delete Old Files

**DELETE:** `client/views/template/manage/variables/hooks/templateVariable.operations.ts`

## Files to Modify/Create

**CREATE:**
1. `hooks/useTemplateVariableApolloMutations.ts` - NEW Apollo mutations hook

**REWRITE:**
2. `hooks/useTemplateVariableOperations.ts` - Remove useEffect sync, only mutations
3. `stores/useTemplateVariableDataStore.ts` - Remove data storage
4. `TemplateVariableManagement.tsx` - Add direct useQuery
5. `VariableList.tsx` - Accept variables prop
6. `VariableModal.tsx` - Use useQuery if needed

**DELETE:**
7. `hooks/templateVariable.operations.ts` - Contains queries, violates pattern

## Benefits

✅ No data duplication - Apollo cache is single source
✅ No manual sync - Apollo handles updates automatically  
✅ Mutations update cache via `cache.updateQuery`
✅ Strictly follows TemplatePane pattern
✅ Simpler, more maintainable code

## Implementation TODOs

- [ ] **Step 1**: Create `hooks/useTemplateVariableApolloMutations.ts` with cache updates
- [ ] **Step 2**: Simplify `stores/useTemplateVariableDataStore.ts` to remove data storage
- [ ] **Step 3**: Rewrite `hooks/useTemplateVariableOperations.ts` to only handle mutations
- [ ] **Step 4**: Update `TemplateVariableManagement.tsx` to use direct useQuery
- [ ] **Step 5**: Update child components (VariableList, VariableModal)
- [ ] **Step 6**: Delete `hooks/templateVariable.operations.ts`

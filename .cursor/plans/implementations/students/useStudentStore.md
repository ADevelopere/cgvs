# useStudentStore - Zustand Store Implementation

**File:** `client/views/student/stores/useStudentStore.ts`

**Status:** ✅ No changes needed - Already compatible with new architecture

The Zustand store manages query parameters, filters, and UI state for the student table. It persists state to `sessionStorage` for restoration across page reloads.

## Current Implementation

The existing implementation is fully compatible with the new renderer-based architecture because it operates at the state management level, not the rendering level.

## Store Structure

```typescript
type State = {
  selectedStudents: number[];
  queryParams: Graphql.StudentsQueryVariables;
  filters: Record<string, FilterClause | null>; // UI filter state
};

type Actions = {
  setQueryParams: (params: Partial<Graphql.StudentsQueryVariables>) => void;
  toggleStudentSelect: (id: number) => void;
  selectAllStudents: (studentIds: number[]) => void;
  clearSelectedStudents: () => void;
  setFilters: (filters: Record<string, FilterClause | null>) => void;
  setColumnFilter: (clause: FilterClause | null, columnId: string) => void;
  clearFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  reset: () => void;
};
```

## Key Features

### 1. **Query Parameters Management**

Stores GraphQL query variables:
```typescript
const DEFAULT_QUERY_PARAMS: Graphql.StudentsQueryVariables = {
  paginationArgs: {
    first: 100,
    page: 1,
  },
  orderBy: [{ column: "NAME", order: "ASC" }],
};
```

### 2. **Filter State Management**

Maintains UI filter state separate from query parameters:
```typescript
filters: {
  name: { columnId: "name", operation: "startsWith", value: "John" },
  email: { columnId: "email", operation: "contains", value: "@example.com" },
}
```

### 3. **Student Selection**

Tracks selected students for bulk operations:
```typescript
selectedStudents: [1, 5, 12, 24]
```

### 4. **Persistence**

Automatically persists to sessionStorage:
```typescript
{
  name: "student-ui-store",
  storage: createJSONStorage(() => sessionStorage),
  partialize: state => ({
    queryParams: state.queryParams,
    filters: state.filters,
    selectedStudents: state.selectedStudents,
  }),
}
```

## Usage in New Architecture

### In useStudentOperations
```typescript
export const useStudentOperations = () => {
  const store = useStudentStore();
  
  const setColumnFilter = useCallback(
    (filterClause: FilterClause | null, columnId: string) => {
      store.setColumnFilter(filterClause, columnId);
      syncFiltersToQueryParams();
    },
    [store]
  );

  return {
    queryParams: store.queryParams,
    filters: store.filters,
    setColumnFilter,
    // ... other operations
  };
};
```

### In StudentTable Component
```typescript
const StudentTable = () => {
  const { queryParams, filters } = useStudentOperations();
  
  const { data, loading } = useQuery(studentsQueryDocument, {
    variables: queryParams,
  });
  
  // queryParams automatically updates when filters change
};
```

## Store Methods

### setQueryParams
```typescript
store.setQueryParams({
  paginationArgs: {
    first: 50,
    page: 2,
  },
});
```

### setFilters
```typescript
store.setFilters({
  name: { columnId: "name", operation: "startsWith", value: "J" },
});
```

### setColumnFilter
```typescript
store.setColumnFilter(
  { columnId: "email", operation: "contains", value: "@" },
  "email"
);
```

### clearFilter
```typescript
store.clearFilter("name");
```

### clearAllFilters
```typescript
store.clearAllFilters();
```

### toggleStudentSelect
```typescript
store.toggleStudentSelect(123); // Select/deselect student with ID 123
```

### selectAllStudents
```typescript
store.selectAllStudents([1, 2, 3, 4, 5]);
```

### clearSelectedStudents
```typescript
store.clearSelectedStudents();
```

### reset
```typescript
store.reset(); // Reset to initial state
```

## Persistence Behavior

### What Gets Persisted
- ✅ Query parameters (pagination, orderBy, filterArgs)
- ✅ UI filter state
- ✅ Selected students

### What Doesn't Get Persisted
- ❌ Loading states
- ❌ Error states
- ❌ Temporary UI state (modal open/closed, etc.)

### Restoration on Page Load
```typescript
// State is automatically restored from sessionStorage
const store = useStudentStore();
console.log(store.queryParams); // Restored from previous session
```

## Deep Merge Strategy

The store uses a custom merge strategy to handle nested objects:

```typescript
merge: (persistedState, currentState) => {
  // Deep merge queryParams
  const mergedQueryParams = {
    ...currentState.queryParams,
    ...persistedState.queryParams,
    paginationArgs: {
      ...currentState.queryParams.paginationArgs,
      ...persistedState.queryParams.paginationArgs,
    },
  };

  return {
    ...currentState,
    queryParams: mergedQueryParams,
    filters: persistedState.filters || currentState.filters,
    selectedStudents: persistedState.selectedStudents || currentState.selectedStudents,
  };
}
```

## Logging

The store includes comprehensive logging for debugging:

```typescript
logger.info("🔍 useStudentStore: setQueryParams called with:", params);
logger.info("🔍 useStudentStore: current queryParams before:", state.queryParams);
logger.info("🔍 useStudentStore: new queryParams after:", newQueryParams);
logger.info("💾 Persisting student store state:", state);
logger.info("🔄 Merging student store state:", persistedState, currentState);
logger.info("✅ Final merged state:", mergedState);
```

## Why No Changes Are Needed

1. **State Layer Only**: Store manages state, not rendering
2. **Generic Structure**: Works with any column structure
3. **Type Safe**: Uses GraphQL types that don't change
4. **Persistence Agnostic**: Persists data, not UI components
5. **Clean Interface**: Operations layer provides abstraction

## Testing

No changes to store tests are required since the interface remains the same.

## Summary

**Action Required:** ✅ None - This file is already compatible

The Zustand store provides robust state management that works seamlessly with both old and new table architectures. The store's generic design makes it future-proof for the renderer-based refactor.

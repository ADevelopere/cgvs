# useStudentOperations Hook - Complete Implementation

**File:** `client/views/student/useStudentOperations.tsx`

**Status:** ✅ No changes needed - Already compatible with new architecture

This file contains the business logic layer that combines Apollo mutations, Zustand store, and notifications. It does NOT need to be modified for the renderer-based refactor because it operates at the data/operations level, not the rendering level.

## Current Implementation

The existing implementation in `/home/pc/Projects/cgvs/client/views/student/useStudentOperations.tsx` is already well-structured and compatible with the new table architecture.

## Key Features (Already Present)

### 1. **CRUD Operations**

```typescript
const { createStudent, partialUpdateStudent, deleteStudent } =
  useStudentOperations();
```

### 2. **Pagination Management**

```typescript
const { onPageChange, onRowsPerPageChange } = useStudentOperations();
```

### 3. **Sort Management**

```typescript
const { updateSort } = useStudentOperations();

// Usage
updateSort([
  { column: "name", order: "ASC" },
  { column: "createdAt", order: "DESC" },
]);
```

### 4. **Filter Management**

```typescript
const {
  applyFilters,
  setSearchFilter,
  setColumnFilter,
  clearFilter,
  clearAllFilters,
} = useStudentOperations();
```

### 5. **Store Access**

```typescript
const {
  queryParams,
  filters,
  selectedStudents,
  toggleStudentSelect,
  selectAllStudents,
  clearSelectedStudents,
} = useStudentOperations();
```

## Integration with New Architecture

The `useStudentOperations` hook integrates perfectly with the new renderer-based architecture:

### In useStudentTable Hook

```typescript
export const useStudentTable = () => {
  const { partialUpdateStudent, updateSort, setColumnFilter } =
    useStudentOperations();

  // Use in column definitions
  const columns = buildStudentColumns({
    onSort: columnId => {
      // Transform and call updateSort
      updateSort([{ column: columnId, order: newDirection }]);
    },
    onFilterChange: (columnId, value) => {
      // Call setColumnFilter
      setColumnFilter({ columnId, operation: "contains", value }, columnId);
    },
    onUpdate: async (rowId, columnId, value) => {
      // Call partialUpdateStudent
      await partialUpdateStudent({ input: { id: rowId, [columnId]: value } });
    },
  });
};
```

### In StudentTable Component

```typescript
const StudentTable = () => {
  const {
    queryParams,
    filters,
    onPageChange,
    onRowsPerPageChange,
    setColumnFilter,
    updateSort,
  } = useStudentOperations();

  const { data, loading } = useQuery(studentsQueryDocument, {
    variables: queryParams,
  });

  return (
    <TableProvider
      data={data?.students?.data ?? []}
      isLoading={loading}
      columns={columns}
      pageInfo={data?.students?.pageInfo}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    >
      <Table />
    </TableProvider>
  );
};
```

## Why No Changes Are Needed

1. **Separation of Concerns**: Operations are data-focused, not rendering-focused
2. **Generic Interface**: Operations work with any column structure
3. **Type Safety**: All operations use GraphQL types, which remain unchanged
4. **Filter Abstraction**: Filter operations work with generic `FilterClause` objects
5. **Backend Sync**: Operations handle backend synchronization independently of UI

## Key Methods

### Mutations

#### createStudent

```typescript
const success = await createStudent({
  input: {
    name: "John Doe",
    email: "john@example.com",
    gender: "MALE",
  },
});
```

#### partialUpdateStudent

```typescript
const success = await partialUpdateStudent({
  input: {
    id: 123,
    name: "Jane Doe",
  },
});
```

#### deleteStudent

```typescript
const success = await deleteStudent(123);
```

### Pagination

#### onPageChange

```typescript
onPageChange(2); // Go to page 2
```

#### onRowsPerPageChange

```typescript
onRowsPerPageChange(50); // Show 50 rows per page
```

### Sorting

#### updateSort

```typescript
updateSort([{ column: "name", order: "ASC" }]);
```

### Filtering

#### setColumnFilter

```typescript
setColumnFilter(
  {
    columnId: "name",
    operation: "startsWith",
    value: "John",
  },
  "name"
);
```

#### clearFilter

```typescript
clearFilter("name");
```

#### clearAllFilters

```typescript
clearAllFilters();
```

## Store Integration

The operations hook integrates with `useStudentStore` for state persistence:

```typescript
const store = useStudentStore();

// Operations update the store
store.setQueryParams({ filterArgs: { ... } });
store.setFilters({ name: filterClause });
store.toggleStudentSelect(studentId);
```

## Error Handling

All operations include proper error handling:

```typescript
try {
  await createStudent({ input });
  notifications.show("Success!", { severity: "success" });
} catch (error) {
  if (!isAbortError(error)) {
    notifications.show("Error creating student", { severity: "error" });
  }
}
```

## Notifications

Operations automatically show notifications for:

- ✅ Successful create/update/delete
- ❌ Failed operations
- ⚠️ Validation errors

## Testing

No changes to tests are required since the operations interface remains the same.

## Summary

**Action Required:** ✅ None - This file is already compatible

The `useStudentOperations` hook provides a clean, reusable operations layer that works seamlessly with both the old and new table architectures. No modifications are needed for the renderer-based refactor.

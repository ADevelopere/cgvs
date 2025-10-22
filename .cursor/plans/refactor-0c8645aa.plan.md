<!-- 0c8645aa-c369-4baf-9867-94448bc0f249 51a8071f-cb18-4218-b43f-24635f0055fc -->
# Refactor MoveToDialog to Use useQuery

## Changes to MoveToDialog.tsx

### 1. Update imports

Add `useQuery` and `useApolloClient` imports and import the GraphQL document:

```typescript
import { useQuery, useApolloClient } from "@apollo/client/react";
import { directoryChildrenQueryDocument } from "../core/storage.documents";
```

### 2. Remove onFetchDirectoryChildren prop

Update `MoveToDialogProps` interface (lines 18-26):

```typescript
export interface MoveToDialogProps {
  open: boolean;
  onClose: () => void;
  items: StorageItemUnion[];
  // Remove: onFetchDirectoryChildren prop
  onMove: (sourcePaths: string[], destinationPath: string) => Promise<boolean>;
}
```

Update component signature (line 28-34) to remove the prop from destructuring.

### 3. Add apolloClient and query variables state

After line 36, add:

```typescript
const apolloClient = useApolloClient();

// Query variables state
const [queryVariables, setQueryVariables] = useState<Graphql.DirectoryChildrenQueryVariables>({
  path: undefined, // undefined for root
});
```

### 4. Implement useQuery

Replace the manual state management with useQuery (after query variables state):

```typescript
// Use Apollo Client hook to fetch directories
const {
  data,
  loading,
  error: queryError,
} = useQuery(directoryChildrenQueryDocument, {
  variables: queryVariables,
  skip: !open, // Only run query when dialog is open
});
```

### 5. Remove manual state management

Delete these state declarations (lines 40-43):

- `const [directories, setDirectories] = useState<Graphql.DirectoryInfo[]>([]);`
- `const [isLoading, setIsLoading] = useState(false);`
- `const [error, setError] = useState<string | null>(null);`

Keep only UI-specific state:

- `currentPath`
- `isMoving`
- `hoveredItemPath`

### 6. Derive data using useMemo

Replace the state with derived data:

```typescript
// Derive directories from query
const directories = useMemo(() => {
  if (!data?.directoryChildren) return [];
  return data.directoryChildren;
}, [data]);

// Derive error from query
const error = useMemo(() => {
  if (queryError) {
    return translations.moveDialogUnexpectedError || "An unexpected error occurred";
  }
  if (data && !data.directoryChildren) {
    return translations.moveDialogFailedToLoad || "Failed to load directories";
  }
  return null;
}, [queryError, data, translations]);
```

### 7. Remove loadDirectories function

Delete the entire `loadDirectories` callback (lines 47-77).

### 8. Update useEffect for dialog lifecycle

Replace the useEffect (lines 80-91) with one that just resets state and initializes query:

```typescript
// Reset state when dialog opens
useEffect(() => {
  if (open) {
    setCurrentPath("");
    setIsMoving(false);
    setHoveredItemPath(null);
    setQueryVariables({ path: undefined }); // undefined for root
  }
}, [open]);
```

### 9. Update navigateToDirectory

Replace the callback (lines 94-100):

```typescript
const navigateToDirectory = useCallback((path: string) => {
  setCurrentPath(path);
  setQueryVariables({ path: path || undefined }); // empty string becomes undefined
}, []);
```

### 10. Update navigateUp

Replace the callback (lines 208-213):

```typescript
const navigateUp = useCallback(() => {
  if (currentPath) {
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    setCurrentPath(parentPath);
    setQueryVariables({ path: parentPath || undefined }); // empty string becomes undefined
  }
}, [currentPath]);
```

### 11. Update refreshDirectory

Replace the callback (lines 216-218) to use cache eviction:

```typescript
const refreshDirectory = useCallback(() => {
  // Evict the cache for this specific query and variables to force refetch
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "directoryChildren",
    args: queryVariables,
  });
  apolloClient.cache.gc();
}, [apolloClient.cache, queryVariables]);
```

### 12. Update all loading state references

Replace all `isLoading` with `loading` throughout the component:

- Line 191: `handleClose` callback
- Line 199: `handleKeyDown` callback
- Line 221: `canMove` useMemo
- Line 292: navigateUp button disabled
- Line 302: refreshDirectory button disabled
- Line 334: breadcrumb disabled
- Line 345: Directory list loading check
- Line 383: ListItemButton disabled
- Line 461: Cancel button disabled

### 13. Update handleMove

Remove `setError(null)` from line 160 since error is now derived from query, not manually set. Keep error display for move operation failures.

## Summary

- Query automatically refetches when `queryVariables` changes
- No manual async/await for data fetching
- Cleaner, more reactive data flow
- Component becomes self-contained (no need to pass fetch function as prop)
- Uses cache eviction for refresh (not variable spreading)
- Follows the exact pattern from working FilePickerDialog.tsx
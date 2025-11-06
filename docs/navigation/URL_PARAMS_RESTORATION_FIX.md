# URL Params Restoration Fix

## Problem

When navigating from a page with URL parameters (e.g., `http://localhost:3000/admin/categories?tab=all`) to another page and then returning, the URL parameters were lost (URL becomes `http://localhost:3000/admin/categories`), even though the component state (like the active tab) was maintained.

This affected multiple pages:

- `/admin/categories?tab=all` → `/admin/categories`
- `/admin/templates/1/manage?tab=variables` → `/admin/templates/1/manage`

## Root Cause

The navigation context (`PageNavigationRegistryContext`) was saving page state when navigating away and restoring it when returning, BUT it only restored the internal state, not the actual URL. This caused a disconnect where:

1. Component state was correct (tab showed correctly)
2. URL was incorrect (no query parameters)
3. Refreshing the page or sharing the URL wouldn't work correctly

## Solution

### Changes Made

#### 1. `PageNavigationRegistryContext.tsx`

**Added Refs to Avoid Dependency Hell:**

```typescript
// Refs to prevent stale closures and dependency hell
const routerRef = useRef(router);
const pageStatesRef = useRef(state.pageStates);
const pathnameRef = useRef(pathname);
const searchParamsRef = useRef(searchParams);
```

**Updated `resolveCurrentRoute` to Restore URL:**

```typescript
// Restore page state if available for the current route
const savedState = currentPageStates.get(normalizedPath);
const hasCurrentParams = Object.keys(params).length > 0;
const hasSavedState = savedState && Object.keys(savedState).length > 0;

// If we have saved state but no current params, restore the URL
if (hasSavedState && !hasCurrentParams) {
  params = { ...savedState };

  // Update the URL with restored params using router.replace
  const newUrl = buildUrlWithParams(currentPathname || "", params);
  routerRef.current.replace(newUrl);

  logger.info(`Restored URL params for ${normalizedPath}:`, params);
}
```

**Key Points:**

- Uses `useRef` for router, pathname, searchParams, and pageStates to avoid dependency issues
- When returning to a page without params but with saved state, the URL is updated using `router.replace()`
- `router.replace()` is used instead of `router.push()` to avoid adding to browser history
- Params are merged properly (saved state + current params, with current taking precedence)

#### 2. `usePageNavigation.ts`

**Updated Parameter Synchronization:**

```typescript
// Sync params from registry when they change
useEffect(() => {
  const syncParams = () => {
    const currentParams = registryRef.current.getParams();
    const currentParamsString = JSON.stringify(currentParams);

    // Only update if params actually changed
    if (currentParamsString !== paramsStringRef.current) {
      paramsStringRef.current = currentParamsString;
      setParams(currentParams);
    }
  };

  syncParams();
  const interval = setInterval(syncParams, 200);
  return () => clearInterval(interval);
}, []);
```

**Key Points:**

- Uses refs to avoid re-renders and dependency loops
- Polls for param changes every 200ms (lightweight check)
- Only updates state when params actually change (using JSON comparison)

### Updated `updateParams` Function

```typescript
const updateParams = useCallback((params: RouteParams, options?: { replace?: boolean; merge?: boolean }) => {
  const { replace = false, merge = true } = options || {};

  const currentPathname = pathnameRef.current;
  const currentSearchParams = searchParamsRef.current;
  const currentRouter = routerRef.current;

  let newParams = params;
  if (merge) {
    const currentParams = parseSearchParams(currentSearchParams);
    newParams = { ...currentParams, ...params };
  }

  const newUrl = buildUrlWithParams(currentPathname || "", newParams);

  if (replace) {
    currentRouter.replace(newUrl);
  } else {
    currentRouter.push(newUrl);
  }

  setState(prev => ({
    ...prev,
    currentParams: newParams,
  }));
}, []);
```

## How It Works

### Navigation Flow

1. **Initial Page Load**: `/admin/categories?tab=all`
   - Params are parsed and stored in context state
   - Resolvers apply params to component state

2. **Navigate Away**: User clicks to go to `/admin/templates`
   - Current params `{tab: 'all'}` are saved to `pageStates` Map
   - Key: `"admin/categories"`, Value: `{tab: 'all'}`

3. **Navigate Back**: User clicks back to `/admin/categories` (no params in URL)
   - `resolveCurrentRoute` detects:
     - Current URL has no params
     - Saved state exists for this route
   - **NEW**: URL is updated to `/admin/categories?tab=all` using `router.replace()`
   - Params `{tab: 'all'}` are passed to resolvers
   - Resolvers apply params to component state

### Benefits

✅ URL always reflects the current page state  
✅ Refreshing the page works correctly  
✅ Sharing URLs includes all parameters  
✅ Browser back/forward buttons work correctly  
✅ No dependency issues (uses refs)  
✅ No infinite loops

## Testing

To verify the fix works:

1. Go to `http://localhost:3000/admin/categories?tab=all`
2. Click on another page (e.g., Templates)
3. Navigate back to Categories
4. **Expected**: URL should be `http://localhost:3000/admin/categories?tab=all`
5. **Expected**: Tab should be "all" and displayed correctly

Repeat for:

- `http://localhost:3000/admin/templates/1/manage?tab=variables`
- Any other page with URL parameters

## Notes

- The `restorePageState` calls in individual resolvers (like `TemplateCategoryManagementContext`) are now redundant but harmless - the params are already restored before resolvers run
- Using refs avoids React's dependency hell while maintaining correctness
- The 200ms polling interval is lightweight and prevents excessive re-renders
- Future improvement could be implementing a proper observer pattern instead of polling

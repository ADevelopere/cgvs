# URL Parameter Restoration Flow

## Before Fix (Problem)

```d
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User on /admin/categories?tab=all                      │
├─────────────────────────────────────────────────────────────────┤
│ URL: /admin/categories?tab=all                                  │
│ State: { tab: 'all' }                                           │
│ Display: "All" tab is active ✓                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Navigate to /admin/templates
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Navigation Context saves state                         │
├─────────────────────────────────────────────────────────────────┤
│ pageStates.set('admin/categories', { tab: 'all' })            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Navigate back to /admin/categories
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Return to categories (BEFORE FIX) ❌                    │
├─────────────────────────────────────────────────────────────────┤
│ URL: /admin/categories                    ← NO PARAMS!          │
│ State: { tab: 'all' }                     ← State restored      │
│ Display: "All" tab is active ✓            ← UI correct          │
│                                                                  │
│ PROBLEM:                                                         │
│ - URL doesn't match state                                       │
│ - Refresh would show wrong tab                                  │
│ - Can't share URL with correct tab                             │
└─────────────────────────────────────────────────────────────────┘
```

## After Fix (Solution)

```d
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User on /admin/categories?tab=all                      │
├─────────────────────────────────────────────────────────────────┤
│ URL: /admin/categories?tab=all                                  │
│ State: { tab: 'all' }                                           │
│ Display: "All" tab is active ✓                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Navigate to /admin/templates
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Navigation Context saves state                         │
├─────────────────────────────────────────────────────────────────┤
│ pageStates.set('admin/categories', { tab: 'all' })            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Navigate back to /admin/categories
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: resolveCurrentRoute() detects missing params           │
├─────────────────────────────────────────────────────────────────┤
│ Current URL: /admin/categories                                  │
│ Saved state: { tab: 'all' }                                    │
│                                                                  │
│ Decision: hasSavedState && !hasCurrentParams                   │
│ Action: Restore URL parameters ✓                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ router.replace() with saved params
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: URL and State synchronized ✓                           │
├─────────────────────────────────────────────────────────────────┤
│ URL: /admin/categories?tab=all           ← PARAMS RESTORED!     │
│ State: { tab: 'all' }                    ← State restored       │
│ Display: "All" tab is active ✓           ← UI correct           │
│                                                                  │
│ FIXED:                                                          │
│ ✓ URL matches state                                            │
│ ✓ Refresh works correctly                                      │
│ ✓ URL can be shared                                            │
│ ✓ Browser history works                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Code Flow Details

### resolveCurrentRoute() Logic

```typescript
// 1. Get current URL and saved state
const normalizedPath = "admin/categories";
const params = parseSearchParams(searchParams); // {}
const savedState = pageStates.get(normalizedPath); // { tab: 'all' }

// 2. Check conditions
const hasCurrentParams = Object.keys(params).length > 0; // false
const hasSavedState = savedState && Object.keys(savedState).length > 0; // true

// 3. Restore URL if needed
if (hasSavedState && !hasCurrentParams) {
  params = { ...savedState }; // { tab: 'all' }

  // Build new URL: /admin/categories?tab=all
  const newUrl = buildUrlWithParams(pathname, params);

  // Update URL without adding to history
  router.replace(newUrl); // ← KEY FIX!
}

// 4. Pass restored params to resolvers
await resolveRoute(normalizedPath, params); // params = { tab: 'all' }
```

## Why Use `router.replace()` Instead of `router.push()`?

| Method             | Effect                         | Use Case                                      |
| ------------------ | ------------------------------ | --------------------------------------------- |
| `router.push()`    | Adds new entry to history      | User intentionally navigating to new page     |
| `router.replace()` | Replaces current history entry | Correcting URL without creating history entry |

**For URL restoration, we use `replace()` because:**

- User didn't intentionally navigate to `/admin/categories` (without params)
- We're correcting the URL to match the expected state
- Don't want extra history entries when user clicks back

## Example Scenarios

### Scenario 1: Categories Tab

```d
Initial:     /admin/categories?tab=all
Navigate:    /admin/templates
Back:        /admin/categories          ← Missing params
Restored:    /admin/categories?tab=all  ← Fixed! ✓
```

### Scenario 2: Template Management

```d
Initial:     /admin/templates/1/manage?tab=variables&variable=5
Navigate:    /admin/categories
Back:        /admin/templates/1/manage             ← Missing params
Restored:    /admin/templates/1/manage?tab=variables&variable=5  ← Fixed! ✓
```

### Scenario 3: Multiple Params

```d
Initial:     /admin/students?page=2&sort=name&filter=active
Navigate:    /admin/dashboard
Back:        /admin/students                       ← Missing params
Restored:    /admin/students?page=2&sort=name&filter=active  ← Fixed! ✓
```

## Benefits of Using Refs

The fix uses `useRef` to avoid React dependency issues:

```typescript
// Before: Dependencies cause re-render loops
useEffect(() => {
  resolveCurrentRoute();
}, [pathname, searchParams, router, state.pageStates]); // ← Problematic!

// After: Refs prevent dependency hell
const routerRef = useRef(router);
const pageStatesRef = useRef(state.pageStates);

useEffect(() => {
  // Use refs inside callback
  const currentRouter = routerRef.current;
  const savedState = pageStatesRef.current.get(path);
}, []); // ← No dependencies!
```

**Why This Works:**

- Refs always have the latest value
- Changing ref value doesn't trigger re-renders
- No dependency loops
- More predictable behavior

## Testing Checklist

- [ ] Navigate from `/admin/categories?tab=all` to another page and back
- [ ] URL should be `/admin/categories?tab=all` (not `/admin/categories`)
- [ ] Active tab should be "All"
- [ ] Refresh page should maintain tab
- [ ] Navigate from `/admin/templates/1/manage?tab=variables` and back
- [ ] URL should include `?tab=variables`
- [ ] Active tab should be "Variables"
- [ ] Test with multiple parameters
- [ ] Test browser back/forward buttons
- [ ] Test with deleted items tab
- [ ] Verify no console errors
- [ ] Verify no infinite loops

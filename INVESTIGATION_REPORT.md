# Investigation Report: Unnecessary Re-fetching Issues

## Date: October 11, 2025

## Issues Identified

1. **Recipients fetched every time when switching tabs**
2. **Template re-fetched when navigating to another page and returning**

---

## Root Causes Analysis

### Issue 1: Recipients Fetched on Every Tab Switch

**Location:** `client/contexts/recipient/RecipientManagementContext.tsx`

#### Problem

The `RecipientManagementProvider` unmounts and remounts every time you switch tabs because:

1. **Provider Mounting Logic** (Lines 380-440):

   ```tsx
   // Memoize the full provider chain to prevent unnecessary recreations
   const managementProviderChain = useMemo(() => {
     if (selectedGroupId === null) return null;

     return (
       <RecipientGraphQLProvider
         recipientGroupId={selectedGroupId}
         templateId={templateId}
       >
         <ManagementProvider
           selectedGroupId={selectedGroupId}
           setSelectedGroupId={setSelectedGroupId}
         >
           {children}
         </ManagementProvider>
       </RecipientGraphQLProvider>
     );
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedGroupId, setSelectedGroupId, children]);
   ```

   **Problem:** The `useMemo` has `children` in dependencies. In React, `children` is recreated on every render, causing the entire provider chain to remount.

2. **Fetch Effect Trigger** (Lines 216-234 in RecipientManagementContext.tsx):

   ```tsx
   // Fetch students when group changes
   useEffect(() => {
     if (selectedGroupId) {
       fetchStudentsNotInGroup(
         selectedGroupId,
         sort || undefined,
         { page: currentPage, first: rowsPerPage },
         filters || undefined,
       );
     } else {
       // Clear students when no group is selected
       setStudents([]);
       setPageInfo(null);
     }
   }, [
     selectedGroupId,
     currentPage,
     rowsPerPage,
     filters,
     sort,
     fetchStudentsNotInGroup,
   ]);
   ```

   **Why it triggers:**
   - When you switch from "recipients" tab to another tab (like "basic"), the `RecipientManagementProvider` remains mounted (it's in TemplateManagementContext)
   - When you switch back to "recipientsManagement" tab, React re-renders the component tree
   - Since `children` changed in the useMemo, the entire provider chain remounts
   - The useEffect runs again because it's a fresh mount
   - This triggers `fetchStudentsNotInGroup()` again

3. **Tab Structure** (`client/views/templates/management/TemplateManagement.tsx`):

   ```tsx
   <TabPanel value="recipientsManagement">
     <RecipientsManagementTab />
   </TabPanel>
   ```

   Each TabPanel renders its content, but the provider stays mounted at the parent level. However, when the tab becomes visible again, React may reconcile the tree and cause re-renders.

#### Why This Happens on Tab Switch

- `TemplateManagementProvider` wraps `RecipientManagementProvider` at the root
- `RecipientManagementProvider` is ALWAYS mounted (regardless of active tab)
- BUT the `useMemo` with `children` dependency causes provider chain recreation
- When the provider chain recreates, the `useEffect` in `ManagementProvider` runs again
- This fetches recipients again even though nothing actually changed

---

### Issue 2: Template Re-fetched on Page Navigation

**Location:** `client/contexts/template/TemplateManagementContext.tsx`

#### Problem (2)

The template is re-fetched using Apollo's `useQuery` with incorrect fetch policy:

1. **Apollo Query Setup** (Lines 77-81):

   ```tsx
   const { data: apolloTemplateData } = useQuery(Document.templateQueryDocument, {
     variables: { id: id ? parseInt(id, 10) : 0 },
     skip: !id,
     fetchPolicy: "cache-and-network", // ⚠️ THIS IS THE PROBLEM
   });
   ```

   **Why this is wrong:**
   - `fetchPolicy: "cache-and-network"` ALWAYS makes a network request, even if data exists in cache
   - This policy returns cached data immediately, then fetches from network and updates
   - Every time you navigate back to this page, it fetches the template again

2. **Fetch Effect** (Lines 250-309):

   ```tsx
   useEffect(() => {
     const fetchTemplate = async () => {
       setLoading(true);
       try {
         let template: Graphql.Template | undefined | null = undefined;
         // First set from templateToManage if available
         if (templateToManage) {
           template = templateToManage;
         }

         // Then check allTemplates for immediate UI update
         if (id && !templateToManage) {
           const templateId = parseInt(id, 10);
           const localTemplate = allTemplates.find((t) => t.id === templateId);
           template = localTemplate;
         }

         // Finally, if we have Apollo data with additional fields, use that
         if (apolloTemplateData?.template) {
           template = apolloTemplateData.template;
         }
         if (template) {
           settemplate(template);
         } else {
           setError("Template not found");
         }
       } catch (error) {
         // error handling...
       } finally {
         setLoading(false);
       }
     };

     fetchTemplate();
   }, [id, templateToManage, allTemplates, apolloTemplateData]);
   ```

   **Redundant Logic:**
   - This effect tries to get template from three sources
   - But `apolloTemplateData` already triggers re-fetching via `cache-and-network` policy
   - The effect depends on `apolloTemplateData`, which changes on every fetch
   - This creates unnecessary complexity

3. **Why Network Request Happens:**
   - You navigate from template management page to another page (e.g., dashboard)
   - `TemplateManagementProvider` unmounts
   - Apollo keeps the cached data
   - You navigate back to template management page
   - `TemplateManagementProvider` mounts again
   - `useQuery` executes with `fetchPolicy: "cache-and-network"`
   - **Apollo returns cached data BUT ALSO makes a network request**
   - The network request is unnecessary because:
     - Template data rarely changes when you're just navigating around
     - You already have valid cached data
     - The mutations (create/update/delete) update the cache properly

---

## Solutions

### Fix 1: Recipients Re-fetching on Tab Switch

**Option A: Remove `children` from useMemo dependencies** (Recommended)

```tsx
const managementProviderChain = useMemo(() => {
  if (selectedGroupId === null) return null;

  return (
    <RecipientGraphQLProvider
      recipientGroupId={selectedGroupId}
      templateId={templateId}
    >
      <ManagementProvider
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
      >
        {children}
      </ManagementProvider>
    </RecipientGraphQLProvider>
  );
}, [selectedGroupId, templateId, setSelectedGroupId]); // Remove children
```

**Why this works:**

- `children` prop doesn't affect the provider logic itself
- The provider chain only needs to recreate when `selectedGroupId` or `templateId` changes
- React will still properly reconcile children when they change

**Option B: Conditional Mounting Based on Active Tab**
Only mount `RecipientManagementProvider` when relevant tabs are active:

```tsx
<TemplateVariableManagementProvider templateId={template?.id}>
  {(activeTab === 'recipients' || activeTab === 'recipientsManagement') ? (
    <RecipientManagementProvider templateId={template.id}>
      {children}
    </RecipientManagementProvider>
  ) : children}
</TemplateVariableManagementProvider>
```

**Option C: Use Apollo Query Skip**
Add skip logic based on active tab in the queries.

### Fix 2: Template Re-fetching on Navigation

**Option A: Change fetch policy to cache-first** (Recommended)

```tsx
const { data: apolloTemplateData } = useQuery(Document.templateQueryDocument, {
  variables: { id: id ? parseInt(id, 10) : 0 },
  skip: !id,
  fetchPolicy: "cache-first", // Only fetch if not in cache
});
```

**Why this works:**

- `cache-first`: Check cache first, only fetch from network if data is missing
- Since mutations update the cache properly (as seen in RecipientGraphQLContext), cache stays fresh
- No unnecessary network requests when navigating between pages
- Still gets fresh data on initial load or after cache is cleared

#### Option B: Use notifyOnNetworkStatusChange: false

```tsx
const { data: apolloTemplateData } = useQuery(Document.templateQueryDocument, {
  variables: { id: id ? parseInt(id, 10) : 0 },
  skip: !id,
  fetchPolicy: "cache-and-network",
  notifyOnNetworkStatusChange: false, // Don't trigger re-renders on network status changes
});
```

**Option C: Simplify the fetch logic**
Remove the complex `useEffect` and rely solely on Apollo:

```tsx
const { data: apolloTemplateData, loading, error } = useQuery(
  Document.templateQueryDocument, 
  {
    variables: { id: id ? parseInt(id, 10) : 0 },
    skip: !id,
    fetchPolicy: "cache-first",
  }
);

const template = apolloTemplateData?.template;
```

---

## Additional Observations

### 1. Over-complicated State Management

- Multiple sources of truth for the same data (templateToManage, allTemplates, apolloTemplateData)
- The `fetchTemplate` useEffect is trying to reconcile all these sources
- This creates unnecessary complexity and potential bugs

### 2. Apollo Cache is Properly Configured

Looking at `RecipientGraphQLContext.tsx`, the mutations properly update the Apollo cache:

- `createRecipientsMutation` updates cache with new recipients
- `deleteRecipientsMutation` updates cache removing deleted recipients
- Template query cache is also updated

This means you CAN safely use `cache-first` because the cache is kept in sync.

### 3. Navigation System Integration

The context uses `usePageNavigation` for URL params:

- This adds complexity but isn't directly causing the refetch issues
- The navigation resolver runs on mount, which could contribute to multiple renders

---

## Impact Assessment

### Current Behavior

1. **Tab Switch:**
   - Every switch to "recipientsManagement" tab fetches students
   - Unnecessary load time: ~100-500ms per switch
   - Unnecessary server load
   - Poor UX with loading states

2. **Page Navigation:**
   - Every return to template management page fetches template
   - Unnecessary load time: ~100-500ms per navigation
   - Unnecessary server load
   - Flashing/loading states visible to user

### After Fixes

1. **Tab Switch:**
   - No fetching when switching tabs (unless selectedGroupId changes)
   - Instant tab switching
   - Better UX

2. **Page Navigation:**
   - No fetching when returning to page (data served from cache)
   - Instant page load
   - Only fetches on first visit or when cache is stale

---

## Recommended Action Plan

### Priority 1 (High Impact, Easy Fix)

1. **Fix Template Fetch Policy**
   - Change `fetchPolicy` from `"cache-and-network"` to `"cache-first"` in TemplateManagementContext.tsx line 80
   - Test navigation between pages

### Priority 2 (High Impact, Medium Complexity)

1. **Fix Recipients Provider Remounting**
   - Remove `children` from `useMemo` dependencies in RecipientManagementContext.tsx line 424
   - Test tab switching behavior

### Priority 3 (Code Quality)

1. **Simplify Template State Management**
   - Remove redundant `fetchTemplate` useEffect
   - Rely solely on Apollo query data
   - Remove multiple sources of truth

### Priority 4 (Optimization)

1. **Consider Conditional Provider Mounting**
   - Only mount RecipientManagementProvider when needed
   - Further reduce unnecessary provider instantiation

---

## Testing Checklist

After implementing fixes:

- [ ] Switch between tabs multiple times - check Network tab for requests
- [ ] Navigate to another page and back - check Network tab for requests
- [ ] Create a recipient - verify cache updates correctly
- [ ] Delete a recipient - verify cache updates correctly
- [ ] Update a template - verify cache updates correctly
- [ ] Browser refresh - verify data loads correctly
- [ ] Check console for any Apollo cache warnings

---

## Files to Modify

1. `/home/pc/Projects/cgsvNew/client/contexts/template/TemplateManagementContext.tsx`
   - Line 80: Change fetch policy

2. `/home/pc/Projects/cgsvNew/client/contexts/recipient/RecipientManagementContext.tsx`
   - Line 424: Remove `children` from useMemo dependencies

3. Optional cleanup:
   - Simplify fetchTemplate useEffect in TemplateManagementContext.tsx
   - Consider refactoring template state management

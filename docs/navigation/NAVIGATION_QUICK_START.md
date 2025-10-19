# Navigation System - Quick Start Guide

## Overview

This new navigation system provides a **dynamic, type-safe, and plugin-based** approach to managing page navigation state. Instead of hardcoding tab management in each context, the system uses **resolvers** that handle URL parameters and set up the appropriate state.

## Key Benefits

1. **Dynamic**: No hardcoded tabs or navigation structure
2. **Type-safe**: Type safety at the feature level, not the framework level
3. **URL-friendly**: Full deep linking support - paste any URL and it works
4. **Recursive**: Supports nested navigation (directories, sub-tabs, etc.)
5. **Decoupled**: The navigation registry knows nothing about your features
6. **Clean**: Each feature registers its own navigation logic

## Quick Implementation (5 Steps)

### Step 1: Import the Hook

```tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";
```

### Step 2: Use the Hook in Your Context

```tsx
export const YourContextProvider = ({ children }) => {
  const { registerResolver, updateParams } = usePageNavigation();

  // Your state...
  const [activeTab, setActiveTab] = useState("default");

  // ... rest of your context
};
```

### Step 3: Register a Resolver

```tsx
useEffect(() => {
  const unregister = registerResolver({
    segment: "admin/your-page", // Your route segment
    resolver: async params => {
      // Handle URL params here
      if (params.tab) {
        setActiveTab(params.tab as string);
      }

      return { success: true };
    },
    priority: 10, // Higher = runs first
  });

  return unregister; // Cleanup on unmount
}, [registerResolver]);
```

### Step 4: Update URL When State Changes

```tsx
const changeTab = useCallback(
  (tab: string) => {
    setActiveTab(tab);
    updateParams({ tab }, { replace: true, merge: true });
  },
  [updateParams]
);
```

### Step 5: Test Deep Linking

Open your app with URL params:

- `http://localhost:3000/admin/your-page?tab=editor`
- It should work immediately!

## Common Patterns

### Pattern 1: Tab Navigation

```tsx
// In your context
const [activeTab, setActiveTab] = useState<TabType>("default");

useEffect(() => {
  return registerResolver({
    segment: "admin/templates/:id/manage",
    resolver: async params => {
      if (params.tab) {
        setActiveTab(params.tab as TabType);
      }
      return { success: true };
    },
  });
}, [registerResolver]);

// When user clicks a tab
const handleTabChange = (tab: TabType) => {
  setActiveTab(tab);
  updateParams({ tab }, { replace: true, merge: true });
};
```

**URLs:**

- `/admin/templates/123/manage?tab=editor`
- `/admin/templates/123/manage?tab=preview`

### Pattern 2: Directory/Path Navigation

```tsx
// In your context
const [currentPath, setCurrentPath] = useState("");

useEffect(() => {
  return registerResolver({
    segment: "admin/storage",
    resolver: async params => {
      if (params.path) {
        await navigateToPath(params.path as string);
      }
      return { success: true };
    },
    recursive: true, // Important for nested paths!
  });
}, [registerResolver]);

// When user navigates
const navigateTo = (path: string) => {
  setCurrentPath(path);
  updateParams({ path }, { replace: true, merge: true });
};
```

**URLs:**

- `/admin/storage?path=documents`
- `/admin/storage?path=documents/2024/reports`

### Pattern 3: Selection State

```tsx
// In your context
const [selectedId, setSelectedId] = useState<number | null>(null);

useEffect(() => {
  return registerResolver({
    segment: "admin/categories",
    resolver: async params => {
      if (params.categoryId) {
        const id = parseInt(params.categoryId as string, 10);
        if (!isNaN(id)) {
          setSelectedId(id);
        }
      }
      return { success: true };
    },
  });
}, [registerResolver]);

// When user selects an item
const selectItem = (id: number) => {
  setSelectedId(id);
  updateParams({ categoryId: String(id) }, { replace: true, merge: true });
};
```

**URLs:**

- `/admin/categories?categoryId=5`
- `/admin/categories?categoryId=5&templateId=10`

### Pattern 4: Multiple Params

```tsx
useEffect(() => {
  return registerResolver({
    segment: "admin/storage",
    resolver: async params => {
      // Handle multiple params
      if (params.path) {
        setPath(params.path as string);
      }
      if (params.view) {
        setView(params.view as "grid" | "list");
      }
      if (params.sortBy) {
        setSortBy(params.sortBy as string);
      }

      return { success: true };
    },
  });
}, [registerResolver]);
```

**URLs:**

- `/admin/storage?path=docs&view=list&sortBy=date`

## Helper Hooks

### useParam - Get a Single Param

```tsx
import { useParam } from "@/client/contexts/usePageNavigation";

const tab = useParam<string>("tab", "basic"); // With default value
const categoryId = useParam<number>("categoryId");
```

### useParamState - Like useState but for URL Params

```tsx
import { useParamState } from "@/client/contexts/usePageNavigation";

const [tab, setTab] = useParamState<string>("tab", "basic");

// Changing tab updates both state AND URL
setTab("editor");
```

## Resolver Options

```tsx
registerResolver({
  segment: "admin/your-page", // Route pattern
  resolver: async params => {}, // Handler function
  priority: 10, // Execution order (optional)
  recursive: false, // Handle child routes (optional)
});
```

### Priority

- **10+**: High priority (parent/main resolvers)
- **5-9**: Medium priority (feature-specific resolvers)
- **1-4**: Low priority (sub-component resolvers)
- **0**: Lowest priority (fallback resolvers)

### Recursive

Set `recursive: true` for routes that have nested children:

- Storage directories: `/admin/storage/path/to/nested/folder`
- Category hierarchies: `/admin/categories/parent/child/grandchild`

## Route Patterns

### Static Routes

```tsx
segment: "admin/templates";
```

Matches: `/admin/templates`

### Dynamic Routes (with params)

```tsx
segment: "admin/templates/:id/manage";
```

Matches:

- `/admin/templates/123/manage`
- `/admin/templates/456/manage`

Params extracted: `{ id: "123" }`

### Nested Routes

```tsx
segment: "admin/storage";
recursive: true;
```

Matches:

- `/admin/storage`
- `/admin/storage/documents`
- `/admin/storage/documents/2024/reports`

## Tips & Best Practices

### ✅ DO

- **Always return from useEffect**: Register resolvers in `useEffect` and return the cleanup function
- **Use merge: true**: Preserve existing params when updating
- **Validate params**: Check if params exist and are valid before using
- **Use priority**: Order resolvers correctly for predictable behavior
- **Test deep linking**: Always test by pasting URLs directly

### ❌ DON'T

- **Don't register outside useEffect**: Resolvers must be registered in `useEffect`
- **Don't forget cleanup**: Always return the unregister function
- **Don't overwrite params**: Use `merge: true` unless you want to clear all params
- **Don't ignore errors**: Handle resolution failures gracefully
- **Don't hardcode logic in registry**: Keep feature logic in feature contexts

## Troubleshooting

### "Resolver not being called"

1. Check that the segment matches your route
2. Verify the resolver is registered (check console logs)
3. Ensure you're returning the unregister function from useEffect

### "Params not updating URL"

Make sure you're calling `updateParams`:

```tsx
updateParams({ tab: "editor" }, { replace: true, merge: true });
```

### "URL updating but state not changing"

Your resolver might not be handling the param:

```tsx
resolver: async params => {
  if (params.tab) {
    // <- Check this
    setActiveTab(params.tab as string);
  }
  return { success: true };
};
```

### "Multiple resolvers conflicting"

Use priority to control execution order:

```tsx
// Parent resolver
registerResolver({ segment: "admin/templates/:id/manage", priority: 10, ... });

// Child resolver
registerResolver({ segment: "admin/templates/:id/manage", priority: 5, ... });
```

## Next Steps

- Read [PAGE_NAVIGATION_SYSTEM.md](./PAGE_NAVIGATION_SYSTEM.md) for complete documentation
- See [NAVIGATION_IMPLEMENTATION_EXAMPLES.md](./NAVIGATION_IMPLEMENTATION_EXAMPLES.md) for detailed examples
- Check the TemplateManagementContext for a real implementation example

## Example: Complete Implementation

Here's a complete example showing all pieces together:

```tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export type TabType = "basic" | "advanced" | "settings";

export const MyFeatureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { registerResolver, updateParams } = usePageNavigation();

  // State
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Register navigation resolver
  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/my-feature",
      resolver: async params => {
        try {
          // Handle tab param
          if (params.tab) {
            const tab = params.tab as TabType;
            if (["basic", "advanced", "settings"].includes(tab)) {
              setActiveTab(tab);
            }
          }

          // Handle selection param
          if (params.itemId) {
            const id = parseInt(params.itemId as string, 10);
            if (!isNaN(id)) {
              setSelectedItemId(id);
            }
          }

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Failed",
          };
        }
      },
      priority: 10,
    });

    return unregister;
  }, [registerResolver]);

  // Change tab function
  const changeTab = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      updateParams({ tab }, { replace: true, merge: true });
    },
    [updateParams]
  );

  // Select item function
  const selectItem = useCallback(
    (itemId: number | null) => {
      setSelectedItemId(itemId);
      if (itemId !== null) {
        updateParams(
          { itemId: String(itemId) },
          { replace: true, merge: true }
        );
      } else {
        updateParams({ itemId: undefined }, { replace: true, merge: true });
      }
    },
    [updateParams]
  );

  const value = {
    activeTab,
    selectedItemId,
    changeTab,
    selectItem,
  };

  return (
    <MyFeatureContext.Provider value={value}>
      {children}
    </MyFeatureContext.Provider>
  );
};
```

**Test URLs:**

- `/admin/my-feature` → Default state
- `/admin/my-feature?tab=advanced` → Advanced tab
- `/admin/my-feature?tab=settings&itemId=5` → Settings tab with item 5 selected

---

**Ready to implement?** Start with Step 1 and you'll have it working in minutes!

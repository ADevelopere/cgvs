# Page Navigation System

## Overview

The Page Navigation System is a plugin-based architecture for managing navigation state across dashboard pages. It provides a flexible, type-safe way to handle:

- URL parameters (query params and path params)
- Tab states and nested navigation
- Deep linking support
- Sub-component navigation
- Complex nested state management

## Architecture

### Core Concepts

1. **Orchestrator Pattern**: The navigation registry acts as a central orchestrator that knows nothing about specific features. It only provides the mechanism for registration and resolution.

2. **Resolver-based Navigation**: Each feature context registers resolver functions that handle URL params and set up the appropriate internal state.

3. **Automatic Resolution**: When the URL changes (or on initial load), the registry automatically calls matching resolvers with the current params.

4. **Type-safe but Dynamic**: The system is type-safe at the edges (in feature contexts) but dynamic in the core, allowing any feature to define its own navigation patterns.

## Key Components

### 1. PageNavigationRegistryContext

The central orchestrator that:

- Stores registered resolvers
- Extracts URL params
- Calls matching resolvers when the URL changes
- Provides API for param updates

### 2. usePageNavigation Hook

The primary interface for feature contexts to:

- Register navigation resolvers
- Access current URL params
- Update params programmatically
- Trigger resolution

### 3. Navigation Resolver

A function that takes URL params and returns a resolution result:

```typescript
type NavigationResolver = (
  params: RouteParams,
  context?: unknown
) => Promise<NavigationResolution> | NavigationResolution;

interface NavigationResolution {
  success: boolean;
  params?: RouteParams;
  error?: string;
  redirect?: string;
}
```

## Usage Examples

### Example 1: Template Management (Tab Navigation)

```tsx
// In TemplateManagementContext.tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export const TemplateManagementProvider = ({ children }) => {
  const { registerResolver, updateParams } = usePageNavigation();
  const [activeTab, setActiveTab] = useState<TemplateManagementTabType>("basic");

  // Register resolver for this route
  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/templates/:id/manage",
      resolver: async params => {
        // Handle tab parameter
        const tab = params.tab as TemplateManagementTabType;
        if (tab && ["basic", "variables", "editor", "recipients", "preview"].includes(tab)) {
          setActiveTab(tab);
        }

        // Handle nested params (e.g., variable selection within editor tab)
        if (tab === "editor" && params.variableId) {
          const variableId = parseInt(params.variableId as string, 10);
          // Sub-component can register its own resolver for this
        }

        return { success: true };
      },
      priority: 10,
    });

    return unregister;
  }, [registerResolver]);

  // When user changes tab
  const changeTab = (tab: TemplateManagementTabType) => {
    setActiveTab(tab);
    updateParams({ tab }, { replace: true, merge: true });
  };

  // ...
};
```

**URL Examples:**

- `/admin/templates/123/manage` → Opens basic tab (default)
- `/admin/templates/123/manage?tab=editor` → Opens editor tab
- `/admin/templates/123/manage?tab=editor&variableId=5` → Opens editor tab with variable 5 selected

### Example 2: Storage (Directory Navigation)

```tsx
// In StorageManagementUIContext.tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export const StorageManagementUIProvider = ({ children }) => {
  const { registerResolver, updateParams } = usePageNavigation();
  const [currentPath, setCurrentPath] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/storage",
      resolver: async params => {
        // Handle directory path
        if (params.path) {
          const path = params.path as string;
          await navigateToDirectory(path);
        }

        // Handle view mode
        if (params.view) {
          const view = params.view as "grid" | "list";
          setViewMode(view);
        }

        // Handle sort params
        if (params.sortBy) {
          setSortBy(params.sortBy as string);
        }

        return { success: true };
      },
      priority: 10,
      recursive: true, // Also handle nested directories
    });

    return unregister;
  }, [registerResolver]);

  // When navigating to a directory
  const navigateTo = async (path: string) => {
    setCurrentPath(path);
    updateParams({ path }, { replace: true, merge: true });
  };

  // When changing view mode
  const changeViewMode = (view: "grid" | "list") => {
    setViewMode(view);
    updateParams({ view }, { replace: true, merge: true });
  };

  // ...
};
```

**URL Examples:**

- `/admin/storage` → Root directory, grid view
- `/admin/storage?path=documents/2024` → Opens documents/2024 directory
- `/admin/storage?path=images&view=list&sortBy=date` → Opens images directory in list view, sorted by date

### Example 3: Template Categories (Tab + Selection)

```tsx
// In TemplateCategoryManagementContext.tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export const TemplateCategoryManagementProvider = ({ children }) => {
  const { registerResolver, updateParams } = usePageNavigation();
  const [activeView, setActiveView] = useState<"categories" | "suspended">("categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/categories",
      resolver: async params => {
        // Handle view parameter (categories vs suspended)
        if (params.view) {
          const view = params.view as "categories" | "suspended";
          setActiveView(view);
        }

        // Handle category selection
        if (params.categoryId) {
          const categoryId = parseInt(params.categoryId as string, 10);
          setSelectedCategoryId(categoryId);

          // Could also auto-expand category tree to show selected category
        }

        return { success: true };
      },
      priority: 10,
    });

    return unregister;
  }, [registerResolver]);

  // When selecting a category
  const selectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    updateParams({ categoryId: String(categoryId) }, { replace: true, merge: true });
  };

  // When switching views
  const switchView = (view: "categories" | "suspended") => {
    setActiveView(view);
    updateParams({ view }, { replace: true, merge: true });
  };

  // ...
};
```

**URL Examples:**

- `/admin/categories` → Shows categories view
- `/admin/categories?view=suspended` → Shows suspended templates
- `/admin/categories?categoryId=5` → Shows categories with category 5 selected
- `/admin/categories?view=categories&categoryId=5` → Shows categories view with category 5 selected

### Example 4: Nested Resolvers (Sub-component Navigation)

```tsx
// In a sub-component like VariableEditor.tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export const VariableEditor = () => {
  const { registerResolver, updateParams } = usePageNavigation();
  const [selectedVariableId, setSelectedVariableId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/templates/:id/manage",
      resolver: async params => {
        // Only handle if we're on the variables tab
        if (params.tab !== "variables") {
          return { success: true };
        }

        // Handle variable selection
        if (params.variableId) {
          const variableId = parseInt(params.variableId as string, 10);
          setSelectedVariableId(variableId);
        }

        // Handle editor mode
        if (params.mode) {
          setEditorMode(params.mode as "edit" | "preview");
        }

        return { success: true };
      },
      priority: 5, // Lower priority than parent resolver
    });

    return unregister;
  }, [registerResolver]);

  // When selecting a variable
  const selectVariable = (variableId: number) => {
    setSelectedVariableId(variableId);
    updateParams({ variableId: String(variableId) }, { replace: true, merge: true });
  };

  // ...
};
```

**URL Examples:**

- `/admin/templates/123/manage?tab=variables` → Shows variables tab
- `/admin/templates/123/manage?tab=variables&variableId=7` → Shows variables tab with variable 7 selected
- `/admin/templates/123/manage?tab=variables&variableId=7&mode=preview` → Shows variable 7 in preview mode

## Best Practices

### 1. Register Resolvers in useEffect

Always register resolvers in a `useEffect` hook and return the unregister function:

```tsx
useEffect(() => {
    const unregister = registerResolver({...});
    return unregister;
}, [registerResolver]);
```

### 2. Use Priority for Resolver Order

If multiple resolvers could match a route, use priority to control execution order:

- Parent/general resolvers: priority 5-10
- Specific/sub-component resolvers: priority 1-5
- Fallback resolvers: priority 0

### 3. Merge Params When Updating

Use `merge: true` to preserve existing params when updating:

```tsx
updateParams({ tab: "editor" }, { replace: true, merge: true });
```

### 4. Handle Missing Params Gracefully

Always check if params exist before using them:

```tsx
resolver: async params => {
  const tab = params.tab as string | undefined;
  if (tab && validTabs.includes(tab)) {
    setActiveTab(tab);
  } else {
    // Use default or show error
    setActiveTab("basic");
  }
  return { success: true };
};
```

### 5. Use Recursive Resolvers for Hierarchical Routes

For pages with nested routes (like storage directories), use `recursive: true`:

```tsx
registerResolver({
  segment: "admin/storage",
  resolver: async params => {
    /* ... */
  },
  recursive: true, // Will handle admin/storage/any/nested/path
});
```

### 6. Validate Params

Add validation to ensure params are in the expected format:

```tsx
resolver: async params => {
  const categoryId = params.categoryId as string;
  if (categoryId && isNaN(Number(categoryId))) {
    return {
      success: false,
      error: "Invalid category ID",
    };
  }
  // ...
};
```

## Advanced Patterns

### Pattern 1: Conditional Resolvers

Resolvers can conditionally handle params based on other params:

```tsx
resolver: async params => {
  // Only handle if on a specific tab
  if (params.tab === "editor") {
    // Handle editor-specific params
  } else if (params.tab === "preview") {
    // Handle preview-specific params
  }
  return { success: true };
};
```

### Pattern 2: Async Resolution with Data Fetching

Resolvers can fetch data before resolving:

```tsx
resolver: async params => {
  const templateId = params.id as string;

  try {
    const template = await fetchTemplate(parseInt(templateId, 10));
    setTemplate(template);

    // Then handle tab
    if (params.tab) {
      setActiveTab(params.tab as TabType);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to load template",
    };
  }
};
```

### Pattern 3: Redirect on Invalid State

Resolvers can trigger redirects if params are invalid:

```tsx
resolver: async params => {
  const tab = params.tab as string;

  if (tab && !validTabs.includes(tab)) {
    return {
      success: false,
      error: "Invalid tab",
      redirect: "/admin/templates", // Redirect to templates list
    };
  }

  return { success: true };
};
```

### Pattern 4: Param Normalization

Resolvers can normalize params and return them to update the URL:

```tsx
resolver: async params => {
  let normalizedParams = { ...params };

  // Normalize view param
  if (params.view === "g") {
    normalizedParams.view = "grid";
  } else if (params.view === "l") {
    normalizedParams.view = "list";
  }

  return {
    success: true,
    params: normalizedParams, // Will update URL with normalized params
  };
};
```

## Helper Hooks

### useParam

Get a single param with type casting:

```tsx
import { useParam } from "@/client/contexts/usePageNavigation";

const tab = useParam<TemplateManagementTabType>("tab", "basic");
const categoryId = useParam<number>("categoryId");
```

### useParamState

Manage a single param like `useState`:

```tsx
import { useParamState } from "@/client/contexts/usePageNavigation";

const [tab, setTab] = useParamState<TemplateManagementTabType>("tab", "basic");

// Updates both state and URL
setTab("editor");
```

### useNavigationResolver

Register a resolver with automatic cleanup:

```tsx
import { useNavigationResolver } from "@/client/contexts/usePageNavigation";

useNavigationResolver(
  {
    segment: "admin/templates/:id/manage",
    resolver: async params => {
      // Handle params
      return { success: true };
    },
  },
  [
    /* deps */
  ]
);
```

## Debugging

### View Registered Resolvers

Access the registry API to see all registered resolvers:

```tsx
import { usePageNavigationRegistry } from "@/client/contexts/PageNavigationRegistryContext";

const registry = usePageNavigationRegistry();
const resolvers = registry.getRegisteredResolvers();

console.log("Registered resolvers:", resolvers);
```

### Check if Resolver Exists

```tsx
const hasResolver = registry.hasResolver("admin/templates/:id/manage");
console.log("Has resolver:", hasResolver);
```

### Manual Resolution

Trigger resolution manually:

```tsx
const results = await registry.resolveCurrentRoute();
console.log("Resolution results:", results);
```

## Migration Guide

### From Old System to New System

**Before:**

```tsx
const searchParams = useSearchParams();
const tab = searchParams.get("tab") || "basic";

useEffect(() => {
  setActiveTab(tab);
}, [tab]);
```

**After:**

```tsx
const { registerResolver, updateParams } = usePageNavigation();

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

// When changing tab:
updateParams({ tab: "editor" }, { replace: true, merge: true });
```

## Future Enhancements

- **Param schemas**: Define param schemas for validation
- **Route guards**: Add guards that can prevent navigation
- **History management**: Track navigation history
- **Breadcrumbs**: Auto-generate breadcrumbs from navigation state
- **Analytics**: Track navigation events for analytics

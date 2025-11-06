# Navigation System Implementation Examples

This document provides concrete examples for implementing the new navigation system in various contexts.

## Example 1: StorageManagementUIContext

```tsx
// Add to imports
import { usePageNavigation } from "../usePageNavigation";

export const StorageManagementUIProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const coreContext = useStorageManagementCore();
  const {
    storageTranslations: { ui: translations },
  } = useAppTranslation();

  // Add the navigation hook
  const { registerResolver, updateParams } = usePageNavigation();

  // ... existing state ...

  // Register navigation resolver
  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/storage",
      resolver: async params => {
        try {
          // Handle directory path
          if (params.path && params.path !== queryParams.path) {
            const path = params.path as string;
            setQueryParams(prev => ({ ...prev, path, offset: 0 }));
          }

          // Handle view mode
          if (params.view) {
            const view = params.view as ViewMode;
            if (["grid", "list"].includes(view)) {
              setViewMode(view);
            }
          }

          // Handle sort parameters
          if (params.sortBy) {
            setSortBy(params.sortBy as string);
          }

          if (params.sortDirection) {
            const direction = params.sortDirection as Graphql.OrderSortDirection;
            if (["ASC", "DESC"].includes(direction)) {
              setSortDirection(direction);
            }
          }

          // Handle file type filter
          if (params.fileType) {
            setParams({ fileType: params.fileType as Graphql.FileType });
          }

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Navigation failed",
          };
        }
      },
      priority: 10,
      recursive: true, // Handle nested directory paths
    });

    return unregister;
  }, [registerResolver, queryParams.path]);

  // Update navigateTo to also update URL params
  const navigateTo = useCallback(
    async (path: string) => {
      // Avoid unnecessary navigation to the same path
      if (queryParams.path === path) {
        return;
      }

      // Update state
      const newParams = { ...queryParams, path, offset: 0 };
      setQueryParams(newParams);

      // Update URL
      updateParams({ path }, { replace: true, merge: true });

      // Clear selection and search state
      setSelectedItems([]);
      setLastSelectedItem(null);

      if (searchMode) {
        setSearchMode(false);
        setSearchResults([]);
      }
    },
    [queryParams, searchMode, updateParams]
  );

  // Update setViewMode to update URL
  const changeViewMode = useCallback(
    (view: ViewMode) => {
      setViewMode(view);
      updateParams({ view }, { replace: true, merge: true });
    },
    [updateParams]
  );

  // Update setSortBy to update URL
  const changeSortBy = useCallback(
    (field: string) => {
      setSortBy(field);
      updateParams({ sortBy: field }, { replace: true, merge: true });
    },
    [updateParams]
  );

  // Update setSortDirection to update URL
  const changeSortDirection = useCallback(
    (direction: Graphql.OrderSortDirection) => {
      setSortDirection(direction);
      updateParams({ sortDirection: direction }, { replace: true, merge: true });
    },
    [updateParams]
  );

  // ... rest of implementation ...
};
```

### URLs Supported

- `/admin/storage` - Root directory
- `/admin/storage?path=documents/2024` - Navigate to specific directory
- `/admin/storage?path=images&view=list` - Directory with list view
- `/admin/storage?path=files&sortBy=date&sortDirection=DESC` - With sorting

## Example 2: TemplateCategoryManagementContext

```tsx
// Add to imports
import { usePageNavigation } from "../usePageNavigation";

export const TemplateCategoryManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { templateCategoryTranslations: messages } = useAppTranslation();
  const notifications = useNotifications();
  const { setNavigation } = useDashboardLayout();
  const router = useRouter();

  // Add the navigation hook
  const { registerResolver, updateParams } = usePageNavigation();

  // ... existing state ...

  // Add a state for active view
  const [activeView, setActiveView] = useState<"categories" | "suspended">("categories");

  // Register navigation resolver
  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/categories",
      resolver: async params => {
        try {
          // Handle view parameter (categories vs suspended templates)
          if (params.view) {
            const view = params.view as "categories" | "suspended";
            if (["categories", "suspended"].includes(view)) {
              setActiveView(view);
            }
          }

          // Handle category selection
          if (params.categoryId) {
            const categoryId = parseInt(params.categoryId as string, 10);
            if (!isNaN(categoryId)) {
              // Find and select the category
              const category = findCategoryInTreeById(allCategoriesFromCache, categoryId);
              if (category) {
                setCurrentCategory(category);
              }
            }
          }

          // Handle template selection within category
          if (params.templateId) {
            const templateId = parseInt(params.templateId as string, 10);
            if (!isNaN(templateId)) {
              const template = allTemplatesFromCache.find(t => t.id === templateId);
              if (template) {
                setCurrentTemplate(template);
              }
            }
          }

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Navigation failed",
          };
        }
      },
      priority: 10,
    });

    return unregister;
  }, [registerResolver, allCategoriesFromCache, allTemplatesFromCache, setCurrentCategory]);

  // Update trySelectCategory to update URL
  const trySelectCategory = useCallback(
    async (category: Graphql.TemplateCategory | null): Promise<boolean> => {
      if (isAddingTemplate) {
        setIsSwitchWarningOpen(true);
        setPendingCategory(category);
        return false;
      }

      setCurrentCategory(category);

      // Update URL with selected category
      if (category) {
        updateParams({ categoryId: String(category.id) }, { replace: true, merge: true });
      } else {
        updateParams({ categoryId: undefined }, { replace: true, merge: true });
      }

      return true;
    },
    [isAddingTemplate, setCurrentCategory, updateParams]
  );

  // Add a function to switch views
  const switchView = useCallback(
    (view: "categories" | "suspended") => {
      setActiveView(view);
      updateParams({ view }, { replace: true, merge: true });

      // When switching to suspended, show the suspension category
      if (view === "suspended" && suspensionCategoryFromCache) {
        setCurrentCategory(suspensionCategoryFromCache);
      } else if (view === "categories") {
        // Clear current category or select first regular category
        setCurrentCategory(sortedRegularCategories[0] || null);
      }
    },
    [updateParams, suspensionCategoryFromCache, sortedRegularCategories, setCurrentCategory]
  );

  // Update context value to include new functions
  const value: TemplateCategoryManagementContextType = useMemo(
    () => ({
      // ... existing values ...
      activeView,
      switchView,
    }),
    [
      // ... existing deps ...
      activeView,
      switchView,
    ]
  );

  // ... rest of implementation ...
};
```

### URLs Supported

- `/admin/categories` - Default categories view
- `/admin/categories?view=suspended` - Suspended templates view
- `/admin/categories?categoryId=5` - Select specific category
- `/admin/categories?categoryId=5&templateId=10` - Select category and template

## Example 3: StudentProvider (Simpler Example)

```tsx
// Add to imports
import { usePageNavigation } from "../usePageNavigation";

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registerResolver, updateParams } = usePageNavigation();

  const [activeTab, setActiveTab] = useState<"all" | "groups" | "archived">("all");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Register navigation resolver
  useEffect(() => {
    const unregister = registerResolver({
      segment: "admin/students",
      resolver: async params => {
        // Handle tab
        if (params.tab) {
          const tab = params.tab as "all" | "groups" | "archived";
          if (["all", "groups", "archived"].includes(tab)) {
            setActiveTab(tab);
          }
        }

        // Handle student selection
        if (params.studentId) {
          const studentId = parseInt(params.studentId as string, 10);
          if (!isNaN(studentId)) {
            setSelectedStudentId(studentId);
          }
        }

        // Handle group filter
        if (params.groupId && params.tab === "groups") {
          // Could filter by group
        }

        return { success: true };
      },
      priority: 10,
    });

    return unregister;
  }, [registerResolver]);

  const changeTab = useCallback(
    (tab: "all" | "groups" | "archived") => {
      setActiveTab(tab);
      updateParams({ tab }, { replace: true, merge: true });
    },
    [updateParams]
  );

  const selectStudent = useCallback(
    (studentId: number | null) => {
      setSelectedStudentId(studentId);
      if (studentId) {
        updateParams({ studentId: String(studentId) }, { replace: true, merge: true });
      } else {
        updateParams({ studentId: undefined }, { replace: true, merge: true });
      }
    },
    [updateParams]
  );

  // ... rest of implementation ...
};
```

### URLs Supported

- `/admin/students` - All students (default)
- `/admin/students?tab=groups` - Student groups tab
- `/admin/students?tab=archived` - Archived students
- `/admin/students?studentId=123` - Select specific student
- `/admin/students?tab=groups&groupId=5` - Groups tab with specific group selected

## Example 4: Nested Component Resolver (Variable Editor)

For a deeply nested component that needs to respond to URL params:

```tsx
// In a component like TemplateVariableEditor.tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";

export const TemplateVariableEditor: React.FC = () => {
  const { registerResolver, updateParams } = usePageNavigation();
  const [selectedVariable, setSelectedVariable] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<"edit" | "preview">("edit");

  // Register resolver with lower priority
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
          if (!isNaN(variableId)) {
            setSelectedVariable(variableId);
          }
        }

        // Handle edit mode
        if (params.mode) {
          const mode = params.mode as "edit" | "preview";
          if (["edit", "preview"].includes(mode)) {
            setEditMode(mode);
          }
        }

        return { success: true };
      },
      priority: 5, // Lower than parent
    });

    return unregister;
  }, [registerResolver]);

  const selectVariable = useCallback(
    (variableId: number) => {
      setSelectedVariable(variableId);
      updateParams({ variableId: String(variableId) }, { replace: true, merge: true });
    },
    [updateParams]
  );

  const changeMode = useCallback(
    (mode: "edit" | "preview") => {
      setEditMode(mode);
      updateParams({ mode }, { replace: true, merge: true });
    },
    [updateParams]
  );

  return <div>{/* Variable editor UI */}</div>;
};
```

### URLs Supported

- `/admin/templates/123/manage?tab=variables` - Variables tab
- `/admin/templates/123/manage?tab=variables&variableId=5` - Specific variable selected
- `/admin/templates/123/manage?tab=variables&variableId=5&mode=preview` - Variable in preview mode

## Key Patterns

### Pattern 1: Update URL on State Change

```tsx
const handleStateChange = useCallback(
  (newValue: string) => {
    // Update internal state
    setState(newValue);

    // Update URL to reflect state
    updateParams({ param: newValue }, { replace: true, merge: true });
  },
  [updateParams]
);
```

### Pattern 2: Sync State from URL Params

```tsx
useEffect(() => {
  const unregister = registerResolver({
    segment: "your/route",
    resolver: async params => {
      // Sync internal state from URL params
      if (params.someParam) {
        setState(params.someParam as StateType);
      }
      return { success: true };
    },
  });

  return unregister;
}, [registerResolver]);
```

### Pattern 3: Conditional Param Handling

```tsx
resolver: async params => {
  // Only handle certain params if on a specific tab
  if (params.tab === "editor") {
    if (params.variableId) {
      handleVariableSelection(params.variableId);
    }
    if (params.zoom) {
      handleZoomLevel(params.zoom);
    }
  }
  return { success: true };
};
```

### Pattern 4: Param Validation

```tsx
resolver: async params => {
  // Validate params before using
  const id = params.id as string;
  if (id && isNaN(Number(id))) {
    return {
      success: false,
      error: "Invalid ID parameter",
    };
  }

  // Use validated param
  const numericId = parseInt(id, 10);
  await loadData(numericId);

  return { success: true };
};
```

## Testing Deep Links

Test that your implementation works by pasting URLs directly:

1. **Storage**: `http://localhost:3000/admin/storage?path=documents/2024&view=list`
2. **Templates**: `http://localhost:3000/admin/templates/123/manage?tab=editor&variableId=5`
3. **Categories**: `http://localhost:3000/admin/categories?categoryId=3&templateId=10`
4. **Students**: `http://localhost:3000/admin/students?tab=groups&groupId=5`

All should work correctly, restoring the exact state represented by the URL.

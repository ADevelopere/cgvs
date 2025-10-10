# Page Navigation System

> **A dynamic, plugin-based architecture for managing navigation state across dashboard pages**

## Quick Start

### 1. Import the hook

```tsx
import { usePageNavigation } from "@/client/contexts/usePageNavigation";
```

### 2. Register a resolver in your context

```tsx
const { registerResolver, updateParams } = usePageNavigation();

useEffect(() => {
    const unregister = registerResolver({
        segment: "admin/your-route",
        resolver: async (params) => {
            if (params.tab) {
                setActiveTab(params.tab as string);
            }
            return { success: true };
        },
    });
    
    return unregister;
}, [registerResolver]);
```

### 3. Update URL when state changes

```tsx
const changeTab = (tab: string) => {
    setActiveTab(tab);
    updateParams({ tab }, { replace: true, merge: true });
};
```

### 4. Test deep linking

Open: `http://localhost:3000/admin/your-route?tab=editor`

**It just works!** ✨

## What Is This?

This system provides:

- ✅ **Dynamic navigation** - No hardcoded tabs or routes
- ✅ **Deep linking** - Full URL param support
- ✅ **Type-safe** - Type safety at the feature level
- ✅ **Recursive** - Handle nested navigation (directories, sub-tabs)
- ✅ **Decoupled** - Registry knows nothing about your features
- ✅ **Automatic URL sync** - Bidirectional state ↔ URL synchronization

## Files

- `PageNavigationRegistry.types.ts` - Type definitions
- `PageNavigationRegistry.utils.ts` - Helper utilities
- `PageNavigationRegistryContext.tsx` - Main orchestrator context
- `usePageNavigation.ts` - Custom hooks for feature contexts

## Example: TemplateManagementContext

```tsx
export const TemplateManagementProvider = ({ children }) => {
    const { registerResolver, updateParams } = usePageNavigation();
    const [activeTab, setActiveTab] = useState<TabType>("basic");
    
    // Register resolver
    useEffect(() => {
        const unregister = registerResolver({
            segment: "admin/templates/:id/manage",
            resolver: async (params) => {
                if (params.tab) {
                    setActiveTab(params.tab as TabType);
                }
                return { success: true };
            },
            priority: 10,
        });
        return unregister;
    }, [registerResolver]);
    
    // Update URL on tab change
    const changeTab = useCallback(
        (tab: TabType) => {
            setActiveTab(tab);
            updateParams({ tab }, { replace: true, merge: true });
        },
        [updateParams],
    );
    
    // ... rest of context
};
```

**Works with:**

- `/admin/templates/123/manage?tab=editor`
- `/admin/templates/123/manage?tab=preview&mode=fullscreen`

## Documentation

📖 [Quick Start Guide](../../docs/NAVIGATION_QUICK_START.md) - 5-step implementation guide  
📚 [Complete Documentation](../../docs/PAGE_NAVIGATION_SYSTEM.md) - Full system reference  
💡 [Implementation Examples](../../docs/NAVIGATION_IMPLEMENTATION_EXAMPLES.md) - Examples for all contexts  
📝 [System Summary](../../docs/NAVIGATION_SYSTEM_SUMMARY.md) - Architecture and design decisions  

## Helper Hooks

### useParam

```tsx
const tab = useParam<string>("tab", "basic");
```

### useParamState

```tsx
const [tab, setTab] = useParamState<string>("tab", "basic");
setTab("editor"); // Updates both state and URL
```

### useNavigationResolver

```tsx
useNavigationResolver({
    segment: "admin/page",
    resolver: async (params) => { /* ... */ },
}, [deps]);
```

## Common Use Cases

### Tab Navigation

```tsx
resolver: async (params) => {
    if (params.tab) {
        setActiveTab(params.tab as TabType);
    }
    return { success: true };
}
```

### Directory Navigation

```tsx
resolver: async (params) => {
    if (params.path) {
        await navigateToDirectory(params.path as string);
    }
    return { success: true };
},
recursive: true // Handle nested paths
```

### Item Selection

```tsx
resolver: async (params) => {
    if (params.itemId) {
        const id = parseInt(params.itemId as string, 10);
        setSelectedItem(id);
    }
    return { success: true };
}
```

## Migration from Old System

**Before:**

```tsx
const searchParams = useSearchParams();
const tab = searchParams.get("tab") || "basic";
useEffect(() => setActiveTab(tab), [tab]);
```

**After:**

```tsx
const { registerResolver, updateParams } = usePageNavigation();

useEffect(() => {
    return registerResolver({
        segment: "admin/page",
        resolver: async (params) => {
            if (params.tab) setActiveTab(params.tab as TabType);
            return { success: true };
        },
    });
}, [registerResolver]);

// When changing tab:
updateParams({ tab: "editor" }, { replace: true, merge: true });
```

## Need Help?

1. Check the [Quick Start Guide](../../docs/NAVIGATION_QUICK_START.md)
2. See [Implementation Examples](../../docs/NAVIGATION_IMPLEMENTATION_EXAMPLES.md)
3. Read the [Complete Documentation](../../docs/PAGE_NAVIGATION_SYSTEM.md)
4. Look at `TemplateManagementContext.tsx` for a real example

---

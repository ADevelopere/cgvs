/**
 * Custom hook for feature contexts to manage page navigation
 *
 * This hook provides a clean API for feature-specific contexts to:
 * 1. Register their navigation resolvers
 * 2. Access current URL params
 * 3. Update params programmatically
 * 4. Trigger resolution
 *
 * Example usage in TemplateManagementContext:
 *
 * ```tsx
 * const { params, registerResolver, updateParams } = usePageNavigation();
 *
 * useEffect(() => {
 *   const unregister = registerResolver({
 *     segment: "admin/templates/:id/manage",
 *     resolver: async (params) => {
 *       const tab = params.tab as string;
 *       const variableId = params.variable as string;
 *
 *       if (tab) {
 *         setActiveTab(tab);
 *       }
 *
 *       if (variableId) {
 *         // Navigate to variable within editor
 *         setSelectedVariable(parseInt(variableId));
 *       }
 *
 *       return { success: true };
 *     },
 *     priority: 10,
 *   });
 *
 *   return unregister;
 * }, []);
 *
 * // When user changes tab:
 * const handleTabChange = (tab: string) => {
 *   updateParams({ tab });
 * };
 * ```
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { usePageNavigationRegistry } from "./PageNavigationRegistryContext";
import {
    UsePageNavigationResult,
    ResolverRegistration,
    RouteParams,
    NavigationResolution,
} from "./PageNavigationRegistry.types";

/**
 * Hook for managing page navigation in feature contexts
 */
export function usePageNavigation(): UsePageNavigationResult {
    const registry = usePageNavigationRegistry();
    const registryRef = useRef(registry);
    const paramsStringRef = useRef<string>("");

    // Update the ref whenever registry changes
    registryRef.current = registry;

    // Local state for params (synced with registry)
    // Use a function to get initial state from registry
    const [params, setParams] = useState<RouteParams>(() => registry.getParams());
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync params from registry when they change
    // We check the params by comparing their JSON representation
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

        // Initial sync
        syncParams();

        // Set up a check interval (this is a lightweight approach)
        // Alternative would be to implement a full observer pattern
        const interval = setInterval(syncParams, 200);

        return () => clearInterval(interval);
    }, []);

    /**
     * Register a resolver with automatic cleanup
     */
    const registerResolver = useCallback(
        <TContext = unknown,>(
            registration: ResolverRegistration<TContext>,
        ): (() => void) => {
            return registryRef.current.registerResolver(registration);
        },
        [],
    );

    /**
     * Update URL params
     */
    const updateParams = useCallback(
        (
            newParams: RouteParams,
            options?: { replace?: boolean; merge?: boolean },
        ) => {
            registryRef.current.updateParams(newParams, options);
            setParams((prev) => ({ ...prev, ...newParams }));
        },
        [],
    );

    /**
     * Get a specific param
     */
    const getParam = useCallback(
        (key: string): string | string[] | undefined => {
            return params[key] ?? registryRef.current.getParam(key);
        },
        [params],
    );

    /**
     * Trigger resolution for current route
     */
    const resolve = useCallback(async (): Promise<NavigationResolution[]> => {
        setIsResolving(true);
        setError(null);

        try {
            const results = await registryRef.current.resolveCurrentRoute();
            const errors = results
                .filter((r) => !r.success && r.error)
                .map((r) => r.error)
                .join("; ");

            if (errors) {
                setError(errors);
            }

            return results;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
            return [{ success: false, error: message }];
        } finally {
            setIsResolving(false);
        }
    }, []);

    return {
        params,
        registerResolver,
        updateParams,
        getParam,
        resolve,
        isResolving,
        error,
        savePageState: registry.savePageState,
        restorePageState: registry.restorePageState,
    };
}

/**
 * Helper hook to get a single param with type casting
 */
export function useParam<T = string>(
    key: string,
    defaultValue?: T,
): T | undefined {
    const { getParam } = usePageNavigation();
    const value = getParam(key);

    if (value === undefined) {
        return defaultValue;
    }

    // Simple type casting based on default value type
    if (typeof defaultValue === "number") {
        return (typeof value === "string" ? parseInt(value, 10) : value) as T;
    }

    if (typeof defaultValue === "boolean") {
        return (value === "true" || value === "1") as T;
    }

    return value as T;
}

/**
 * Helper hook to manage a single param
 */
export function useParamState<T extends string | number | boolean = string>(
    key: string,
    defaultValue?: T,
): [T | undefined, (value: T | undefined) => void] {
    const { getParam, updateParams } = usePageNavigation();
    const value = (getParam(key) as T) ?? defaultValue;

    const setValue = useCallback(
        (newValue: T | undefined) => {
            if (newValue === undefined) {
                // Remove param
                updateParams({ [key]: undefined }, { merge: true });
            } else {
                updateParams({ [key]: String(newValue) }, { merge: true });
            }
        },
        [key, updateParams],
    );

    return [value, setValue];
}

/**
 * Hook to automatically register a resolver on mount
 */
export function useNavigationResolver<TContext = unknown>(
    registration: ResolverRegistration<TContext>,
    deps: React.DependencyList = [],
): void {
    const { registerResolver } = usePageNavigation();

    useEffect(() => {
        const unregister = registerResolver(registration);
        return unregister;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerResolver, ...deps]);
}


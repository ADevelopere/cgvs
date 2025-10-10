"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
    NavigationRegistryAPI,
    NavigationRegistryState,
    NavigationResolution,
    RegisteredResolver,
    ResolverRegistration,
    RouteParams,
} from "./PageNavigationRegistry.types";
import {
    extractPathParams,
    findBestMatchingPattern,
    generateResolverId,
    isChildRoute,
    normalizeSegment,
    parseSearchParams,
    buildUrlWithParams,
} from "./PageNavigationRegistry.utils";
import logger from "@/lib/logger";

/**
 * Context for the navigation registry
 */
const PageNavigationRegistryContext = createContext<
    NavigationRegistryAPI | undefined
>(undefined);

/**
 * Provider for the navigation registry
 */
export const PageNavigationRegistryProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [state, setState] = useState<NavigationRegistryState>({
        resolvers: new Map(),
        activeSegment: null,
        currentParams: {},
        isResolving: false,
        lastError: null,
        pageStates: new Map(), // Store page-specific state
    });

    // Refs to prevent stale closures
    const resolversRef = useRef(state.resolvers);
    const isResolvingRef = useRef(false);

    // Update refs when state changes
    useEffect(() => {
        resolversRef.current = state.resolvers;
    }, [state.resolvers]);

    /**
     * Register a navigation resolver
     */
    const registerResolver = useCallback(
        <TContext = unknown,>(
            registration: ResolverRegistration<TContext>,
        ): (() => void) => {
            const normalizedSegment = normalizeSegment(registration.segment);
            const resolverId = generateResolverId(normalizedSegment);

            const registeredResolver: RegisteredResolver<TContext> = {
                id: resolverId,
                registration: {
                    ...registration,
                    segment: normalizedSegment,
                    priority: registration.priority ?? 0,
                    recursive: registration.recursive ?? false,
                },
                registeredAt: Date.now(),
            };

            setState((prev) => {
                const newResolvers = new Map(prev.resolvers);
                const existing = newResolvers.get(normalizedSegment) || [];

                // Add new resolver and sort by priority
                const updated = [...existing, registeredResolver as RegisteredResolver<unknown>].sort(
                    (a, b) =>
                        b.registration.priority! - a.registration.priority!,
                );

                newResolvers.set(normalizedSegment, updated);

                return {
                    ...prev,
                    resolvers: newResolvers,
                };
            });

            logger.info(
                `Registered navigation resolver for: ${normalizedSegment}`,
            );

            // Return unregister function
            return () => {
                setState((prev) => {
                    const newResolvers = new Map(prev.resolvers);
                    const existing = newResolvers.get(normalizedSegment) || [];
                    const filtered = existing.filter(
                        (r) => r.id !== resolverId,
                    );

                    if (filtered.length === 0) {
                        newResolvers.delete(normalizedSegment);
                    } else {
                        newResolvers.set(normalizedSegment, filtered);
                    }

                    return {
                        ...prev,
                        resolvers: newResolvers,
                    };
                });

                logger.info(`Unregistered navigation resolver: ${resolverId}`);
            };
        },
        [],
    );

    /**
     * Resolve a specific route with params
     */
    const resolveRoute = useCallback(
        async (
            segment: string,
            params: RouteParams,
        ): Promise<NavigationResolution[]> => {
            const normalizedSegment = normalizeSegment(segment);
            const resolvers = resolversRef.current;
            const results: NavigationResolution[] = [];

            // Find all matching resolvers
            const matchingResolvers: RegisteredResolver[] = [];

            // 1. Try exact match first
            const exactMatch = resolvers.get(normalizedSegment);
            if (exactMatch) {
                matchingResolvers.push(...exactMatch);
            }

            // 2. Try pattern matches
            const patterns = Array.from(resolvers.keys());
            const bestPattern = findBestMatchingPattern(
                patterns,
                normalizedSegment,
            );

            if (bestPattern && bestPattern !== normalizedSegment) {
                const patternResolvers = resolvers.get(bestPattern);
                if (patternResolvers) {
                    // Extract path params from pattern
                    const pathParams = extractPathParams(
                        bestPattern,
                        normalizedSegment,
                    );
                    if (pathParams) {
                        // Merge path params with existing params
                        params = { ...pathParams, ...params };
                    }
                    matchingResolvers.push(...patternResolvers);
                }
            }

            // 3. Check for recursive parent resolvers
            for (const [pattern, patternResolvers] of resolvers.entries()) {
                const recursiveResolvers = patternResolvers.filter(
                    (r) =>
                        r.registration.recursive &&
                        isChildRoute(pattern, normalizedSegment),
                );
                matchingResolvers.push(...recursiveResolvers);
            }

            // Execute all matching resolvers
            for (const resolver of matchingResolvers) {
                try {
                    const result = await resolver.registration.resolver(params);
                    results.push(result);

                    if (!result.success) {
                        logger.warn(
                            `Resolver for ${resolver.registration.segment} failed: ${result.error}`,
                        );
                    }
                } catch (error) {
                    logger.error(
                        `Error executing resolver for ${resolver.registration.segment}:`,
                        error,
                    );
                    results.push({
                        success: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    });
                }
            }

            return results;
        },
        [],
    );

    /**
     * Resolve the current route
     */
    const resolveCurrentRoute = useCallback(async (): Promise<
        NavigationResolution[]
    > => {
        if (isResolvingRef.current) {
            logger.warn("Resolution already in progress, skipping");
            return [];
        }

        isResolvingRef.current = true;

        setState((prev) => ({
            ...prev,
            isResolving: true,
            lastError: null,
        }));

        try {
            const normalizedPath = normalizeSegment(pathname || "");
            let params = parseSearchParams(searchParams);

            // Save current page state before changing routes (if we have an active segment)
            if (state.activeSegment && state.activeSegment !== normalizedPath) {
                setState((prev) => {
                    const newPageStates = new Map(prev.pageStates);
                    newPageStates.set(prev.activeSegment!, prev.currentParams);
                    return {
                        ...prev,
                        pageStates: newPageStates,
                    };
                });
            }

            // Restore page state if available for the current route
            const savedState = state.pageStates.get(normalizedPath);
            if (savedState) {
                params = { ...savedState, ...params };
            }

            setState((prev) => ({
                ...prev,
                activeSegment: normalizedPath,
                currentParams: params,
            }));

            const results = await resolveRoute(normalizedPath, params);

            // Check if any resolution has errors
            const errors = results
                .filter((r) => !r.success && r.error)
                .map((r) => r.error)
                .join("; ");

            setState((prev) => ({
                ...prev,
                lastError: errors || null,
            }));

            return results;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            logger.error("Error resolving current route:", error);

            setState((prev) => ({
                ...prev,
                lastError: errorMessage,
            }));

            return [{ success: false, error: errorMessage }];
        } finally {
            isResolvingRef.current = false;
            setState((prev) => ({
                ...prev,
                isResolving: false,
            }));
        }
        // todo usRef to escape the deps
    }, [pathname, searchParams, resolveRoute, state.pageStates]);

    /**
     * Update URL params
     */
    const updateParams = useCallback(
        (
            params: RouteParams,
            options?: { replace?: boolean; merge?: boolean },
        ) => {
            const { replace = false, merge = true } = options || {};

            let newParams = params;
            if (merge) {
                const currentParams = parseSearchParams(searchParams);
                newParams = { ...currentParams, ...params };
            }

            const newUrl = buildUrlWithParams(pathname || "", newParams);

            if (replace) {
                router.replace(newUrl);
            } else {
                router.push(newUrl);
            }

            setState((prev) => ({
                ...prev,
                currentParams: newParams,
            }));
        },
        [pathname, searchParams, router, state.activeSegment],
    );

    /**
     * Get all current params
     */
    const getParams = useCallback((): RouteParams => {
        return state.currentParams;
    }, [state.currentParams]);

    /**
     * Get a specific param
     */
    const getParam = useCallback(
        (key: string): string | string[] | undefined => {
            return state.currentParams[key];
        },
        [state.currentParams],
    );

    /**
     * Check if a resolver exists for a segment
     */
    const hasResolver = useCallback(
        (segment: string): boolean => {
            const normalizedSegment = normalizeSegment(segment);
            return state.resolvers.has(normalizedSegment);
        },
        [state.resolvers],
    );

    /**
     * Get all registered resolvers (for debugging)
     */
    const getRegisteredResolvers = useCallback((): RegisteredResolver[] => {
        const all: RegisteredResolver[] = [];
        state.resolvers.forEach((resolvers) => {
            all.push(...resolvers);
        });
        return all.sort((a, b) => a.registeredAt - b.registeredAt);
    }, [state.resolvers]);

    /**
     * Save page-specific state for later restoration
     */
    const savePageState = useCallback(
        (segment: string, params: RouteParams) => {
            setState((prev) => {
                const newPageStates = new Map(prev.pageStates);
                newPageStates.set(segment, params);
                return {
                    ...prev,
                    pageStates: newPageStates,
                };
            });
        },
        [],
    );

    /**
     * Restore page-specific state for a segment
     */
    const restorePageState = useCallback(
        (segment: string): RouteParams | null => {
            return state.pageStates.get(segment) || null;
        },
        [state.pageStates],
    );


    // Auto-resolve when pathname or search params change
    useEffect(() => {
        // Small delay to allow resolvers to register first
        const timer = setTimeout(() => {
            resolveCurrentRoute();
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname, searchParams, resolveCurrentRoute, state.pageStates]);

    const api: NavigationRegistryAPI = useMemo(
        () => ({
            registerResolver,
            resolveCurrentRoute,
            resolveRoute,
            updateParams,
            getParams,
            getParam,
            hasResolver,
            getRegisteredResolvers,
            savePageState,
            restorePageState,
        }),
        [
            registerResolver,
            resolveCurrentRoute,
            resolveRoute,
            updateParams,
            getParams,
            getParam,
            hasResolver,
            getRegisteredResolvers,
            savePageState,
            restorePageState,
        ],
    );

    return (
        <PageNavigationRegistryContext.Provider value={api}>
            {children}
        </PageNavigationRegistryContext.Provider>
    );
};

/**
 * Hook to access the navigation registry
 */
export const usePageNavigationRegistry = (): NavigationRegistryAPI => {
    const context = useContext(PageNavigationRegistryContext);
    if (!context) {
        throw new Error(
            "usePageNavigationRegistry must be used within a PageNavigationRegistryProvider",
        );
    }
    return context;
};

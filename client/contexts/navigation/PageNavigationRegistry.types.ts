/**
 * Page Navigation Registry System
 *
 * A plugin-based architecture for managing page navigation state across the dashboard.
 * The registry acts as an orchestrator - it knows nothing about specific features.
 *
 * Each feature context can:
 * 1. Register param resolvers for their routes
 * 2. Define how URL params map to their internal state
 * 3. Handle deep linking and state restoration
 *
 * Flow:
 * 1. User navigates to /admin/templates/123/manage?tab=editor&variable=5
 * 2. Registry extracts params: {id: "123", tab: "editor", variable: "5"}
 * 3. Registry calls registered resolver for "admin/templates/:id/manage"
 * 4. Resolver (defined in TemplateManagementContext) handles params and sets up state
 * 5. Component renders with correct configuration
 */

/**
 * URL parameters extracted from the current route
 * Can include path params, query params, and hash params
 */
export type RouteParams = Record<string, string | string[] | undefined>;

/**
 * Result of resolving navigation params
 * Can trigger side effects, update state, or return new params
 */
export interface NavigationResolution {
    /**
     * Whether the resolution was successful
     */
    success: boolean;

    /**
     * Optional params to merge back into the URL
     * Useful for normalizing or adding default params
     */
    params?: RouteParams;

    /**
     * Optional error message if resolution failed
     */
    error?: string;

    /**
     * Optional redirect path if the resolver determines navigation is needed
     */
    redirect?: string;
}

/**
 * A resolver function that handles URL params for a specific route
 * This is where feature contexts implement their navigation logic
 *
 * @param params - URL parameters (path params + query params)
 * @param context - Additional context like previous state, user info, etc.
 * @returns A promise that resolves with navigation resolution
 */
export type NavigationResolver<TContext = unknown> = (
    params: RouteParams,
    context?: TContext,
) => Promise<NavigationResolution> | NavigationResolution;

/**
 * Configuration for registering a navigation resolver
 */
export interface ResolverRegistration<TContext = unknown> {
    /**
     * The route segment pattern (can include :param syntax)
     * Examples: "admin/templates", "admin/templates/:id/manage"
     */
    segment: string;

    /**
     * The resolver function
     */
    resolver: NavigationResolver<TContext>;

    /**
     * Priority for resolver execution (higher runs first)
     * Useful when multiple resolvers could match
     * @default 0
     */
    priority?: number;

    /**
     * Whether this resolver handles child routes
     * If true, will also be called for nested segments
     * @default false
     */
    recursive?: boolean;
}

/**
 * Options for URL param extraction and management
 */
export interface ParamOptions {
    /**
     * Whether to include query parameters
     * @default true
     */
    includeQuery?: boolean;

    /**
     * Whether to include hash parameters
     * @default false
     */
    includeHash?: boolean;

    /**
     * Whether to decode URI components
     * @default true
     */
    decode?: boolean;

    /**
     * Transform param names (e.g., camelCase to snake_case)
     */
    transformKeys?: (key: string) => string;
}

/**
 * A registered resolver with metadata
 */
export interface RegisteredResolver<TContext = unknown> {
    id: string;
    registration: ResolverRegistration<TContext>;
    registeredAt: number;
}

/**
 * State of the navigation registry
 */
export interface NavigationRegistryState {
    /**
     * All registered resolvers by segment pattern
     */
    resolvers: Map<string, RegisteredResolver[]>;

    /**
     * Currently active route segment
     */
    activeSegment: string | null;

    /**
     * Current route params
     */
    currentParams: RouteParams;

    /**
     * Whether a resolution is in progress
     */
    isResolving: boolean;

    /**
     * Last resolution error, if any
     */
    lastError: string | null;
}

/**
 * Navigation registry API
 */
export interface NavigationRegistryAPI {
    /**
     * Register a navigation resolver for a route segment
     * Returns an unregister function
     */
    registerResolver: <TContext = unknown>(
        registration: ResolverRegistration<TContext>,
    ) => () => void;

    /**
     * Manually trigger resolution for the current route
     * Useful for refreshing state after changes
     */
    resolveCurrentRoute: () => Promise<NavigationResolution[]>;

    /**
     * Resolve a specific route with params
     */
    resolveRoute: (
        segment: string,
        params: RouteParams,
    ) => Promise<NavigationResolution[]>;

    /**
     * Update URL params without triggering navigation
     * Useful for updating query params without full page reload
     */
    updateParams: (
        params: RouteParams,
        options?: { replace?: boolean; merge?: boolean },
    ) => void;

    /**
     * Get current route params
     */
    getParams: () => RouteParams;

    /**
     * Get a specific param value
     */
    getParam: (key: string) => string | string[] | undefined;

    /**
     * Check if a resolver is registered for a segment
     */
    hasResolver: (segment: string) => boolean;

    /**
     * Get all registered resolvers for debugging
     */
    getRegisteredResolvers: () => RegisteredResolver[];
}

/**
 * Hook return type for using page navigation in feature contexts
 */
export interface UsePageNavigationResult {
    /**
     * Current route params
     */
    params: RouteParams;

    /**
     * Register a resolver (automatically cleaned up on unmount)
     */
    registerResolver: NavigationRegistryAPI["registerResolver"];

    /**
     * Update URL params
     */
    updateParams: NavigationRegistryAPI["updateParams"];

    /**
     * Get a specific param
     */
    getParam: NavigationRegistryAPI["getParam"];

    /**
     * Trigger resolution for current route
     */
    resolve: NavigationRegistryAPI["resolveCurrentRoute"];

    /**
     * Whether resolution is in progress
     */
    isResolving: boolean;

    /**
     * Last resolution error
     */
    error: string | null;
}

/**
 * Default param options
 */
export const DEFAULT_PARAM_OPTIONS: Required<ParamOptions> = {
    includeQuery: true,
    includeHash: false,
    decode: true,
    transformKeys: (key: string) => key,
};

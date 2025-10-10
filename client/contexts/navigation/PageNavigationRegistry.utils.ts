/**
 * Utility functions for the Page Navigation Registry
 */

import {
    RouteParams,
    ParamOptions,
    DEFAULT_PARAM_OPTIONS,
} from "./PageNavigationRegistry.types";

/**
 * Parse URL search params into a RouteParams object
 */
export function parseSearchParams(
    searchParams: URLSearchParams,
    options: ParamOptions = DEFAULT_PARAM_OPTIONS,
): RouteParams {
    const params: RouteParams = {};
    const opts = { ...DEFAULT_PARAM_OPTIONS, ...options };

    searchParams.forEach((value, key) => {
        const transformedKey = opts.transformKeys(key);
        const decodedValue = opts.decode ? decodeURIComponent(value) : value;

        // Handle multiple values with same key
        if (params[transformedKey]) {
            const existing = params[transformedKey];
            if (Array.isArray(existing)) {
                existing.push(decodedValue);
            } else {
                params[transformedKey] = [existing as string, decodedValue];
            }
        } else {
            params[transformedKey] = decodedValue;
        }
    });

    return params;
}

/**
 * Convert RouteParams back to URLSearchParams
 */
export function toSearchParams(params: RouteParams): URLSearchParams {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
        } else {
            searchParams.set(key, String(value));
        }
    });

    return searchParams;
}

/**
 * Extract path parameters from a route segment
 * Example: extractPathParams("admin/templates/:id/manage", "admin/templates/123/manage")
 * Returns: { id: "123" }
 */
export function extractPathParams(
    pattern: string,
    path: string,
): RouteParams | null {
    const patternSegments = pattern.split("/").filter(Boolean);
    const pathSegments = path.split("/").filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
        return null;
    }

    const params: RouteParams = {};

    for (let i = 0; i < patternSegments.length; i++) {
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];

        if (patternSegment.startsWith(":")) {
            // This is a parameter
            const paramName = patternSegment.slice(1);
            params[paramName] = pathSegment;
        } else if (patternSegment !== pathSegment) {
            // Segments don't match
            return null;
        }
    }

    return params;
}

/**
 * Check if a route pattern matches a path
 */
export function matchesPattern(pattern: string, path: string): boolean {
    return extractPathParams(pattern, path) !== null;
}

/**
 * Check if a path is a child of a segment
 * Example: isChildRoute("admin/templates", "admin/templates/123/manage") => true
 */
export function isChildRoute(
    parentSegment: string,
    childPath: string,
): boolean {
    const normalizedParent = parentSegment.replace(/\/$/, "");
    const normalizedChild = childPath.replace(/\/$/, "");

    return normalizedChild.startsWith(normalizedParent + "/");
}

/**
 * Merge route params (useful for combining path and query params)
 */
export function mergeParams(...paramObjects: RouteParams[]): RouteParams {
    const merged: RouteParams = {};

    for (const params of paramObjects) {
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined) return;

            if (merged[key] !== undefined && Array.isArray(merged[key])) {
                // Merge arrays
                const existing = merged[key] as string[];
                if (Array.isArray(value)) {
                    existing.push(...value);
                } else {
                    existing.push(value);
                }
            } else if (merged[key] !== undefined) {
                // Convert to array
                const existing = merged[key] as string;
                if (Array.isArray(value)) {
                    merged[key] = [existing, ...value];
                } else {
                    merged[key] = [existing, value];
                }
            } else {
                merged[key] = value;
            }
        });
    }

    return merged;
}

/**
 * Generate a unique ID for a resolver registration
 */
export function generateResolverId(segment: string): string {
    return `${segment}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Normalize a route segment (remove leading/trailing slashes, handle //)
 */
export function normalizeSegment(segment: string): string {
    return segment.split("/").filter(Boolean).join("/");
}

/**
 * Extract params from Next.js useParams and useSearchParams
 * This is a helper to combine both sources
 */
export function extractNextParams(
    pathParams: Record<string, string | string[]>,
    searchParams: URLSearchParams,
    options?: ParamOptions,
): RouteParams {
    const queryParams = parseSearchParams(searchParams, options);
    return mergeParams(pathParams, queryParams);
}

/**
 * Build a URL with params
 */
export function buildUrlWithParams(
    basePath: string,
    params: RouteParams,
): string {
    const searchParams = toSearchParams(params);
    const queryString = searchParams.toString();

    if (queryString) {
        return `${basePath}?${queryString}`;
    }

    return basePath;
}

/**
 * Get the most specific matching resolver for a path
 * Handles both exact matches and pattern matches with parameters
 */
export function findBestMatchingPattern(
    patterns: string[],
    path: string,
): string | null {
    let bestMatch: string | null = null;
    let bestScore = -1;

    for (const pattern of patterns) {
        if (matchesPattern(pattern, path)) {
            // Calculate specificity score:
            // - More segments = higher score
            // - Fewer params = higher score
            const segments = pattern.split("/").filter(Boolean);
            const paramCount = segments.filter((s) => s.startsWith(":")).length;
            const score = segments.length * 10 - paramCount;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = pattern;
            }
        }
    }

    return bestMatch;
}

/**
 * Validate params against a schema (basic validation)
 */
export function validateParams(
    params: RouteParams,
    schema: Record<string, "string" | "number" | "boolean" | "array">,
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    Object.entries(schema).forEach(([key, type]) => {
        const value = params[key];

        if (value === undefined) {
            errors.push(`Missing required parameter: ${key}`);
            return;
        }

        switch (type) {
            case "string":
                if (typeof value !== "string") {
                    errors.push(`Parameter ${key} must be a string`);
                }
                break;
            case "number":
                if (typeof value === "string" && isNaN(Number(value))) {
                    errors.push(`Parameter ${key} must be a number`);
                }
                break;
            case "boolean":
                if (
                    typeof value === "string" &&
                    !["true", "false"].includes(value)
                ) {
                    errors.push(`Parameter ${key} must be a boolean`);
                }
                break;
            case "array":
                if (!Array.isArray(value)) {
                    errors.push(`Parameter ${key} must be an array`);
                }
                break;
        }
    });

    return { valid: errors.length === 0, errors };
}

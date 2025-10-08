/**
 * Authentication utilities for client-side session management
 *
 * SECURITY NOTE: Only access tokens are stored in localStorage.
 * Refresh tokens and session IDs are handled via httpOnly cookies for security.
 */

// Types for authentication data
export interface AuthTokens {
    accessToken?: string;
}

// Local storage keys
const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: 'cgsv_access_token',
} as const;

/**
 * Store authentication tokens in localStorage
 */
export const storeAuthTokens = (tokens: AuthTokens): void => {
    if (tokens.accessToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    }
};

/**
 * Retrieve authentication tokens from localStorage
 */
export const getStoredAuthTokens = (): AuthTokens => {
    if (typeof window === 'undefined') {
        return {}; // Server-side rendering
    }

    return {
        accessToken: localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) || undefined,
    };
};

/**
 * Clear all authentication tokens from localStorage
 */
export const clearStoredAuthTokens = (): void => {
    if (typeof window === 'undefined') {
        return; // Server-side rendering
    }

    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Check if a user appears to be authenticated based on stored tokens
 */
export const hasStoredAuthTokens = (): boolean => {
    const tokens = getStoredAuthTokens();
    return Boolean(tokens.accessToken);
};

/**
 * Initialize auth state from localStorage on app start
 */
export const initializeAuthFromStorage = (): AuthTokens => {
    return getStoredAuthTokens();
};

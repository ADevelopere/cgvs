/**
 * Authentication utilities for client-side session management
 */

// Types for authentication data
export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
    sessionId?: string;
}

// Local storage keys
const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: 'cgsv_access_token',
    REFRESH_TOKEN: 'cgsv_refresh_token',
    SESSION_ID: 'cgsv_session_id',
} as const;

/**
 * Store authentication tokens in localStorage
 * Note: In production, consider using httpOnly cookies for refresh tokens
 */
export const storeAuthTokens = (tokens: AuthTokens): void => {
    if (tokens.accessToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    }
    if (tokens.refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    }
    if (tokens.sessionId) {
        localStorage.setItem(AUTH_STORAGE_KEYS.SESSION_ID, tokens.sessionId);
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
        refreshToken: localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN) || undefined,
        sessionId: localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_ID) || undefined,
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
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION_ID);
};

/**
 * Check if user appears to be authenticated based on stored tokens
 */
export const hasStoredAuthTokens = (): boolean => {
    const tokens = getStoredAuthTokens();
    return Boolean(tokens.accessToken || tokens.refreshToken);
};

/**
 * Initialize auth state from localStorage on app start
 */
export const initializeAuthFromStorage = (): AuthTokens => {
    return getStoredAuthTokens();
};
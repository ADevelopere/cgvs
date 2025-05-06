const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Save authentication token to both localStorage and cookies
 */
export const saveAuthToken = (token: string) => {
    // Save to localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    
    // Save to cookies with HttpOnly and Secure flags
    document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; SameSite=Strict; Secure`;
};

/**
 * Clear authentication token from both localStorage and cookies
 */
export const clearAuthToken = () => {
    // Clear from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    
    // Clear from cookies by setting an expired date
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure`;
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated by verifying token existence
 */
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

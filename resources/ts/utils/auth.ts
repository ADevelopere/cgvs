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


// Function to validate password
/**
 * Validates if the given password is valid.
 * @param {string} password - The password to validate.
 * @returns {string} - 'empty', 'short', or 'valid' based on the password length.
 */
export const isPasswordValid = (password: string): string => {
    if (password.length === 0) {
        return "empty";
    } else if (password.length < 8) {
        return "short";
    }
    return "valid";
};

// Function to validate confirm password
/**
 * Validates if the confirm password matches the original password.
 * @param {string} confirmPassword - The confirm password to validate.
 * @param {string} password - The original password.
 * @returns {string} - 'empty', 'short', 'mismatch', or 'valid' based on the validation.
 */
export const isValidConfirmPassword = (
    confirmPassword: string,
    password: string,
): string => {
    if (confirmPassword.length === 0) {
        return "empty";
    } else if (confirmPassword.length < 8) {
        return "short";
    } else if (confirmPassword !== password) {
        return "mismatch";
    }
    return "valid";
};

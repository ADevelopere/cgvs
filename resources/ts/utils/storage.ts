// Utility functions for local storage operations
const STORAGE_DEBOUNCE_MS = 300;

// Helper function to debounce operations
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): T {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
}

// Generic function to get storage key with prefix
export function getStorageKey(prefix: string, key: string): string {
    return `${prefix}_${key}`;
}

// Generic save to localStorage with error handling
export function saveToLocalStorage<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

// Generic load from localStorage with error handling
export function loadFromLocalStorage<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return null;
    }
}

// Create a debounced version of saveToLocalStorage
export const debouncedSaveToLocalStorage = debounce(saveToLocalStorage, STORAGE_DEBOUNCE_MS);

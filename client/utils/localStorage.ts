// Utility functions for local storage operations
const STORAGE_DEBOUNCE_MS = 300;

// Helper function to debounce operations
export function debounce<Args extends unknown[]>(func: (...args: Args) => void, wait: number): (...args: Args) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generic function to get storage key with prefix
export function getStorageKey(prefix: string, key: string): string {
  return `${prefix}_${key}`;
}

// Generic save to localStorage with error handling
export function saveToLocalStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
}

// Generic load from localStorage with error handling
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  const item = localStorage.getItem(key);
  if (item === null) {
    return null;
  }
  try {
    return JSON.parse(item) as T;
  } catch {
    return item as T;
  }
}

// Create a debounced version of saveToLocalStorage
export const debouncedSaveToLocalStorage = debounce(saveToLocalStorage, STORAGE_DEBOUNCE_MS);

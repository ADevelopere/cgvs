/**
 * EditorPane Store Manager
 *
 * A singleton manager that creates and caches individual Zustand stores
 * for EditorPane components. Each store is identified by a unique storageKey
 * and is created lazily on first access.
 *
 * ## Architecture
 *
 * - Maintains a Map<storageKey, store> cache
 * - Stores are created lazily when first requested
 * - Each store independently persists to localStorage
 * - Currently keeps all stores in memory (see Future Enhancements)
 *
 * ## Future Enhancements
 *
 * This manager can be extended with an LRU (Least Recently Used) eviction policy:
 *
 * 1. Track access timestamps for each store
 * 2. Implement a max cache size (e.g., keep only 10-20 most recent stores)
 * 3. When cache exceeds max size, evict least recently used stores
 * 4. Evicted stores persist to localStorage and can be recreated on demand
 * 5. Add `clearUnusedStores()` method to manually trigger cleanup
 *
 * Example LRU implementation structure:
 * ```typescript
 * interface CacheEntry {
 *   store: StoreApi<EditorPaneStore>;
 *   lastAccessed: number;
 * }
 * const cache = new Map<string, CacheEntry>();
 * const MAX_CACHE_SIZE = 20;
 * ```
 */

import {
  createEditorPaneStore,
  type EditorPaneStoreWithPersist,
} from "./editorPaneStoreFactory";
import type { StoreApi } from "zustand";

/**
 * Cache for storing created store instances
 */
const storeCache = new Map<string, StoreApi<EditorPaneStoreWithPersist>>();

/**
 * Get or create an EditorPane store for the given storage key
 *
 * The store will automatically load persisted state from localStorage if available.
 * If no persisted state exists, it will initialize with sensible defaults.
 *
 * @param storageKey - Unique identifier for this pane's store
 * @returns The store instance for this storageKey
 */
export const getEditorPaneStore = (
  storageKey: string
): StoreApi<EditorPaneStoreWithPersist> => {
  // Return cached store if it exists
  if (storeCache.has(storageKey)) {
    const cachedStore = storeCache.get(storageKey)!;
    return cachedStore;
  }

  // Create new store and cache it
  const newStore = createEditorPaneStore(storageKey);
  storeCache.set(storageKey, newStore);

  return newStore;
};

/**
 * Check if a store exists in the cache
 *
 * @param storageKey - The storage key to check
 * @returns True if store exists in cache
 */
export const hasStore = (storageKey: string): boolean => {
  return storeCache.has(storageKey);
};

/**
 * Clear a specific store from the cache
 *
 * Note: This only removes the store from memory. The persisted state
 * in localStorage will remain and be loaded if the store is recreated.
 *
 * @param storageKey - The storage key of the store to clear
 * @returns True if store was found and cleared
 */
export const clearStore = (storageKey: string): boolean => {
  return storeCache.delete(storageKey);
};

/**
 * Clear all stores from the cache
 *
 * Note: This only removes stores from memory. Persisted state in
 * localStorage will remain and be loaded if stores are recreated.
 */
export const clearAllStores = (): void => {
  storeCache.clear();
};

/**
 * Get the number of stores currently in cache
 *
 * @returns The number of cached stores
 */
export const getCacheSize = (): number => {
  return storeCache.size;
};

/**
 * Get all storage keys currently in cache
 *
 * Useful for debugging or implementing custom cleanup strategies
 *
 * @returns Array of storage keys
 */
export const getCachedKeys = (): string[] => {
  return Array.from(storeCache.keys());
};

import { create } from "zustand";

interface CanvasCacheState {
  cache: Map<string, string>;
  getCache: (hash: string) => string | undefined;
  setCache: (hash: string, dataUrl: string) => void;
}

export const useCanvasCacheStore = create<CanvasCacheState>((set, get) => ({
  cache: new Map(),
  getCache: (hash: string) => {
    return get().cache.get(hash);
  },
  setCache: (hash: string, dataUrl: string) => {
    set(state => {
      const newCache = new Map(state.cache);
      newCache.set(hash, dataUrl);
      return { cache: newCache };
    });
  },
}));

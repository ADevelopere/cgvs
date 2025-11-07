import { create } from "zustand";
import type { Font as OpentypeFont } from "opentype.js";

interface CanvasFontState {
  // Map of family name to OpenType font
  fontCache: Map<string, OpentypeFont>;
  // Map of family name to loading promise
  fontInflight: Map<string, Promise<void>>;
  
  getFont: (family: string) => OpentypeFont | undefined;
  setFont: (family: string, font: OpentypeFont) => void;
  getInflight: (family: string) => Promise<void> | undefined;
  setInflight: (family: string, promise: Promise<void>) => void;
  removeInflight: (family: string) => void;
  hasFont: (family: string) => boolean;
}

export const useCanvasFontStore = create<CanvasFontState>((set, get) => ({
  fontCache: new Map(),
  fontInflight: new Map(),
  
  getFont: (family: string) => {
    return get().fontCache.get(family);
  },
  
  setFont: (family: string, font: OpentypeFont) => {
    set(state => {
      const newCache = new Map(state.fontCache);
      newCache.set(family, font);
      return { fontCache: newCache };
    });
  },
  
  getInflight: (family: string) => {
    return get().fontInflight.get(family);
  },
  
  setInflight: (family: string, promise: Promise<void>) => {
    set(state => {
      const newInflight = new Map(state.fontInflight);
      newInflight.set(family, promise);
      return { fontInflight: newInflight };
    });
  },
  
  removeInflight: (family: string) => {
    set(state => {
      const newInflight = new Map(state.fontInflight);
      newInflight.delete(family);
      return { fontInflight: newInflight };
    });
  },
  
  hasFont: (family: string) => {
    return get().fontCache.has(family);
  },
}));

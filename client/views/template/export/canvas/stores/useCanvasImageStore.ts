import { create } from "zustand";

interface CanvasImageState {
  // Map of image URL to loaded HTMLImageElement
  imageCache: Map<string, HTMLImageElement>;
  // Map of URL to loading promise
  imageInflight: Map<string, Promise<HTMLImageElement>>;
  
  getImage: (url: string) => HTMLImageElement | undefined;
  setImage: (url: string, image: HTMLImageElement) => void;
  getInflight: (url: string) => Promise<HTMLImageElement> | undefined;
  setInflight: (url: string, promise: Promise<HTMLImageElement>) => void;
  removeInflight: (url: string) => void;
  hasImage: (url: string) => boolean;
}

export const useCanvasImageStore = create<CanvasImageState>((set, get) => ({
  imageCache: new Map(),
  imageInflight: new Map(),
  
  getImage: (url: string) => {
    return get().imageCache.get(url);
  },
  
  setImage: (url: string, image: HTMLImageElement) => {
    set(state => {
      const newCache = new Map(state.imageCache);
      newCache.set(url, image);
      return { imageCache: newCache };
    });
  },
  
  getInflight: (url: string) => {
    return get().imageInflight.get(url);
  },
  
  setInflight: (url: string, promise: Promise<HTMLImageElement>) => {
    set(state => {
      const newInflight = new Map(state.imageInflight);
      newInflight.set(url, promise);
      return { imageInflight: newInflight };
    });
  },
  
  removeInflight: (url: string) => {
    set(state => {
      const newInflight = new Map(state.imageInflight);
      newInflight.delete(url);
      return { imageInflight: newInflight };
    });
  },
  
  hasImage: (url: string) => {
    return get().imageCache.has(url);
  },
}));

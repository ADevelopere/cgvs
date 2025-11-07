import { create } from "zustand";

/**
 * Canvas render state per template+scale combination
 */
interface CanvasRenderState {
  // Map of "templateId:scale:debugBorders" to ready state
  readyStates: Map<string, boolean>;

  // Track which canvas configurations are currently loading
  loadingStates: Map<string, boolean>;

  // Generation times for performance tracking
  generationTimes: Map<string, { canvas: number; hash: number }>;
}

interface CanvasRenderStore extends CanvasRenderState {
  getKey: (templateId: number, scale: number, debugBorders: boolean) => string;
  isReady: (templateId: number, scale: number, debugBorders: boolean) => boolean;
  setReady: (templateId: number, scale: number, debugBorders: boolean, ready: boolean) => void;
  isLoading: (templateId: number, scale: number, debugBorders: boolean) => boolean;
  setLoading: (templateId: number, scale: number, debugBorders: boolean, loading: boolean) => void;
  setGenerationTime: (templateId: number, scale: number, debugBorders: boolean, canvas: number, hash: number) => void;
  getGenerationTime: (
    templateId: number,
    scale: number,
    debugBorders: boolean
  ) => { canvas: number; hash: number } | undefined;
}

export const useCanvasRenderStore = create<CanvasRenderStore>((set, get) => ({
  readyStates: new Map(),
  loadingStates: new Map(),
  generationTimes: new Map(),

  getKey: (templateId: number, scale: number, debugBorders: boolean) => {
    return `${templateId}:${scale}:${debugBorders}`;
  },

  isReady: (templateId: number, scale: number, debugBorders: boolean) => {
    const key = get().getKey(templateId, scale, debugBorders);
    return get().readyStates.get(key) || false;
  },

  setReady: (templateId: number, scale: number, debugBorders: boolean, ready: boolean) => {
    const key = get().getKey(templateId, scale, debugBorders);
    set(state => {
      const newStates = new Map(state.readyStates);
      newStates.set(key, ready);
      return { readyStates: newStates };
    });
  },

  isLoading: (templateId: number, scale: number, debugBorders: boolean) => {
    const key = get().getKey(templateId, scale, debugBorders);
    return get().loadingStates.get(key) || false;
  },

  setLoading: (templateId: number, scale: number, debugBorders: boolean, loading: boolean) => {
    const key = get().getKey(templateId, scale, debugBorders);
    set(state => {
      const newStates = new Map(state.loadingStates);
      newStates.set(key, loading);
      return { loadingStates: newStates };
    });
  },

  setGenerationTime: (templateId: number, scale: number, debugBorders: boolean, canvas: number, hash: number) => {
    const key = get().getKey(templateId, scale, debugBorders);
    set(state => {
      const newTimes = new Map(state.generationTimes);
      newTimes.set(key, { canvas, hash });
      return { generationTimes: newTimes };
    });
  },

  getGenerationTime: (templateId: number, scale: number, debugBorders: boolean) => {
    const key = get().getKey(templateId, scale, debugBorders);
    return get().generationTimes.get(key);
  },
}));

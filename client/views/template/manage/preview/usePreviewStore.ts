
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Preview component state
 */
interface PreviewState {
  showDebugBorders: boolean;
  renderScale: number;
}

/**
 * Preview store interface
 */
interface PreviewStore extends PreviewState {
  setShowDebugBorders: (show: boolean) => void;
  setRenderScale: (scale: number) => void;
  reset: () => void;
}

const initialState: PreviewState = {
  showDebugBorders: false,
  renderScale: 5,
};

/**
 * Zustand store for preview component state
 * Persists to sessionStorage for restoration across page reloads
 */
export const usePreviewStore = create<PreviewStore>()(
  persist(
    set => ({
      ...initialState,

      setShowDebugBorders: (show: boolean) => set({ showDebugBorders: show }),

      setRenderScale: (scale: number) => {
        if (scale < 0.5 || scale > 10) return;
        set({ renderScale: scale });
      },

      reset: () => set(initialState),
    }),
    {
      name: "preview-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        showDebugBorders: state.showDebugBorders,
        renderScale: state.renderScale,
      }),
    }
  )
);

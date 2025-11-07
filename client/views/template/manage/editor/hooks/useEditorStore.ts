import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MiscellaneousPanelTab } from "../configPanel/types";

type BaseElementChange = {
  elementId: number;
  property: "positionX" | "positionY" | "width" | "height";
  oldValue: number;
  newValue: number;
};

type HistoryEntry = {
  changes: BaseElementChange[];
  timestamp: number;
};

interface EditorState {
  currntMiscellaneousPanelTab: MiscellaneousPanelTab;
  currentElementId: number | null;
  history: HistoryEntry[];
  historyIndex: number;
}

interface EditorActions {
  setCurrntMiscellaneousPanelTab: (tab: MiscellaneousPanelTab) => void;
  setCurrentElementId: (id: number | null) => void;
  addToHistory: (changes: BaseElementChange[]) => void;
  undo: () => BaseElementChange[] | null;
  redo: () => BaseElementChange[] | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currntMiscellaneousPanelTab: "config",
      currentElementId: null,
      history: [],
      historyIndex: -1,

      setCurrntMiscellaneousPanelTab: tab => set({ currntMiscellaneousPanelTab: tab }),

      setCurrentElementId: id => set({ currentElementId: id }),

      addToHistory: changes => {
        const { history, historyIndex } = get();

        // Remove any redo history when adding new changes
        const newHistory = history.slice(0, historyIndex + 1);

        // Add new entry
        newHistory.push({
          changes,
          timestamp: Date.now(),
        });

        // Limit history to 50 entries
        const limitedHistory = newHistory.length > 50 ? newHistory.slice(-50) : newHistory;

        set({
          history: limitedHistory,
          historyIndex: limitedHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex } = get();

        if (historyIndex < 0) {
          return null;
        }

        const entry = history[historyIndex];
        set({ historyIndex: historyIndex - 1 });

        // Return changes with old values to revert
        return entry.changes.map(change => ({
          ...change,
          newValue: change.oldValue,
        }));
      },

      redo: () => {
        const { history, historyIndex } = get();

        if (historyIndex >= history.length - 1) {
          return null;
        }

        const newIndex = historyIndex + 1;
        const entry = history[newIndex];
        set({ historyIndex: newIndex });

        // Return changes with new values to reapply
        return entry.changes;
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex >= 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },
    }),
    {
      name: "editor-store",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        currntMiscellaneousPanelTab: state.currntMiscellaneousPanelTab,
      }),
    }
  )
);

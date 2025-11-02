import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MiscellaneousPanelTab } from "./miscellaneousPanel/types";


interface EditorState {
  currntMiscellaneousPanelTab: MiscellaneousPanelTab;
  currentCertificateElementId: number | null;
}

interface EditorActions {
  setCurrntMiscellaneousPanelTab: (tab: MiscellaneousPanelTab) => void;
  setCurrentCertificateElementId: (id: number | null) => void;
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>()(
  persist(
    set => ({
      currntMiscellaneousPanelTab: "config",
      currentCertificateElementId: null,
      setCurrntMiscellaneousPanelTab: tab =>
        set({ currntMiscellaneousPanelTab: tab }),
      setCurrentCertificateElementId: id =>
        set({ currentCertificateElementId: id }),
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

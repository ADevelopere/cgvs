import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FontListItem, FontDetailView } from "../types";
import logger from "@/client/lib/logger";

/**
 * Font UI Store State
 * Manages font selection, search, and UI state
 */
type State = {
  // Font data
  fonts: FontListItem[];
  currentFont: FontDetailView | null;
  selectedFontId: number | null;

  // Search and filters
  searchTerm: string;

  // UI state
  isFilePickerOpen: boolean;
  isCreating: boolean;
  isEditing: boolean;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
};

type Actions = {
  // Font data actions
  setFonts: (fonts: FontListItem[]) => void;
  setCurrentFont: (font: FontDetailView | null) => void;
  setSelectedFontId: (id: number | null) => void;
  
  // Search actions
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // UI actions
  openFilePicker: () => void;
  closeFilePicker: () => void;
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;

  // Loading actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;

  // Utility actions
  reset: () => void;
};

type FontStoreState = State & Actions;

const initialState: State = {
  fonts: [],
  currentFont: null,
  selectedFontId: null,
  searchTerm: "",
  isFilePickerOpen: false,
  isCreating: false,
  isEditing: false,
  isLoading: false,
  isSaving: false,
};

/**
 * Zustand store for font UI state
 * Persists selection and search to sessionStorage
 */
export const useFontStore = create<FontStoreState>()(
  persist(
    set => ({
      ...initialState,

      // Font data actions
      setFonts: fonts => {
        logger.info("Setting fonts in store:", fonts.length);
        set({ fonts });
      },

      setCurrentFont: font => {
        logger.info("Setting current font:", font?.id);
        set({ currentFont: font });
      },

      setSelectedFontId: id => {
        logger.info("Setting selected font ID:", id);
        set({ selectedFontId: id });
      },

      // Search actions
      setSearchTerm: term => {
        logger.info("Setting search term:", term);
        set({ searchTerm: term });
      },

      clearSearch: () => {
        logger.info("Clearing search");
        set({ searchTerm: "" });
      },

      // UI actions
      openFilePicker: () => {
        logger.info("Opening file picker");
        set({ isFilePickerOpen: true });
      },

      closeFilePicker: () => {
        logger.info("Closing file picker");
        set({ isFilePickerOpen: false });
      },

      startCreating: () => {
        logger.info("Starting font creation");
        set({
          isCreating: true,
          isEditing: false,
          currentFont: null,
          selectedFontId: null,
        });
      },

      cancelCreating: () => {
        logger.info("Canceling font creation");
        set({ isCreating: false });
      },

      startEditing: () => {
        logger.info("Starting font editing");
        set({ isEditing: true });
      },

      cancelEditing: () => {
        logger.info("Canceling font editing");
        set({ isEditing: false });
      },

      // Loading actions
      setLoading: loading => set({ isLoading: loading }),
      setSaving: saving => set({ isSaving: saving }),

      // Utility
      reset: () => {
        logger.info("Resetting font store");
        set(initialState);
      },
    }),
    {
      name: "font-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist only essential state
      partialize: state => ({
        selectedFontId: state.selectedFontId,
        searchTerm: state.searchTerm,
      }),
      // Custom merge to handle restoration
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<State>;
        return {
          ...currentState,
          selectedFontId: typedPersistedState.selectedFontId ?? currentState.selectedFontId,
          searchTerm: typedPersistedState.searchTerm ?? currentState.searchTerm,
        };
      },
    }
  )
);


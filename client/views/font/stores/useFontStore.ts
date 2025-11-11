import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import logger from "@/client/lib/logger";

/**
 * Font UI Store State
 * Manages selection and UI state only
 * Data is managed by Apollo Client
 */
type State = {
  // Selection
  selectedFamilyId: number | null;
  selectedVariantId: number | null;

  // UI state
  isCreating: boolean;
  isEditingFamily: boolean;
  isEditingVariant: boolean;
  isAddingVariant: boolean;
};

type Actions = {
  // Selection actions
  setSelectedFamilyId: (familyId: number | null) => void;
  setSelectedVariantId: (variantId: number | null) => void;

  // UI actions
  startCreating: () => void;
  cancelCreating: () => void;
  startEditingFamily: () => void;
  cancelEditingFamily: () => void;
  startEditingVariant: (variantId: number) => void;
  cancelEditingVariant: () => void;
  startAddingVariant: () => void;
  cancelAddingVariant: () => void;

  // Utility actions
  reset: () => void;
};

type FontStoreState = State & Actions;

const initialState: State = {
  selectedFamilyId: null,
  selectedVariantId: null,
  isCreating: false,
  isEditingFamily: false,
  isEditingVariant: false,
  isAddingVariant: false,
};

/**
 * Zustand store for font UI state
 * Persists selection and query params to sessionStorage
 */
export const useFontStore = create<FontStoreState>()(
  persist(
    set => ({
      ...initialState,

      // Selection actions
      setSelectedFamilyId: familyId => {
        logger.info({ caller: "useFontStore" }, "Setting selected family:", familyId);
        set({ selectedFamilyId: familyId, selectedVariantId: null });
      },

      setSelectedVariantId: variantId => {
        logger.info({ caller: "useFontStore" }, "Setting selected variant:", variantId);
        set({ selectedVariantId: variantId });
      },

      // UI actions
      startCreating: () => {
        logger.info({ caller: "useFontStore" }, "Starting family creation");
        set({
          isCreating: true,
          isEditingFamily: false,
          isEditingVariant: false,
          isAddingVariant: false,
          selectedFamilyId: null,
          selectedVariantId: null,
        });
      },

      cancelCreating: () => {
        logger.info({ caller: "useFontStore" }, "Canceling family creation");
        set({ isCreating: false });
      },

      startEditingFamily: () => {
        logger.info({ caller: "useFontStore" }, "Starting family editing");
        set({ isEditingFamily: true });
      },

      cancelEditingFamily: () => {
        logger.info({ caller: "useFontStore" }, "Canceling family editing");
        set({ isEditingFamily: false });
      },

      startEditingVariant: variantId => {
        logger.info({ caller: "useFontStore" }, "Starting variant editing:", variantId);
        set({ isEditingVariant: true, selectedVariantId: variantId });
      },

      cancelEditingVariant: () => {
        logger.info({ caller: "useFontStore" }, "Canceling variant editing");
        set({ isEditingVariant: false, selectedVariantId: null });
      },

      startAddingVariant: () => {
        logger.info({ caller: "useFontStore" }, "Starting add variant");
        set({ isAddingVariant: true });
      },

      cancelAddingVariant: () => {
        logger.info({ caller: "useFontStore" }, "Canceling add variant");
        set({ isAddingVariant: false });
      },

      // Utility
      reset: () => {
        logger.info({ caller: "useFontStore" }, "Resetting font store");
        set(initialState);
      },
    }),
    {
      name: "font-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({
        selectedFamilyId: state.selectedFamilyId,
      }),
    }
  )
);

"use client";

import { create } from "zustand";

interface TemplateVariableUIState {
  selectedVariables: number[];
  lastSelectedVariable: number | null;
  focusedVariable: number | null;
  operationErrors: Record<string, string>;
}

interface TemplateVariableUIActions {
  toggleSelect: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
  selectRange: (startId: number, endId: number, allIds: number[]) => void;
  setFocusedVariable: (id: number | null) => void;
  setOperationError: (operation: string, error: string | null) => void;
  clearOperationError: (operation: string) => void;
  clearAllErrors: () => void;
  reset: () => void;
}

const initialState: TemplateVariableUIState = {
  selectedVariables: [],
  lastSelectedVariable: null,
  focusedVariable: null,
  operationErrors: {},
};

export const useTemplateVariableUIStore = create<
  TemplateVariableUIState & TemplateVariableUIActions
>((set) => ({
  ...initialState,

  toggleSelect: (id) =>
    set((state) => {
      const isSelected = state.selectedVariables.includes(id);
      if (isSelected) {
        return {
          selectedVariables: state.selectedVariables.filter(
            (variableId) => variableId !== id,
          ),
          lastSelectedVariable:
            state.lastSelectedVariable === id
              ? null
              : state.lastSelectedVariable,
        };
      } else {
        return {
          selectedVariables: [...state.selectedVariables, id],
          lastSelectedVariable: id,
        };
      }
    }),

  selectAll: (ids) =>
    set({
      selectedVariables: ids,
      lastSelectedVariable: ids.length > 0 ? ids[ids.length - 1] : null,
    }),

  clearSelection: () =>
    set({
      selectedVariables: [],
      lastSelectedVariable: null,
    }),

  selectRange: (startId, endId, allIds) =>
    set((state) => {
      const startIndex = allIds.indexOf(startId);
      const endIndex = allIds.indexOf(endId);

      if (startIndex === -1 || endIndex === -1) return state;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      const rangeIds = allIds.slice(start, end + 1);

      const newSelection = new Set([...state.selectedVariables, ...rangeIds]);
      return {
        selectedVariables: Array.from(newSelection),
        lastSelectedVariable: endId,
      };
    }),

  setFocusedVariable: (id) => set({ focusedVariable: id }),

  setOperationError: (operation, error) =>
    set((state) => ({
      operationErrors: {
        ...state.operationErrors,
        [operation]: error || "",
      },
    })),

  clearOperationError: (operation) =>
    set((state) => {
      const newErrors = { ...state.operationErrors };
      delete newErrors[operation];
      return { operationErrors: newErrors };
    }),

  clearAllErrors: () => set({ operationErrors: {} }),

  reset: () => set(initialState),
}));

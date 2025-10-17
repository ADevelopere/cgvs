"use client";

import { useCallback } from "react";
import { useTemplateVariableUIStore, useTemplateVariableDataStore } from "../stores";

/**
 * Selection management hook for template variables
 * Wraps UI store selection logic
 */
export const useTemplateVariableSelection = () => {
  // Extract stable action references from stores
  const toggleSelectAction = useTemplateVariableUIStore((state) => state.toggleSelect);
  const selectAllAction = useTemplateVariableUIStore((state) => state.selectAll);
  const clearSelectionAction = useTemplateVariableUIStore((state) => state.clearSelection);
  const selectRangeAction = useTemplateVariableUIStore((state) => state.selectRange);
  const setFocusedVariableAction = useTemplateVariableUIStore((state) => state.setFocusedVariable);

  const selectedVariables = useTemplateVariableUIStore((state) => state.selectedVariables);
  const lastSelectedVariable = useTemplateVariableUIStore((state) => state.lastSelectedVariable);
  const focusedVariable = useTemplateVariableUIStore((state) => state.focusedVariable);

  const variables = useTemplateVariableDataStore((state) => state.variables);

  const toggleSelect = useCallback((id: number) => {
    toggleSelectAction(id);
  }, [toggleSelectAction]);

  const selectAll = useCallback(() => {
    const allIds = variables.map((variable) => variable.id).filter((id): id is number => id !== null);
    selectAllAction(allIds);
  }, [variables, selectAllAction]);

  const clearSelection = useCallback(() => {
    clearSelectionAction();
  }, [clearSelectionAction]);

  const selectRange = useCallback((startId: number, endId: number) => {
    const allIds = variables.map((variable) => variable.id).filter((id): id is number => id !== null);
    selectRangeAction(startId, endId, allIds);
  }, [variables, selectRangeAction]);

  const setFocusedVariable = useCallback((id: number | null) => {
    setFocusedVariableAction(id);
  }, [setFocusedVariableAction]);

  return {
    // Selection state
    selectedVariables,
    lastSelectedVariable,
    focusedVariable,

    // Selection actions
    toggleSelect,
    selectAll,
    clearSelection,
    selectRange,
    setFocusedVariable,
  };
};

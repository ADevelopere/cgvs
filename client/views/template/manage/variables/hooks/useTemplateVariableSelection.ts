"use client";

import { useCallback } from "react";
import { useTemplateVariableUIStore, useTemplateVariableDataStore } from "../stores";

/**
 * Selection management hook for template variables
 * Wraps UI store selection logic
 */
export const useTemplateVariableSelection = () => {
  const uiStore = useTemplateVariableUIStore();
  const dataStore = useTemplateVariableDataStore();

  const toggleSelect = useCallback((id: number) => {
    uiStore.toggleSelect(id);
  }, [uiStore]);

  const selectAll = useCallback(() => {
    const allIds = dataStore.variables.map((variable) => variable.id).filter((id): id is number => id !== null);
    uiStore.selectAll(allIds);
  }, [dataStore.variables, uiStore]);

  const clearSelection = useCallback(() => {
    uiStore.clearSelection();
  }, [uiStore]);

  const selectRange = useCallback((startId: number, endId: number) => {
    const allIds = dataStore.variables.map((variable) => variable.id).filter((id): id is number => id !== null);
    uiStore.selectRange(startId, endId, allIds);
  }, [dataStore.variables, uiStore]);

  const setFocusedVariable = useCallback((id: number | null) => {
    uiStore.setFocusedVariable(id);
  }, [uiStore]);

  return {
    // Selection state
    selectedVariables: uiStore.selectedVariables,
    lastSelectedVariable: uiStore.lastSelectedVariable,
    focusedVariable: uiStore.focusedVariable,
    
    // Selection actions
    toggleSelect,
    selectAll,
    clearSelection,
    selectRange,
    setFocusedVariable,
    
    // Store access for advanced usage
    uiStore,
  };
};

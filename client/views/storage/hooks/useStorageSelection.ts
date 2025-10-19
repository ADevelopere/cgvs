"use client";

import { useCallback } from "react";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataStore } from "../stores/useStorageDataStore";

export const useStorageSelection = () => {
  const {
    selectedItems,
    lastSelectedItem,
    focusedItem,
    toggleSelect: toggleSelectAction,
    selectAll: selectAllAction,
    clearSelection: clearSelectionAction,
    selectRange: selectRangeAction,
    setLastSelectedItem,
    setFocusedItem,
  } = useStorageUIStore();
  const { items } = useStorageDataStore();

  const toggleSelect = useCallback(
    (path: string) => {
      toggleSelectAction(path);
    },
    [toggleSelectAction]
  );

  const selectAll = useCallback(() => {
    selectAllAction(items);
  }, [selectAllAction, items]);

  const clearSelection = useCallback(() => {
    clearSelectionAction();
  }, [clearSelectionAction]);

  const selectRange = useCallback(
    (fromPath: string, toPath: string) => {
      selectRangeAction(fromPath, toPath, items);
    },
    [selectRangeAction, items]
  );

  return {
    selectedItems,
    lastSelectedItem,
    focusedItem,
    toggleSelect,
    selectAll,
    clearSelection,
    selectRange,
    setLastSelectedItem,
    setFocusedItem,
  };
};

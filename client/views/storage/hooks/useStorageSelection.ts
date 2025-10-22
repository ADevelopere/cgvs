"use client";

import { useCallback, useMemo } from "react";
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

  // Stabilize primitive values with useMemo
  const stableSelectedItems = useMemo(() => selectedItems, [selectedItems]);
  const stableLastSelectedItem = useMemo(
    () => lastSelectedItem,
    [lastSelectedItem]
  );
  const stableFocusedItem = useMemo(() => focusedItem, [focusedItem]);

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

  return useMemo(
    () => ({
      selectedItems: stableSelectedItems,
      lastSelectedItem: stableLastSelectedItem,
      focusedItem: stableFocusedItem,
      toggleSelect,
      selectAll,
      clearSelection,
      selectRange,
      setLastSelectedItem,
      setFocusedItem,
    }),
    [
      stableSelectedItems,
      stableLastSelectedItem,
      stableFocusedItem,
      toggleSelect,
      selectAll,
      clearSelection,
      selectRange,
      setLastSelectedItem,
      setFocusedItem,
    ]
  );
};

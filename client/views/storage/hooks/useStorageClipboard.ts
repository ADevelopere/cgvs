"use client";

import { useCallback, useMemo } from "react";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useStorageNavigation } from "./useStorageNavigation";
import { StorageItem } from "../core/storage.type";

export const useStorageClipboard = () => {
  const {
    clipboard,
    copyItems: copyItemsAction,
    cutItems: cutItemsAction,
    clearClipboard,
  } = useStorageUIStore();
  const { copy, move } = useStorageDataOperations();
  const { refresh } = useStorageNavigation();

  // Stabilize clipboard reference with useMemo
  const stableClipboard = useMemo(() => clipboard, [clipboard]);

  const copyItems = useCallback(
    (items: StorageItem[]) => {
      copyItemsAction(items);
    },
    [copyItemsAction]
  );

  const cutItems = useCallback(
    (items: StorageItem[]) => {
      cutItemsAction(items);
    },
    [cutItemsAction]
  );

  const pasteItems = useCallback(async (): Promise<boolean> => {
    if (!stableClipboard) return false;

    const sourcePaths = stableClipboard.items.map(item => item.path);
    const destinationPath = ""; // This should come from current path in data store

    if (stableClipboard.operation === "copy") {
      const success = await copy(sourcePaths, destinationPath);
      if (success) {
        await refresh();
      }
      return success;
    } else if (stableClipboard.operation === "cut") {
      const success = await move(sourcePaths, destinationPath);
      if (success) {
        clearClipboard(); // Clear clipboard after successful cut/paste
        await refresh();
      }
      return success;
    }

    return false;
  }, [stableClipboard, copy, move, refresh, clearClipboard]);

  return useMemo(
    () => ({
      clipboard: stableClipboard,
      copyItems,
      cutItems,
      pasteItems,
      clearClipboard,
    }),
    [stableClipboard, copyItems, cutItems, pasteItems, clearClipboard]
  );
};

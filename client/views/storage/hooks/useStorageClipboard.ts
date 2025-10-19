"use client";

import { useCallback } from "react";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useStorageNavigation } from "./useStorageNavigation";
import { StorageItem } from "./storage.type";

export const useStorageClipboard = () => {
  const {
    clipboard,
    copyItems: copyItemsAction,
    cutItems: cutItemsAction,
    clearClipboard,
  } = useStorageUIStore();
  const { copy, move } = useStorageDataOperations();
  const { refresh } = useStorageNavigation();

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
    if (!clipboard) return false;

    const sourcePaths = clipboard.items.map(item => item.path);
    const destinationPath = ""; // This should come from current path in data store

    if (clipboard.operation === "copy") {
      const success = await copy(sourcePaths, destinationPath);
      if (success) {
        await refresh();
      }
      return success;
    } else if (clipboard.operation === "cut") {
      const success = await move(sourcePaths, destinationPath);
      if (success) {
        clearClipboard(); // Clear clipboard after successful cut/paste
        await refresh();
      }
      return success;
    }

    return false;
  }, [clipboard, copy, move, refresh, clearClipboard]);

  return {
    clipboard,
    copyItems,
    cutItems,
    pasteItems,
    clearClipboard,
  };
};

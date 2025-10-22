"use client";

import { useCallback, useMemo } from "react";
import { useStorageDataOperations } from "./useStorageDataOperations";
import { useStorageNavigation } from "./useStorageNavigation";
import { useStorageUIStore } from "../stores/useStorageUIStore";

export const useStorageFileOperations = () => {
  const { rename, remove, move, copy } = useStorageDataOperations();
  const { refresh } = useStorageNavigation();
  const { updateLoading, clearSelection } = useStorageUIStore();

  const renameItem = useCallback(
    async (path: string, newName: string): Promise<boolean> => {
      updateLoading("rename", true);
      const success = await rename(path, newName);
      updateLoading("rename", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [rename, refresh, updateLoading]
  );

  const deleteItems = useCallback(
    async (paths: string[]): Promise<boolean> => {
      updateLoading("delete", true);
      const success = await remove(paths);
      updateLoading("delete", false);

      if (success) {
        // Clear selection of deleted items
        clearSelection();
        await refresh();
      }
      return success;
    },
    [remove, refresh, updateLoading, clearSelection]
  );

  const moveItems = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      updateLoading("move", true);
      const success = await move(sourcePaths, destinationPath);
      updateLoading("move", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [move, refresh, updateLoading]
  );

  const copyItemsTo = useCallback(
    async (
      sourcePaths: string[],
      destinationPath: string
    ): Promise<boolean> => {
      updateLoading("copy", true);
      const success = await copy(sourcePaths, destinationPath);
      updateLoading("copy", false);

      if (success) {
        await refresh();
      }
      return success;
    },
    [copy, refresh, updateLoading]
  );

  return useMemo(
    () => ({
      renameItem,
      deleteItems,
      moveItems,
      copyItemsTo,
    }),
    [renameItem, deleteItems, moveItems, copyItemsTo]
  );
};

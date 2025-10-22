"use client";

import { useCallback, useMemo } from "react";
import { useStorageUIStore } from "../stores/useStorageUIStore";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import { StorageItem } from "./storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const useStorageSorting = () => {
  const {
    sortBy,
    sortDirection,
    searchMode,
    searchResults,
    setSortBy: setSortByAction,
    setSortDirection: setSortDirectionAction,
  } = useStorageUIStore();
  const { items } = useStorageDataStore();

  // Stabilize primitive values with useMemo
  const stableSortBy = useMemo(() => sortBy, [sortBy]);
  const stableSortDirection = useMemo(() => sortDirection, [sortDirection]);

  const setSortBy = useCallback(
    (field: string) => {
      setSortByAction(field);
    },
    [setSortByAction]
  );

  const setSortDirection = useCallback(
    (direction: Graphql.OrderSortDirection) => {
      setSortDirectionAction(direction);
    },
    [setSortDirectionAction]
  );

  const getSortedItems = useCallback((): StorageItem[] => {
    const currentItems = searchMode ? searchResults : items;

    return [...currentItems].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      switch (stableSortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "size":
          // FileInfo has size, DirectoryInfo has totalSize
          if (a.__typename === "FileInfo") {
            aValue = a.size;
          } else if (a.__typename === "DirectoryInfo") {
            aValue = a.totalSize || 0;
          } else {
            aValue = 0;
          }

          if (b.__typename === "FileInfo") {
            bValue = b.size;
          } else if (b.__typename === "DirectoryInfo") {
            bValue = b.totalSize || 0;
          } else {
            bValue = 0;
          }
          break;
        case "lastModified":
          aValue =
            (a as unknown as { lastModified?: number }).lastModified ?? 0;
          bValue =
            (b as unknown as { lastModified?: number }).lastModified ?? 0;
          break;
        case "created":
          aValue = (a as unknown as { created?: number }).created ?? 0;
          bValue = (b as unknown as { created?: number }).created ?? 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return stableSortDirection === "ASC" ? -1 : 1;
      if (aValue > bValue) return stableSortDirection === "ASC" ? 1 : -1;
      return 0;
    });
  }, [searchMode, searchResults, items, stableSortBy, stableSortDirection]);

  return useMemo(
    () => ({
      sortBy: stableSortBy,
      sortDirection: stableSortDirection,
      setSortBy,
      setSortDirection,
      getSortedItems,
    }),
    [
      stableSortBy,
      stableSortDirection,
      setSortBy,
      setSortDirection,
      getSortedItems,
    ]
  );
};

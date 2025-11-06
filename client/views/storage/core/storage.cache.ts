import { ApolloClient } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

/**
 * Evicts and deletes listFiles cache for a specific path
 *
 * Strategy:
 * 1. Evict (refetch) the cache entry with current active params
 * 2. Delete all other cache entries for the same path but different params
 *
 * This ensures the current view refetches while removing stale cached variations
 */
export const evictListFilesCache = (
  apolloClient: ApolloClient,
  path: string,
  currentParams: Graphql.FilesListInput
): void => {
  const targetPath = path || "";

  // First, evict the current active params (will refetch)
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "listFiles",
    args: {
      input: {
        path: targetPath,
        limit: currentParams.limit,
        offset: currentParams.offset,
      },
    },
  });

  // Then, delete all other cached variations for this path
  apolloClient.cache.modify({
    id: "ROOT_QUERY",
    fields: {
      listFiles(existingRef, { DELETE, storeFieldName }) {
        // Parse the storeFieldName to check if it matches our target path
        // but with different params (limit/offset)
        if (!storeFieldName) return existingRef;

        // Check if this cached query is for our target path
        const pathMatch = storeFieldName.includes(`"path":"${targetPath}"`);
        if (!pathMatch) return existingRef;

        // Check if it's NOT the current active params
        const isCurrentParams =
          storeFieldName.includes(`"limit":${currentParams.limit}`) &&
          storeFieldName.includes(`"offset":${currentParams.offset}`);

        // Delete if it's the same path but different params
        if (!isCurrentParams) {
          return DELETE;
        }

        return existingRef;
      },
    },
  });

  apolloClient.cache.gc();
};

/**
 * Evicts directoryChildren cache for a specific path
 */
export const evictDirectoryChildrenCache = (apolloClient: ApolloClient, path: string): void => {
  const targetPath = path || "";
  apolloClient.cache.evict({
    id: "ROOT_QUERY",
    fieldName: "directoryChildren",
    args: { path: targetPath },
  });
  apolloClient.cache.gc();
};

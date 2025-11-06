"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import * as Document from "../core/storage.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";
import { useStorageDataStore } from "../stores/useStorageDataStore";
import {
  evictListFilesCache as evictListFilesCacheUtil,
  evictDirectoryChildrenCache as evictDirectoryChildrenCacheUtil,
} from "../core/storage.cache";

type StorageMutations = {
  copyStorageItems: (variables: {
    input: Graphql.StorageItemsCopyInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.CopyStorageItemsMutation>>;
  createFolder: (variables: {
    input: Graphql.FolderCreateInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.CreateFolderMutation>>;
  deleteFile: (variables: { path: string }) => Promise<ApolloClient.MutateResult<Graphql.DeleteFileMutation>>;
  deleteStorageItems: (variables: {
    input: Graphql.StorageItemsDeleteInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.DeleteStorageItemsMutation>>;
  generateUploadSignedUrl: (variables: {
    input: Graphql.UploadSignedUrlGenerateInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.GenerateUploadSignedUrlMutation>>;
  moveStorageItems: (variables: {
    input: Graphql.StorageItemsMoveInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.MoveStorageItemsMutation>>;
  renameFile: (variables: {
    input: Graphql.FileRenameInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.RenameFileMutation>>;
  setStorageItemProtection: (variables: {
    input: Graphql.StorageItemProtectionUpdateInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.SetStorageItemProtectionMutation>>;
  updateDirectoryPermissions: (variables: {
    input: Graphql.DirectoryPermissionsUpdateInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.UpdateDirectoryPermissionsMutation>>;
  evictListFilesCache: (path?: string) => void;
  evictDirectoryChildrenCache: (path?: string) => void;
};

export const useStorageMutations = (): StorageMutations => {
  const apolloClient = useApolloClient();
  const { params } = useStorageDataStore();
  const paramsRef = useRef<Graphql.FilesListInput>(params);

  // Keep paramsRef updated
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Cache eviction helpers
  const evictListFilesCache = useCallback(
    (path?: string) => {
      evictListFilesCacheUtil(apolloClient, path || "", paramsRef.current);
    },
    [apolloClient]
  );

  const evictDirectoryChildrenCache = useCallback(
    (path?: string) => {
      evictDirectoryChildrenCacheUtil(apolloClient, path || "");
    },
    [apolloClient]
  );
  // Create mutation hooks - extract just the mutation function (first element)
  // The mutation function from useMutation is stable and doesn't recreate
  const [copyStorageItemsMutation] = useMutation(Document.copyStorageItemsMutationDocument);
  const [createFolderMutation] = useMutation(Document.createFolderMutationDocument);
  const [deleteFileMutation] = useMutation(Document.deleteFileMutationDocument);
  const [deleteStorageItemsMutation] = useMutation(Document.deleteStorageItemsMutationDocument);
  const [generateUploadSignedUrlMutation] = useMutation(Document.generateUploadSignedUrlMutationDocument);
  const [moveStorageItemsMutation] = useMutation(Document.moveStorageItemsMutationDocument);
  const [renameFileMutation] = useMutation(Document.renameFileMutationDocument);
  const [setStorageItemProtectionMutation] = useMutation(Document.setStorageItemProtectionMutationDocument);
  const [updateDirectoryPermissionsMutation] = useMutation(Document.updateDirectoryPermissionsMutationDocument);

  const copyStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsCopyInput }) => {
      const result = await copyStorageItemsMutation({ variables });

      // Evict cache for destination directory
      const destinationPath = variables.input.destinationPath;
      evictListFilesCache(destinationPath);

      // Only evict directory children cache if we copied any directories
      // Evict the destination parent's directoryChildren cache
      const hasCopiedDirectory = result.data?.copyStorageItems?.successfulItems?.some(
        item => item.__typename === "DirectoryInfo"
      );

      if (hasCopiedDirectory) {
        evictDirectoryChildrenCache(destinationPath);
      }

      return result;
    },
    [copyStorageItemsMutation, evictListFilesCache, evictDirectoryChildrenCache]
  );

  const createFolder = useCallback(
    async (variables: { input: Graphql.FolderCreateInput }) => {
      const result = await createFolderMutation({ variables });

      // Evict cache for parent directory where folder was created
      // input.path is the full path of the new folder, so extract parent
      const parentPath = variables.input.path.substring(0, variables.input.path.lastIndexOf("/"));
      evictListFilesCache(parentPath);
      evictDirectoryChildrenCache(parentPath);

      return result;
    },
    [createFolderMutation, evictListFilesCache, evictDirectoryChildrenCache]
  );

  const deleteFile = useCallback(
    async (variables: { path: string }) => {
      const result = await deleteFileMutation({ variables });

      // Evict cache for parent directory
      const parentPath = variables.path.substring(0, variables.path.lastIndexOf("/"));
      evictListFilesCache(parentPath);

      return result;
    },
    [deleteFileMutation, evictListFilesCache]
  );

  const deleteStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsDeleteInput }) => {
      const result = await deleteStorageItemsMutation({ variables });

      // Evict cache for all affected parent directories
      const uniqueParentPaths = new Set<string>();
      const parentPathsOfDeletedDirectories = new Set<string>();

      // Check successful items to determine if they were directories
      result.data?.deleteStorageItems?.successfulItems?.forEach(item => {
        if (item.__typename === "DirectoryInfo") {
          // For deleted directories, evict their parent's directoryChildren cache
          const parentPath = item.path.substring(0, item.path.lastIndexOf("/"));
          parentPathsOfDeletedDirectories.add(parentPath);
        }
      });

      variables.input.paths.forEach(path => {
        const parentPath = path.substring(0, path.lastIndexOf("/"));
        uniqueParentPaths.add(parentPath);
      });

      uniqueParentPaths.forEach(parentPath => {
        evictListFilesCache(parentPath);
      });

      // Evict directory children cache for parents of deleted directories
      parentPathsOfDeletedDirectories.forEach(parentPath => {
        evictDirectoryChildrenCache(parentPath);
      });

      return result;
    },
    [deleteStorageItemsMutation, evictListFilesCache, evictDirectoryChildrenCache]
  );

  const generateUploadSignedUrl = useCallback(
    async (variables: { input: Graphql.UploadSignedUrlGenerateInput }) => {
      return generateUploadSignedUrlMutation({ variables });
    },
    [generateUploadSignedUrlMutation]
  );

  const moveStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsMoveInput }) => {
      const result = await moveStorageItemsMutation({ variables });

      // Track parent directories of moved directories
      const sourceParentsOfMovedDirectories = new Set<string>();
      const hasMovedDirectory = result.data?.moveStorageItems?.successfulItems?.some(item => {
        if (item.__typename === "DirectoryInfo") {
          // Find the original path for this item
          const originalPath = variables.input.sourcePaths.find(p => p.endsWith(`/${item.name}`) || p === item.name);
          if (originalPath) {
            const sourceParent = originalPath.substring(0, originalPath.lastIndexOf("/"));
            sourceParentsOfMovedDirectories.add(sourceParent);
          }
          return true;
        }
        return false;
      });

      // Evict cache for source parent directories
      const uniqueSourcePaths = new Set<string>();
      variables.input.sourcePaths.forEach(path => {
        const parentPath = path.substring(0, path.lastIndexOf("/"));
        uniqueSourcePaths.add(parentPath);
      });

      uniqueSourcePaths.forEach(parentPath => {
        evictListFilesCache(parentPath);
      });

      // Evict cache for destination directory
      const destinationPath = variables.input.destinationPath;
      evictListFilesCache(destinationPath);

      // Evict directory children cache for parents of moved directories
      // Source parents (where directories were removed from)
      sourceParentsOfMovedDirectories.forEach(parentPath => {
        evictDirectoryChildrenCache(parentPath);
      });
      // Destination parent (where directories were added to)
      if (hasMovedDirectory) {
        evictDirectoryChildrenCache(destinationPath);
      }

      return result;
    },
    [moveStorageItemsMutation, evictListFilesCache, evictDirectoryChildrenCache]
  );

  const renameFile = useCallback(
    async (variables: { input: Graphql.FileRenameInput }) => {
      const result = await renameFileMutation({ variables });

      // Evict cache for parent directory
      const parentPath = variables.input.currentPath.substring(0, variables.input.currentPath.lastIndexOf("/"));
      evictListFilesCache(parentPath);

      // Only evict directory children if the renamed item was a directory
      // Evict the parent's directoryChildren cache since the parent's children have changed
      if (result.data?.renameFile?.data?.__typename === "DirectoryInfo") {
        evictDirectoryChildrenCache(parentPath);
      }

      return result;
    },
    [renameFileMutation, evictListFilesCache, evictDirectoryChildrenCache]
  );

  const setStorageItemProtection = useCallback(
    async (variables: { input: Graphql.StorageItemProtectionUpdateInput }) => {
      return setStorageItemProtectionMutation({ variables });
    },
    [setStorageItemProtectionMutation]
  );

  const updateDirectoryPermissions = useCallback(
    async (variables: { input: Graphql.DirectoryPermissionsUpdateInput }) => {
      return updateDirectoryPermissionsMutation({ variables });
    },
    [updateDirectoryPermissionsMutation]
  );
  return useMemo(
    () => ({
      copyStorageItems,
      createFolder,
      deleteFile,
      deleteStorageItems,
      generateUploadSignedUrl,
      moveStorageItems,
      renameFile,
      setStorageItemProtection,
      updateDirectoryPermissions,
      evictListFilesCache,
      evictDirectoryChildrenCache,
    }),
    [
      copyStorageItems,
      createFolder,
      deleteFile,
      deleteStorageItems,
      generateUploadSignedUrl,
      moveStorageItems,
      renameFile,
      setStorageItemProtection,
      updateDirectoryPermissions,
      evictListFilesCache,
      evictDirectoryChildrenCache,
    ]
  );
};

"use client";

import { useMutation, useLazyQuery } from "@apollo/client/react";
import { useMemo } from "react";
import * as Document from "./storage.documents";
import { useMutationWrapper } from "@/client/graphql/utils";

export const useStorageApolloQueries = () => {
  // Create lazy query hooks - extract just the query function (first element)
  // The query function from useLazyQuery is stable and doesn't recreate
  const [checkFileUsage] = useLazyQuery(Document.fileUsageQueryDocument, {
    fetchPolicy: "network-only",
  });

  const [fetchDirectoryChildren] = useLazyQuery(
    Document.directoryChildrenQueryDocument,
    {
      fetchPolicy: "network-only",
    }
  );

  const [getFileInfo] = useLazyQuery(Document.fileInfoQueryDocument, {
    fetchPolicy: "network-only",
  });

  const [getFolderInfo] = useLazyQuery(Document.folderInfoQueryDocument, {
    fetchPolicy: "network-only",
  });

  const [getStorageStats] = useLazyQuery(Document.storageStatsQueryDocument, {
    fetchPolicy: "network-only",
  });

  const [listFiles] = useLazyQuery(Document.listFilesQueryDocument, {
    fetchPolicy: "network-only",
  });

  const [searchFiles] = useLazyQuery(Document.searchFilesQueryDocument, {
    fetchPolicy: "network-only",
  });

  // Return stable object with raw Apollo query functions
  // No wrapper needed - Apollo functions are already stable
  return useMemo(
    () => ({
      checkFileUsage,
      fetchDirectoryChildren,
      getFileInfo,
      getFolderInfo,
      getStorageStats,
      listFiles,
      searchFiles,
    }),
    [
      checkFileUsage,
      fetchDirectoryChildren,
      getFileInfo,
      getFolderInfo,
      getStorageStats,
      listFiles,
      searchFiles,
    ]
  );
};

export const useStorageApolloMutations = () => {
  const copyStorageItems = useMutationWrapper(
    useMutation(Document.copyStorageItemsMutationDocument)
  );
  const createFolder = useMutationWrapper(
    useMutation(Document.createFolderMutationDocument)
  );
  const deleteFile = useMutationWrapper(
    useMutation(Document.deleteFileMutationDocument)
  );
  const deleteStorageItems = useMutationWrapper(
    useMutation(Document.deleteStorageItemsMutationDocument)
  );
  const generateUploadSignedUrl = useMutationWrapper(
    useMutation(Document.generateUploadSignedUrlMutationDocument)
  );
  const moveStorageItems = useMutationWrapper(
    useMutation(Document.moveStorageItemsMutationDocument)
  );
  const renameFile = useMutationWrapper(
    useMutation(Document.renameFileMutationDocument)
  );
  const setStorageItemProtection = useMutationWrapper(
    useMutation(Document.setStorageItemProtectionMutationDocument)
  );
  const updateDirectoryPermissions = useMutationWrapper(
    useMutation(Document.updateDirectoryPermissionsMutationDocument)
  );

  return {
    copyStorageItems,
    createFolder,
    deleteFile,
    deleteStorageItems,
    generateUploadSignedUrl,
    moveStorageItems,
    renameFile,
    setStorageItemProtection,
    updateDirectoryPermissions,
  };
};

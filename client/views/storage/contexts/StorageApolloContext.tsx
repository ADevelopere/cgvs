"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import * as Document from "../core/storage.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";
import {
  useLazyQueryWrapper,
  useMutationWrapper,
} from "@/client/graphql/utils";

// Define the shape of our Apollo operations
type StorageApolloQueries = {
  checkFileUsage: (
    variables: Graphql.FileUsageQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.FileUsageQuery>>;
  fetchDirectoryChildren: (
    variables: Graphql.DirectoryChildrenQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.DirectoryChildrenQuery>>;
  getFileInfo: (
    variables: Graphql.FileInfoQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.FileInfoQuery>>;
  getFolderInfo: (
    variables: Graphql.FolderInfoQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.FolderInfoQuery>>;
  getStorageStats: (
    variables: Graphql.StorageStatsQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.StorageStatsQuery>>;
  listFiles: (
    variables: Graphql.ListFilesQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.ListFilesQuery>>;
  searchFiles: (
    variables: Graphql.SearchFilesQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.SearchFilesQuery>>;
};

type StorageApolloMutations = {
  copyStorageItems: (variables: {
    input: Graphql.StorageItemsCopyInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.CopyStorageItemsMutation>>;
  createFolder: (variables: {
    input: Graphql.FolderCreateInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.CreateFolderMutation>>;
  deleteFile: (variables: {
    path: string;
  }) => Promise<ApolloClient.MutateResult<Graphql.DeleteFileMutation>>;
  deleteStorageItems: (variables: {
    input: Graphql.StorageItemsDeleteInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.DeleteStorageItemsMutation>>;
  generateUploadSignedUrl: (variables: {
    input: Graphql.UploadSignedUrlGenerateInput;
  }) => Promise<
    ApolloClient.MutateResult<Graphql.GenerateUploadSignedUrlMutation>
  >;
  moveStorageItems: (variables: {
    input: Graphql.StorageItemsMoveInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.MoveStorageItemsMutation>>;
  renameFile: (variables: {
    input: Graphql.FileRenameInput;
  }) => Promise<ApolloClient.MutateResult<Graphql.RenameFileMutation>>;
  setStorageItemProtection: (variables: {
    input: Graphql.StorageItemProtectionUpdateInput;
  }) => Promise<
    ApolloClient.MutateResult<Graphql.SetStorageItemProtectionMutation>
  >;
  updateDirectoryPermissions: (variables: {
    input: Graphql.DirectoryPermissionsUpdateInput;
  }) => Promise<
    ApolloClient.MutateResult<Graphql.UpdateDirectoryPermissionsMutation>
  >;
};

type StorageApolloContextValue = StorageApolloQueries & StorageApolloMutations;

// Create the context
const StorageApolloContext = createContext<StorageApolloContextValue | null>(
  null
);

// Provider component
export const StorageApolloProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const checkFileUsage = useLazyQueryWrapper(
    useLazyQuery(Document.fileUsageQueryDocument)
  );

  const fetchDirectoryChildren = useLazyQueryWrapper(
    useLazyQuery(Document.directoryChildrenQueryDocument)
  );

  const getFileInfo = useLazyQueryWrapper(
    useLazyQuery(Document.fileInfoQueryDocument)
  );

  const getFolderInfo = useLazyQueryWrapper(
    useLazyQuery(Document.folderInfoQueryDocument)
  );

  const getStorageStats = useLazyQueryWrapper(
    useLazyQuery(Document.storageStatsQueryDocument)
  );

  const listFiles = useLazyQueryWrapper(
    useLazyQuery(Document.listFilesQueryDocument)
  );

  const searchFiles = useLazyQueryWrapper(
    useLazyQuery(Document.searchFilesQueryDocument)
  );

  const queries = useMemo(
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

  // Create mutation hooks - extract just the mutation function (first element)
  // The mutation function from useMutation is stable and doesn't recreate
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

  const mutations = useMemo(
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
    ]
  );

  const value = useMemo(
    () => ({ ...queries, ...mutations }),
    [queries, mutations]
  );

  return (
    <StorageApolloContext.Provider value={value}>
      {children}
    </StorageApolloContext.Provider>
  );
};

// Hook to use the context
export const useStorageApollo = (): StorageApolloContextValue => {
  const context = useContext(StorageApolloContext);
  if (!context) {
    throw new Error(
      "useStorageApollo must be used within a StorageApolloProvider"
    );
  }
  return context;
};

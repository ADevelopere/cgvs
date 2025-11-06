"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useLazyQuery } from "@apollo/client/react";
import * as Document from "../core/storage.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";
import { useLazyQueryWrapper } from "@/client/graphql/utils";

// Define the shape of our Apollo operations
type StorageApolloQueries = {
  checkFileUsage: (
    variables: Graphql.FileUsageQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.FileUsageQuery>>;
  fetchDirectoryChildren: (
    variables: Graphql.DirectoryChildrenQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.DirectoryChildrenQuery>>;
  getFileInfo: (variables: Graphql.FileInfoQueryVariables) => Promise<ApolloClient.QueryResult<Graphql.FileInfoQuery>>;
  getFolderInfo: (
    variables: Graphql.FolderInfoQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.FolderInfoQuery>>;
  getStorageStats: (
    variables: Graphql.StorageStatsQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.StorageStatsQuery>>;
  listFiles: (variables: Graphql.ListFilesQueryVariables) => Promise<ApolloClient.QueryResult<Graphql.ListFilesQuery>>;
  searchFiles: (
    variables: Graphql.SearchFilesQueryVariables
  ) => Promise<ApolloClient.QueryResult<Graphql.SearchFilesQuery>>;
};

type StorageApolloContextValue = StorageApolloQueries;

// Create the context
const StorageApolloContext = createContext<StorageApolloContextValue | null>(null);

// this context is needed to avoid fetch abort erros
export const StorageApolloProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const checkFileUsage = useLazyQueryWrapper(useLazyQuery(Document.fileUsageQueryDocument));

  const fetchDirectoryChildren = useLazyQueryWrapper(useLazyQuery(Document.directoryChildrenQueryDocument));

  const getFileInfo = useLazyQueryWrapper(useLazyQuery(Document.fileInfoQueryDocument));

  const getFolderInfo = useLazyQueryWrapper(useLazyQuery(Document.folderInfoQueryDocument));

  const getStorageStats = useLazyQueryWrapper(useLazyQuery(Document.storageStatsQueryDocument));

  const listFiles = useLazyQueryWrapper(useLazyQuery(Document.listFilesQueryDocument));

  const searchFiles = useLazyQueryWrapper(useLazyQuery(Document.searchFilesQueryDocument));

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
    [checkFileUsage, fetchDirectoryChildren, getFileInfo, getFolderInfo, getStorageStats, listFiles, searchFiles]
  );

  const value = useMemo(() => ({ ...queries }), [queries]);

  return <StorageApolloContext.Provider value={value}>{children}</StorageApolloContext.Provider>;
};

// Hook to use the context
export const useStorageApollo = (): StorageApolloContextValue => {
  const context = useContext(StorageApolloContext);
  if (!context) {
    throw new Error("useStorageApollo must be used within a StorageApolloProvider");
  }
  return context;
};

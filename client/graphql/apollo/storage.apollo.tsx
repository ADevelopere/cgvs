"use client";

import React, { createContext, useContext, useMemo } from "react";
import { ApolloClient, useMutation, useLazyQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useQueryWrapper, useMutationWrapper } from "@/client/graphql/utils";

type StorageGraphQLContextType = {
 // Queries
 checkFileUsage: (
  variables: Graphql.FileUsageQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.FileUsageQuery>>;
 fetchDirectoryChildren: (
  variables: Graphql.DirectoryChildrenQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.DirectoryChildrenQuery>>;
 getFileInfo: (
  variables: Graphql.FileInfoQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.FileInfoQuery>>;
 getFolderInfo: (
  variables: Graphql.FolderInfoQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.FolderInfoQuery>>;
 getStorageStats: (
  variables: Graphql.StorageStatsQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.StorageStatsQuery>>;
 listFiles: (
  variables: Graphql.ListFilesQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.ListFilesQuery>>;
 searchFiles: (
  variables: Graphql.SearchFilesQueryVariables,
 ) => Promise<ApolloClient.QueryResult<Graphql.SearchFilesQuery>>;

 // Mutations
 copyStorageItems: (
  variables: Graphql.CopyStorageItemsMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.CopyStorageItemsMutation>>;
 createFolder: (
  variables: Graphql.CreateFolderMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.CreateFolderMutation>>;
 deleteFile: (
  variables: Graphql.DeleteFileMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.DeleteFileMutation>>;
 deleteStorageItems: (
  variables: Graphql.DeleteStorageItemsMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.DeleteStorageItemsMutation>>;
 generateUploadSignedUrl: (
  variables: Graphql.GenerateUploadSignedUrlMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.GenerateUploadSignedUrlMutation>
 >;
 moveStorageItems: (
  variables: Graphql.MoveStorageItemsMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.MoveStorageItemsMutation>>;
 renameFile: (
  variables: Graphql.RenameFileMutationVariables,
 ) => Promise<ApolloClient.MutateResult<Graphql.RenameFileMutation>>;
 setStorageItemProtection: (
  variables: Graphql.SetStorageItemProtectionMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.SetStorageItemProtectionMutation>
 >;
 updateDirectoryPermissions: (
  variables: Graphql.UpdateDirectoryPermissionsMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.UpdateDirectoryPermissionsMutation>
 >;
};

const StorageGraphQLContext = createContext<
 StorageGraphQLContextType | undefined
>(undefined);

export const useStorageGraphQL = () => {
 const context = useContext(StorageGraphQLContext);
 if (!context) {
  throw new Error(
   "useStorageGraphQL must be used within a StorageGraphQLProvider",
  );
 }
 return context;
};

export const StorageGraphQLProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const checkFileUsage = useQueryWrapper(
  useLazyQuery(Document.fileUsageQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );

 const fetchDirectoryChildren = useQueryWrapper(
  useLazyQuery(Document.directoryChildrenQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );

 const getFileInfo = useQueryWrapper(
  useLazyQuery(Document.fileInfoQueryDocument, { fetchPolicy: "network-only" }),
 );

 const getFolderInfo = useQueryWrapper(
  useLazyQuery(Document.folderInfoQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );
 const getStorageStats = useQueryWrapper(
  useLazyQuery(Document.storageStatsQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );
 const listFiles = useQueryWrapper(
  useLazyQuery(Document.listFilesQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );
 const searchFiles = useQueryWrapper(
  useLazyQuery(Document.searchFilesQueryDocument, {
   fetchPolicy: "network-only",
  }),
 );

 const copyStorageItems = useMutationWrapper(
  useMutation(Document.copyStorageItemsMutationDocument),
 );
 const createFolder = useMutationWrapper(
  useMutation(Document.createFolderMutationDocument),
 );
 const deleteFile = useMutationWrapper(
  useMutation(Document.deleteFileMutationDocument),
 );
 const deleteStorageItems = useMutationWrapper(
  useMutation(Document.deleteStorageItemsMutationDocument),
 );
 const generateUploadSignedUrl = useMutationWrapper(
  useMutation(Document.generateUploadSignedUrlMutationDocument),
 );
 const moveStorageItems = useMutationWrapper(
  useMutation(Document.moveStorageItemsMutationDocument),
 );
 const renameFile = useMutationWrapper(
  useMutation(Document.renameFileMutationDocument),
 );
 const setStorageItemProtection = useMutationWrapper(
  useMutation(Document.setStorageItemProtectionMutationDocument),
 );
 const updateDirectoryPermissions = useMutationWrapper(
  useMutation(Document.updateDirectoryPermissionsMutationDocument),
 );

 const contextValue: StorageGraphQLContextType = useMemo(
  () => ({
   checkFileUsage,
   fetchDirectoryChildren,
   getFileInfo,
   getFolderInfo,
   getStorageStats,
   listFiles,
   searchFiles,
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
   checkFileUsage,
   fetchDirectoryChildren,
   getFileInfo,
   getFolderInfo,
   getStorageStats,
   listFiles,
   searchFiles,
   copyStorageItems,
   createFolder,
   deleteFile,
   deleteStorageItems,
   generateUploadSignedUrl,
   moveStorageItems,
   renameFile,
   setStorageItemProtection,
   updateDirectoryPermissions,
  ],
 );

 return (
  <StorageGraphQLContext.Provider value={contextValue}>
   {children}
  </StorageGraphQLContext.Provider>
 );
};

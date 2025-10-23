"use client";

import { useCallback, useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import * as Document from "../core/storage.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";

type StorageMutations = {
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

export const useStorageMutations = (): StorageMutations => {
  // Create mutation hooks - extract just the mutation function (first element)
  // The mutation function from useMutation is stable and doesn't recreate
  const [copyStorageItemsMutation] = useMutation(
    Document.copyStorageItemsMutationDocument
  );
  const [createFolderMutation] = useMutation(
    Document.createFolderMutationDocument
  );
  const [deleteFileMutation] = useMutation(Document.deleteFileMutationDocument);
  const [deleteStorageItemsMutation] = useMutation(
    Document.deleteStorageItemsMutationDocument
  );
  const [generateUploadSignedUrlMutation] = useMutation(
    Document.generateUploadSignedUrlMutationDocument
  );
  const [moveStorageItemsMutation] = useMutation(
    Document.moveStorageItemsMutationDocument
  );
  const [renameFileMutation] = useMutation(Document.renameFileMutationDocument);
  const [setStorageItemProtectionMutation] = useMutation(
    Document.setStorageItemProtectionMutationDocument
  );
  const [updateDirectoryPermissionsMutation] = useMutation(
    Document.updateDirectoryPermissionsMutationDocument
  );

  const copyStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsCopyInput }) => {
      return copyStorageItemsMutation({ variables });
    },
    [copyStorageItemsMutation]
  );

  const createFolder = useCallback(
    async (variables: { input: Graphql.FolderCreateInput }) => {
      return createFolderMutation({ variables });
    },
    [createFolderMutation]
  );

  const deleteFile = useCallback(
    async (variables: { path: string }) => {
      return deleteFileMutation({ variables });
    },
    [deleteFileMutation]
  );

  const deleteStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsDeleteInput }) => {
      return deleteStorageItemsMutation({ variables });
    },
    [deleteStorageItemsMutation]
  );

  const generateUploadSignedUrl = useCallback(
    async (variables: { input: Graphql.UploadSignedUrlGenerateInput }) => {
      return generateUploadSignedUrlMutation({ variables });
    },
    [generateUploadSignedUrlMutation]
  );

  const moveStorageItems = useCallback(
    async (variables: { input: Graphql.StorageItemsMoveInput }) => {
      return moveStorageItemsMutation({ variables });
    },
    [moveStorageItemsMutation]
  );

  const renameFile = useCallback(
    async (variables: { input: Graphql.FileRenameInput }) => {
      return renameFileMutation({ variables });
    },
    [renameFileMutation]
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
};

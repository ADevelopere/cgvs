"use client";

import { useMemo } from "react";
import { useMutation } from "@apollo/client/react";
import * as Document from "../core/storage.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloClient } from "@apollo/client";
import {
  useMutationWrapper,
} from "@/client/graphql/utils";

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
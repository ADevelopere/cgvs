"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { ApolloClient, ErrorLike, OperationVariables } from "@apollo/client";
import * as ApolloReact from "@apollo/client/react";
import logger from "@/utils/logger";

type StorageGraphQLContextType = {
    // Queries
    checkFileUsage: (
        variables: Graphql.CheckFileUsageQueryVariables,
    ) => Promise<Graphql.CheckFileUsageQuery>;
    fetchDirectoryChildren: (
        variables: Graphql.FetchDirectoryChildrenQueryVariables,
    ) => Promise<Graphql.FetchDirectoryChildrenQuery>;
    getFileInfo: (
        variables: Graphql.GetFileInfoQueryVariables,
    ) => Promise<Graphql.GetFileInfoQuery>;
    getFolderInfo: (
        variables: Graphql.GetFolderInfoQueryVariables,
    ) => Promise<Graphql.GetFolderInfoQuery>;
    getStorageStats: (
        variables: Graphql.GetStorageStatsQueryVariables,
    ) => Promise<Graphql.GetStorageStatsQuery>;
    listFiles: (
        variables: Graphql.ListFilesQueryVariables,
    ) => Promise<Graphql.ListFilesQuery>;
    searchFiles: (
        variables: Graphql.SearchFilesQueryVariables,
    ) => Promise<Graphql.SearchFilesQuery>;

    // Mutations
    copyStorageItems: (
        variables: Graphql.CopyStorageItemsMutationVariables,
    ) => Promise<Graphql.CopyStorageItemsMutation>;
    createFolder: (
        variables: Graphql.CreateFolderMutationVariables,
    ) => Promise<Graphql.CreateFolderMutation>;
    deleteFile: (
        variables: Graphql.DeleteFileMutationVariables,
    ) => Promise<Graphql.DeleteFileMutation>;
    deleteStorageItems: (
        variables: Graphql.DeleteStorageItemsMutationVariables,
    ) => Promise<Graphql.DeleteStorageItemsMutation>;
    generateUploadSignedUrl: (
        variables: Graphql.GenerateUploadSignedUrlMutationVariables,
    ) => Promise<Graphql.GenerateUploadSignedUrlMutation>;
    moveStorageItems: (
        variables: Graphql.MoveStorageItemsMutationVariables,
    ) => Promise<Graphql.MoveStorageItemsMutation>;
    renameFile: (
        variables: Graphql.RenameFileMutationVariables,
    ) => Promise<Graphql.RenameFileMutation>;
    setStorageItemProtection: (
        variables: Graphql.SetStorageItemProtectionMutationVariables,
    ) => Promise<Graphql.SetStorageItemProtectionMutation>;
    updateDirectoryPermissions: (
        variables: Graphql.UpdateDirectoryPermissionsMutationVariables,
    ) => Promise<Graphql.UpdateDirectoryPermissionsMutation>;
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

function useQueryWrapper<T, V extends OperationVariables>(
    useLazyQueryHook: (
        baseOptions?: ApolloReact.useLazyQuery.Options<T, V>,
    ) => ApolloReact.useLazyQuery.ResultTuple<T, V>,
) {
    const [execute] = useLazyQueryHook();
    return useCallback(
        async (variables: V) => {
            const result = await execute({ variables }).catch((err) => {
                logger.error("Error executing query:", err);
                throw err;
            });
            if (result.error) {
                logger.error("Error executing query:", result.error);
                throw result.error;
            }
            if (!result.data) {
                throw new Error("No data returned from query");
            }
            return result.data;
        },
        [execute],
    );
}

function useMutationWrapper<T, V extends OperationVariables>(
    useMutationHook: (
        baseOptions?: ApolloReact.useMutation.Options<T, V>,
    ) => ApolloReact.useMutation.ResultTuple<T, V>,
) {
    const [mutate] = useMutationHook();
    return useCallback(
        async (variables: V) => {
            const result: ApolloClient.MutateResult<T> = await mutate({
                variables,
            });
            const error: ErrorLike | undefined = result.error;
            if (error) {
                logger.error("Error executing mutation:", error);
                throw new Error(error.message);
            }
            if (!result.data) {
                throw new Error("No data returned from mutation");
            }
            return result.data;
        },
        [mutate],
    );
}

export const StorageGraphQLProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const checkFileUsage = useQueryWrapper(Graphql.useCheckFileUsageLazyQuery);
    const fetchDirectoryChildren = useQueryWrapper(
        Graphql.useFetchDirectoryChildrenLazyQuery,
    );
    const getFileInfo = useQueryWrapper(Graphql.useGetFileInfoLazyQuery);
    const getFolderInfo = useQueryWrapper(Graphql.useGetFolderInfoLazyQuery);
    const getStorageStats = useQueryWrapper(
        Graphql.useGetStorageStatsLazyQuery,
    );
    const listFiles = useQueryWrapper(Graphql.useListFilesLazyQuery);
    const searchFiles = useQueryWrapper(Graphql.useSearchFilesLazyQuery);

    const copyStorageItems = useMutationWrapper(
        Graphql.useCopyStorageItemsMutation,
    );
    const createFolder = useMutationWrapper(Graphql.useCreateFolderMutation);
    const deleteFile = useMutationWrapper(Graphql.useDeleteFileMutation);
    const deleteStorageItems = useMutationWrapper(
        Graphql.useDeleteStorageItemsMutation,
    );
    const generateUploadSignedUrl = useMutationWrapper(
        Graphql.useGenerateUploadSignedUrlMutation,
    );
    const moveStorageItems = useMutationWrapper(
        Graphql.useMoveStorageItemsMutation,
    );
    const renameFile = useMutationWrapper(Graphql.useRenameFileMutation);
    const setStorageItemProtection = useMutationWrapper(
        Graphql.useSetStorageItemProtectionMutation,
    );
    const updateDirectoryPermissions = useMutationWrapper(
        Graphql.useUpdateDirectoryPermissionsMutation,
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

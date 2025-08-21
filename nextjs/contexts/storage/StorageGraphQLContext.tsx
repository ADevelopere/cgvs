"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type StorageGraphQLContextType = {
    listFilesQuery: (
        variables: Graphql.ListFilesQueryVariables,
    ) => Promise<Graphql.ListFilesQuery>;
    getFileInfoQuery: (
        variables: Graphql.GetFileInfoQueryVariables,
    ) => Promise<Graphql.GetFileInfoQuery>;
    getFolderInfoQuery: (
        variables: Graphql.GetFolderInfoQueryVariables,
    ) => Promise<Graphql.GetFolderInfoQuery>;
    searchFilesQuery: (
        variables: Graphql.SearchFilesQueryVariables,
    ) => Promise<Graphql.SearchFilesQuery>;
    getStorageStatsQuery: (
        variables: Graphql.GetStorageStatsQueryVariables,
    ) => Promise<Graphql.GetStorageStatsQuery>;
    renameFileMutation: (
        variables: Graphql.RenameFileMutationVariables,
    ) => Promise<FetchResult<Graphql.RenameFileMutation>>;
    deleteFileMutation: (
        variables: Graphql.DeleteFileMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteFileMutation>>;
    generateUploadSignedUrlMutation: (
        variables: Graphql.GenerateUploadSignedUrlMutationVariables,
    ) => Promise<FetchResult<Graphql.GenerateUploadSignedUrlMutation>>;
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
    queryVariables?: Graphql.ListFilesQueryVariables;
}> = ({ children, queryVariables }) => {
    const listFilesQueryRef = Graphql.useListFilesQuery({
        skip: true,
    });
    const getFileInfoQueryRef = Graphql.useGetFileInfoQuery({
        skip: true,
    });
    const getFolderInfoQueryRef = Graphql.useGetFolderInfoQuery({
        skip: true,
    });
    const searchFilesQueryRef = Graphql.useSearchFilesQuery({
        skip: true,
    });
    const getStorageStatsQueryRef = Graphql.useGetStorageStatsQuery({
        skip: true,
    });

    const listFilesQuery = useCallback(
        async (variables: Graphql.ListFilesQueryVariables) => {
            const result = await listFilesQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from listFiles query");
            }
            return result.data;
        },
        [listFilesQueryRef],
    );

    const getFileInfoQuery = useCallback(
        async (variables: Graphql.GetFileInfoQueryVariables) => {
            const result = await getFileInfoQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from getFileInfo query");
            }
            return result.data;
        },
        [getFileInfoQueryRef],
    );

    const getFolderInfoQuery = useCallback(
        async (variables: Graphql.GetFolderInfoQueryVariables) => {
            const result = await getFolderInfoQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from getFolderInfo query");
            }
            return result.data;
        },
        [getFolderInfoQueryRef],
    );

    const searchFilesQuery = useCallback(
        async (variables: Graphql.SearchFilesQueryVariables) => {
            const result = await searchFilesQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from searchFiles query");
            }
            return result.data;
        },
        [searchFilesQueryRef],
    );

    const getStorageStatsQuery = useCallback(
        async (variables: Graphql.GetStorageStatsQueryVariables) => {
            const result = await getStorageStatsQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from getStorageStats query");
            }
            return result.data;
        },
        [getStorageStatsQueryRef],
    );

    const [mutateRenameFile] = Graphql.useRenameFileMutation();
    const [mutateDeleteFile] = Graphql.useDeleteFileMutation();
    const [mutateGenerateUploadSignedUrl] = Graphql.useGenerateUploadSignedUrlMutation();

    const renameFileMutation = useCallback(
        (variables: Graphql.RenameFileMutationVariables) => {
            return mutateRenameFile({ variables });
        },
        [mutateRenameFile],
    );

    const deleteFileMutation = useCallback(
        (variables: Graphql.DeleteFileMutationVariables) => {
            return mutateDeleteFile({ variables });
        },
        [mutateDeleteFile],
    );

    const generateUploadSignedUrlMutation = useCallback(
        (variables: Graphql.GenerateUploadSignedUrlMutationVariables) => {
            return mutateGenerateUploadSignedUrl({ variables });
        },
        [mutateGenerateUploadSignedUrl],
    );

    const contextValue: StorageGraphQLContextType = useMemo(
        () => ({
            listFilesQuery,
            getFileInfoQuery,
            getFolderInfoQuery,
            searchFilesQuery,
            getStorageStatsQuery,
            renameFileMutation,
            deleteFileMutation,
            generateUploadSignedUrlMutation,
        }),
        [
            listFilesQuery,
            getFileInfoQuery,
            getFolderInfoQuery,
            searchFilesQuery,
            getStorageStatsQuery,
            renameFileMutation,
            deleteFileMutation,
            generateUploadSignedUrlMutation,
        ],
    );

    return (
        <StorageGraphQLContext.Provider value={contextValue}>
            {children}
        </StorageGraphQLContext.Provider>
    );
};

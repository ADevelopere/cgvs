import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const directoryChildrenQueryDocument: TypedDocumentNode<
    Graphql.DirectoryChildrenQuery,
    Graphql.DirectoryChildrenQueryVariables
> = gql`
    query directoryChildren($path: String) {
        directoryChildren(path: $path) {
            createdAt
            fileCount
            folderCount
            isFromBucket
            isProtected
            lastModified
            name
            path
            permissions {
                allowCreateSubDirs
                allowDelete
                allowDeleteFiles
                allowMove
                allowMoveFiles
                allowUploads
            }
            protectChildren
            totalSize
        }
    }
`;

export const fileInfoQueryDocument: TypedDocumentNode<
    Graphql.FileInfoQuery,
    Graphql.FileInfoQueryVariables
> = gql`
    query fileInfo($path: String!) {
        fileInfo(path: $path) {
            contentType
            createdAt
            directoryPath
            fileType
            isFromBucket
            isInUse
            isProtected
            isPublic
            lastModified
            md5Hash
            mediaLink
            name
            path
            size
            url
            usages {
                createdAt
                filePath
                id
                referenceId
                referenceTable
                usageType
            }
        }
    }
`;

export const fileUsageQueryDocument: TypedDocumentNode<
    Graphql.FileUsageQuery,
    Graphql.FileUsageQueryVariables
> = gql`
    query fileUsage($input: FileUsageCheckInput!) {
        fileUsage(input: $input) {
            canDelete
            deleteBlockReason
            isInUse
            usages {
                createdAt
                filePath
                id
                referenceId
                referenceTable
                usageType
            }
        }
    }
`;

export const folderInfoQueryDocument: TypedDocumentNode<
    Graphql.FolderInfoQuery,
    Graphql.FolderInfoQueryVariables
> = gql`
    query folderInfo($path: String!) {
        folderInfo(path: $path) {
            createdAt
            fileCount
            folderCount
            isFromBucket
            isProtected
            lastModified
            name
            path
            permissions {
                allowCreateSubDirs
                allowDelete
                allowDeleteFiles
                allowMove
                allowMoveFiles
                allowUploads
            }
            protectChildren
            totalSize
        }
    }
`;

export const listFilesQueryDocument: TypedDocumentNode<
    Graphql.ListFilesQuery,
    Graphql.ListFilesQueryVariables
> = gql`
    query listFiles($input: FilesListInput!) {
        listFiles(input: $input) {
            hasMore
            items {
                name
                path
                isProtected
                ... on DirectoryInfo {
                    createdAt
                    fileCount
                    folderCount
                    isFromBucket
                    isProtected
                    lastModified
                    name
                    path
                    permissions {
                        allowCreateSubDirs
                        allowDelete
                        allowDeleteFiles
                        allowMove
                        allowMoveFiles
                        allowUploads
                    }
                    protectChildren
                    totalSize
                }
                ... on FileInfo {
                    contentType
                    createdAt
                    directoryPath
                    fileType
                    isFromBucket
                    isInUse
                    isProtected
                    isPublic
                    lastModified
                    md5Hash
                    mediaLink
                    name
                    path
                    size
                    url
                    usages {
                        createdAt
                        filePath
                        id
                        referenceId
                        referenceTable
                        usageType
                    }
                }
            }
            limit
            offset
            totalCount
        }
    }
`;

export const searchFilesQueryDocument: TypedDocumentNode<
    Graphql.SearchFilesQuery,
    Graphql.SearchFilesQueryVariables
> = gql`
    query searchFiles(
        $fileType: String
        $folder: String
        $limit: Int!
        $searchTerm: String!
    ) {
        searchFiles(
            fileType: $fileType
            folder: $folder
            limit: $limit
            searchTerm: $searchTerm
        ) {
            hasMore
            items {
                isProtected
                name
                path
            }
            limit
            offset
            totalCount
        }
    }
`;

export const storageStatsQueryDocument: TypedDocumentNode<
    Graphql.StorageStatsQuery,
    Graphql.StorageStatsQueryVariables
> = gql`
    query storageStats($path: String) {
        storageStats(path: $path) {
            fileTypeBreakdown {
                count
                type
            }
            totalFiles
            directoryCount
            totalSize
        }
    }
`;

export const copyStorageItemsMutationDocument: TypedDocumentNode<
    Graphql.CopyStorageItemsMutation,
    Graphql.CopyStorageItemsMutationVariables
> = gql`
    mutation copyStorageItems($input: StorageItemsCopyInput!) {
        copyStorageItems(input: $input) {
            message
            success
            failureCount
            failures {
                error
                path
            }
            successCount
            successfulItems {
                isProtected
                name
                path
            }
        }
    }
`;

export const createFolderMutationDocument: TypedDocumentNode<
    Graphql.CreateFolderMutation,
    Graphql.CreateFolderMutationVariables
> = gql`
    mutation createFolder($input: FolderCreateInput!) {
        createFolder(input: $input) {
            data {
                isProtected
                name
                path
            }
            message
            success
        }
    }
`;

export const deleteFileMutationDocument: TypedDocumentNode<
    Graphql.DeleteFileMutation,
    Graphql.DeleteFileMutationVariables
> = gql`
    mutation deleteFile($path: String!) {
        deleteFile(path: $path) {
            data {
                isProtected
                name
                path
            }
            message
            success
        }
    }
`;

export const deleteStorageItemsMutationDocument: TypedDocumentNode<
    Graphql.DeleteStorageItemsMutation,
    Graphql.DeleteStorageItemsMutationVariables
> = gql`
    mutation deleteStorageItems($input: StorageItemsDeleteInput!) {
        deleteStorageItems(input: $input) {
            message
            success
            failureCount
            failures {
                error
                path
            }
            successCount
            successfulItems {
                isProtected
                name
                path
            }
        }
    }
`;

export const generateUploadSignedUrlMutationDocument: TypedDocumentNode<
    Graphql.GenerateUploadSignedUrlMutation,
    Graphql.GenerateUploadSignedUrlMutationVariables
> = gql`
    mutation generateUploadSignedUrl($input: UploadSignedUrlGenerateInput!) {
        generateUploadSignedUrl(input: $input)
    }
`;

export const moveStorageItemsMutationDocument: TypedDocumentNode<
    Graphql.MoveStorageItemsMutation,
    Graphql.MoveStorageItemsMutationVariables
> = gql`
    mutation moveStorageItems($input: StorageItemsMoveInput!) {
        moveStorageItems(input: $input) {
            message
            success
            failureCount
            failures {
                error
                path
            }
            successCount
            successfulItems {
                isProtected
                name
                path
            }
        }
    }
`;

export const renameFileMutationDocument: TypedDocumentNode<
    Graphql.RenameFileMutation,
    Graphql.RenameFileMutationVariables
> = gql`
    mutation renameFile($input: FileRenameInput!) {
        renameFile(input: $input) {
            data {
                isProtected
                name
                path
            }
            message
            success
        }
    }
`;

export const setStorageItemProtectionMutationDocument: TypedDocumentNode<
    Graphql.SetStorageItemProtectionMutation,
    Graphql.SetStorageItemProtectionMutationVariables
> = gql`
    mutation setStorageItemProtection(
        $input: StorageItemProtectionUpdateInput!
    ) {
        setStorageItemProtection(input: $input) {
            data {
                isProtected
                name
                path
            }
            message
            success
        }
    }
`;

export const updateDirectoryPermissionsMutationDocument: TypedDocumentNode<
    Graphql.UpdateDirectoryPermissionsMutation,
    Graphql.UpdateDirectoryPermissionsMutationVariables
> = gql`
    mutation updateDirectoryPermissions(
        $input: DirectoryPermissionsUpdateInput!
    ) {
        updateDirectoryPermissions(input: $input) {
            data {
                isProtected
                name
                path
            }
            message
            success
        }
    }
`;

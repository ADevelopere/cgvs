import { gql } from '@apollo/client';

export const SEARCH_FILES = gql`
query searchFiles($fileType: String, $folder: String, $limit: Int!, $searchTerm: String!){
    searchFiles(fileType: $fileType, folder: $folder, limit: $limit, searchTerm: $searchTerm){
        hasMore
        items {
            name
            path
            ... on FileInfo {
                contentType
                created
                fileType
                isPublic
                lastModified
                md5Hash
                mediaLink
                name
                path
                size
                url
            }
            ... on FolderInfo {
                created
                fileCount
                folderCount
                lastModified
                name
                path
                totalSize
            }
        }
        limit
        offset
        totalCount
    }
}
`;

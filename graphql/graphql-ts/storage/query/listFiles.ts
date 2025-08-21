import { gql } from '@apollo/client';

export const LIST_FILES = gql`
query listFiles($input: ListFilesInput!){
    listFiles(input: $input){
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

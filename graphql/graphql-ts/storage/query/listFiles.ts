import { gql } from '@apollo/client';

export const LIST_FILES = gql`
    query listFiles($input: ListFilesInput!){
        listFiles(input: $input){
            hasMore
            items {
                name
                path
                isProtected
                ... on DirectoryInfo {
                    created
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
                    created
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
                        created
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

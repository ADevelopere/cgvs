import { gql } from '@apollo/client';

export const GET_FILE_INFO = gql`
query getFileInfo($path: String!){
    getFileInfo(path: $path){
        contentType
        created
        createdBy
        directoryPath
        fileType
        isFromBucket
        isInUse
        isProtected
        isPublic
        lastModified
        md5Hash
        mediaLink
        path
        size
        url
        usages{
            created
            filePath
            id
            referenceId
            referenceTable
            usageType
        }
    }
}
`;

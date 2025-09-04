import { gql } from '@apollo/client';

export const FILE_INFO = gql`
query fileInfo($path: String!){
    fileInfo(path: $path){
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
        name
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

import { gql } from '@apollo/client';

export const GET_FILE_INFO = gql`
query getFileInfo($path: String!){
    getFileInfo(path: $path){
        contentType
        created
        createdBy
        directoryPath
        id
        isFromBucket
        isProtected
        lastModified
        md5Hash
        name
        path
        size
    }
}
`;

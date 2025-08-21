import { gql } from '@apollo/client';

export const GET_FILE_INFO = gql`
query getFileInfo($path: String!){
    getFileInfo(path: $path){
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
}
`;

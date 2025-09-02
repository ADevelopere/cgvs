import { gql } from '@apollo/client';

export const DELETE_FILE = gql`
mutation deleteFile($path: String!){
    deleteFile(path: $path){
        item{
            id
            name
            path
        }
        message
        success
    }
}
`;

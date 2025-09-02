import { gql } from '@apollo/client';

export const CREATE_FOLDER = gql`
mutation createFolder($input: CreateFolderInput!){
    createFolder(input: $input){
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

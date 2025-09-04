import { gql } from '@apollo/client';

export const RENAME_FILE = gql`
mutation renameFile($input: RenameFileInput!){
    renameFile(input: $input){
        item{
            isProtected
            name
            path
        }
        message
        success
    }
}
`;

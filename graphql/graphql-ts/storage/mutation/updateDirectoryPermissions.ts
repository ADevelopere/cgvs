import { gql } from '@apollo/client';

export const UPDATE_DIRECTORY_PERMISSIONS = gql`
mutation updateDirectoryPermissions($input: UpdateDirectoryPermissionsInput!){
    updateDirectoryPermissions(input: $input){
        item{
            isProtected
            path
        }
        message
        success
    }
}
`;

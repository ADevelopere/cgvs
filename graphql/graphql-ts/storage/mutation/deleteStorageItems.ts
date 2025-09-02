import { gql } from '@apollo/client';

export const DELETE_STORAGE_ITEMS = gql`
mutation deleteStorageItems($input: DeleteItemsInput!){
    deleteStorageItems(input: $input){
        errors
        failureCount
        successCount
        successfulItems{
            id
            name
            path
        }
    }
}
`;

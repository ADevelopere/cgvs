import { gql } from '@apollo/client';

export const MOVE_STORAGE_ITEMS = gql`
mutation moveStorageItems($input: MoveStorageItemsInput!){
    moveStorageItems(input: $input){
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

import { gql } from '@apollo/client';

export const COPY_STORAGE_ITEMS = gql`
mutation copyStorageItems($input: CopyStorageItemsInput!){
    copyStorageItems(input: $input){
        errors
        failureCount
        successCount
        successfulItems{
            isProtected
            path
        }
    }
}
`;

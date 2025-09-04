import { gql } from '@apollo/client';

export const SET_STORAGE_ITEM_PROTECTION = gql`
mutation setStorageItemProtection($input: SetStorageItemProtectionInput!){
    setStorageItemProtection(input: $input){
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

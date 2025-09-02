import { gql } from '@apollo/client';

export const UNREGISTER_FILE_USAGE = gql`
mutation unregisterFileUsage($input: UnregisterFileUsageInput!){
    unregisterFileUsage(input: $input){
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

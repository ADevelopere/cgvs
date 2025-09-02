import { gql } from '@apollo/client';

export const REGISTER_FILE_USAGE = gql`
mutation registerFileUsage($input: RegisterFileUsageInput!){
    registerFileUsage(input: $input){
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

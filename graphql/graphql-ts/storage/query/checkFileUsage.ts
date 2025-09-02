import { gql } from '@apollo/client';

export const CHECK_FILE_USAGE = gql`
query checkFileUsage($input: CheckFileUsageInput!){
    checkFileUsage(input: $input){
        canDelete
        deleteBlockReason
        isInUse
        usages{
            created
            referenceId
            referenceTable
            usageType
        }
    }
}
`;

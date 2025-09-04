import { gql } from '@apollo/client';

export const FILE_USAGE = gql`
query fileUsage($input: CheckFileUsageInput!){
    fileUsage(input: $input){
        canDelete
        deleteBlockReason
        isInUse
        usages{
            created
            filePath
            id
            referenceId
            referenceTable
            usageType
        }
    }
}
`;

import { gql } from '@apollo/client';

export const LIST_FILES = gql`
query listFiles($input: ListFilesInput!){
    listFiles(input: $input){
        hasMore
        items{
            name
            path
        }
        limit
        offset
        totalCount
    }
}
`;

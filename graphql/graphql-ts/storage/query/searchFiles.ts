import { gql } from '@apollo/client';

export const SEARCH_FILES = gql`
query searchFiles($fileType: String, $folder: String, $limit: Int!, $searchTerm: String!){
    searchFiles(fileType: $fileType, folder: $folder, limit: $limit, searchTerm: $searchTerm){
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

import { gql } from '@apollo/client';

export const TEMPLATES = gql`
query templates($first: Int!, $page: Int){
    templates(first: $first, page: $page){
        data{
            id
            name
            description
            image_url
            category{
                id
            }
            order
            created_at
            trashed_at
            updated_at
        }
        paginatorInfo{
            count
            currentPage
            firstItem
            hasMorePages
            lastItem
            lastPage
            perPage
            total
        }
    }
}
`;

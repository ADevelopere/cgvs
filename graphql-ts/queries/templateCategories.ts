import { gql } from '@apollo/client';

export const TEMPLATE_CATEGORIES = gql`
query templateCategories($first: Int!, $page: Int){
    templateCategories(first: $first, page: $page){
        data{
            id
            name
            description
            special_type
            parentCategory{
                id
            }
            order
            created_at
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

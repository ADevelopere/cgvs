import { gql } from '@apollo/client';

export const PAGINATED_TEMPLATES = gql`
query templates($first: Int, $page: Int, $skip: Int){
    templates(first: $first, page: $page, skip: $skip){
        data{
            id
            name
            description
            imageUrl
            category{
                id
                name
            }
            order
            preSuspensionCategory{
                id
                name
            }
            createdAt
            updatedAt
        }
        paginationInfo{
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

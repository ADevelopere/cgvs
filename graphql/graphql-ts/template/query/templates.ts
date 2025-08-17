import { gql } from '@apollo/client';

export const PAGINATED_TEMPLATES = gql`
query templates($paginationArgs: PaginationArgsInput){
    templates(paginationArgs: $paginationArgs){
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

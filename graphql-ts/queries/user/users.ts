import { gql } from '@apollo/client';

export const USERS = gql`
query users($first: Int!, $name: String, $page: Int){
    users(first: $first, name: $name, page: $page){
        data{
            created_at
            email
            email_verified_at
            id
            isAdmin
            name
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

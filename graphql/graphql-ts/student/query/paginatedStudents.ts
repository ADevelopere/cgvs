import { gql } from '@apollo/client';

export const PAGINATED_STUDENTS = gql`
    query paginatedStudents($first: Int, $page: Int, $skip: Int){
        paginatedStudents(first: $first, page: $page, skip: $skip){
            data{
                id
                name
                email
                gender
                nationality
                dateOfBirth
                phoneNumber
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

import { gql } from "@apollo/client";

export const STUDENTS = gql`
    query students(
        $orderBy: [OrderStudentsByClauseInput!]
        $paginationArgs: PaginationArgsInput
        $filterArgs: StudentFilterArgsInput
    ) {
        students(
            orderBy: $orderBy
            paginationArgs: $paginationArgs
            filterArgs: $filterArgs
        ) {
            data {
                id
                name
                gender
                nationality
                dateOfBirth
                email
                phoneNumber
                createdAt
                updatedAt
            }
            paginationInfo {
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

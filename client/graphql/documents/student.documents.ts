import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const studentQueryDocument: TypedDocumentNode<
    Graphql.StudentQuery,
    Graphql.StudentQueryVariables
> = gql`
    query student($id: Int!) {
        student(id: $id) {
            id
            name
            gender
            nationality
            dateOfBirth
            phoneNumber
            email
            createdAt
            updatedAt
        }
    }
`;

export const studentsQueryDocument: TypedDocumentNode<
    Graphql.StudentsQuery,
    Graphql.StudentsQueryVariables
> = gql`
    query students(
        $orderBy: [StudentsOrderByClause!]
        $paginationArgs: PaginationArgs
        $filterArgs: StudentFilterArgs
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
                phoneNumber
                email
                createdAt
                updatedAt
            }
            pageInfo {
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

export const createStudentMutationDocument: TypedDocumentNode<
    Graphql.CreateStudentMutation,
    Graphql.CreateStudentMutationVariables
> = gql`
    mutation createStudent($input: StudentCreateInput!) {
        createStudent(input: $input) {
            id
            name
            gender
            nationality
            dateOfBirth
            phoneNumber
            email
            createdAt
            updatedAt
        }
    }
`;

export const deleteStudentMutationDocument: TypedDocumentNode<
    Graphql.DeleteStudentMutation,
    Graphql.DeleteStudentMutationVariables
> = gql`
    mutation deleteStudent($id: Int!) {
        deleteStudent(id: $id) {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

export const partiallyUpdateStudentMutationDocument: TypedDocumentNode<
    Graphql.PartiallyUpdateStudentMutation,
    Graphql.PartiallyUpdateStudentMutationVariables
> = gql`
    mutation partiallyUpdateStudent($input: PartialStudentUpdateInput!) {
        partiallyUpdateStudent(input: $input) {
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
    }
`;

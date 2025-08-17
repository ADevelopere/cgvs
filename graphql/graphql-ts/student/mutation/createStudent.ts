import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
mutation createStudent($input: CreateStudentInput!){
    createStudent(input: $input){
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

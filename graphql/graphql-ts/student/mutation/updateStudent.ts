import { gql } from '@apollo/client';

export const UPDATE_STUDENT = gql`
    mutation updateStudent($input: UpdateStudentInput!){
        updateStudent(input: $input){
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

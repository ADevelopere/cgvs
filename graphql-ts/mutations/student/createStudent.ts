import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
mutation createStudent($input: CreateStudentInput!){
    createStudent(input: $input){
        id
        name
        gender
        nationality
        date_of_birth
        email
        phone_number
        created_at
        updated_at
    }
}
`;

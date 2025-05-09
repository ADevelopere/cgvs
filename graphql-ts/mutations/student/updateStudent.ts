import { gql } from '@apollo/client';

export const UPDATE_STUDENT = gql`
mutation updateStudent($input: UpdateStudentInput!){
    updateStudent(input: $input){
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

import { gql } from '@apollo/client';

export const PARTIAL_UPDATE_STUDENT = gql`
mutation partialUpdateStudent($input: PartialUpdateStudentInput!){
    partialUpdateStudent(input: $input){
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

import { gql } from '@apollo/client';

export const PARTIAL_UPDATE_STUDENT = gql`
mutation partialUpdateStudent($input: PartialUpdateStudentInput!){
    partialUpdateStudent(input: $input){
        createdAt
        dateOfBirth
        email
        gender
        id
        name
        nationality
        phoneNumber
        updatedAt
    }
}
`;

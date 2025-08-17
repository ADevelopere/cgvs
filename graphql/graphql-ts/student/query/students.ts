import { gql } from '@apollo/client';

export const STUDENTS = gql`
query students{
    students{
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

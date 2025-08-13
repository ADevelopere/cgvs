import { gql } from '@apollo/client';

export const REGISTER = gql`
mutation register($input: RegisterInput!){
    register(input: $input){
        token
        user{
            createdAt
            email
            emailVerifiedAt
            id
            isAdmin
            name
            password
            rememberToken
            updatedAt
        }
    }
}
`;

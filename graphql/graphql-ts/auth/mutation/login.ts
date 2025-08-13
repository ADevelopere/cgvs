import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($input: LoginInput!){
    login(input: $input){
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

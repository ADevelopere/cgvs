import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
        user{
            created_at
            email
            email_verified_at
            id
            isAdmin
            name
            updated_at
        }
    }
}
`;

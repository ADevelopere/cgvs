import { gql } from '@apollo/client';

export const REFRESH_TOKEN = gql`
mutation refreshToken{
    refreshToken{
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

import { gql } from '@apollo/client';

export const USERS = gql`
query users{
    users{
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
`;

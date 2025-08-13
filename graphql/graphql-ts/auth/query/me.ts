import { gql } from '@apollo/client';

export const ME = gql`
query me{
    me{
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

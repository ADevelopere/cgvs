import { gql } from '@apollo/client';

export const ME = gql`
query me{
    me{
        created_at
        email
        email_verified_at
        id
        isAdmin
        name
        updated_at
    }
}
`;

import { gql } from '@apollo/client';

export const USER = gql`
query user($email: String, $id: ID){
    user(email: $email, id: $id){
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

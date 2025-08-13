import { gql } from '@apollo/client';

export const USER = gql`
query user($id: Int!){
    user(id: $id){
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

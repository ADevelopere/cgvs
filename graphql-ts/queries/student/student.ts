import { gql } from '@apollo/client';

export const STUDENT = gql`
query student($id: ID!){
    student(id: $id){
        id
        name
        gender
        nationality
        date_of_birth
        email
        phone_number
        certificates{
            id
            release_date
            verification_code
            template {
                id
                name
            }
            recipientGroup{
                id
                name
            }
        }
        created_at
        updated_at
    }
}
`;

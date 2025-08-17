import { gql } from '@apollo/client';

export const STUDENT = gql`
query student($id: Int!){
    student(id: $id){
        id
        name
        gender
        nationality
        dateOfBirth
        email
        phoneNumber
        createdAt
        updatedAt
    }
}
`;

// certificates{
//     id
//     release_date
//     verification_code
//     template {
//         id
//         name
//     }
//     recipientGroup{
//         id
//         name
//     }
// }

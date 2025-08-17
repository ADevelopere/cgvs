import { gql } from '@apollo/client';

export const DELETE_STUDENT = gql`
mutation deleteStudent($id: Int!){
    deleteStudent(id: $id){
        id
        name
        createdAt
        updatedAt
    }
}
`;

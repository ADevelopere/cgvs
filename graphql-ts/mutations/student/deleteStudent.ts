import { gql } from '@apollo/client';

export const DELETE_STUDENT = gql`
mutation deleteStudent($id: ID!){
    deleteStudent(id: $id){
        id
        name
        created_at
        updated_at
    }
}
`;

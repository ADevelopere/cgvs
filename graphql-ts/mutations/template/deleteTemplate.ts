import { gql } from '@apollo/client';

export const DELETE_TEMPLATE = gql`
mutation deleteTemplate($id: ID!){
    deleteTemplate(id: $id){
        id
        name
        category{
            id
        }
        deleted_at
    }
}
`;

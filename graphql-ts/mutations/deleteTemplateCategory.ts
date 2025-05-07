import { gql } from '@apollo/client';

export const DELETE_TEMPLATE_CATEGORY = gql`
mutation deleteTemplateCategory($id: ID!){
    deleteTemplateCategory(id: $id){
        id
        name
        parentCategory{
            id
        }
        deleted_at
    }
}
`;

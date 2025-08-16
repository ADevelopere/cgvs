import { gql } from '@apollo/client';

export const DELETE_TEMPLATE_CATEGORY = gql`
mutation deleteTemplateCategory($id: Int!){
    deleteTemplateCategory(id: $id){
        id
        name
        parentCategory{
            id
        }
    }
}
`;

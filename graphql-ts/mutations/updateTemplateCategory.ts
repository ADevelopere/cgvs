import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE_CATEGORY = gql`
mutation updateTemplateCategory($id: ID!, $input: UpdateTemplateCategoryInput!){
    updateTemplateCategory(id: $id, input: $input){
        id
        name
        description
        order
        parentCategory{
            id
        }
        special_type
        created_at
        updated_at
        deleted_at
    }
}
`;

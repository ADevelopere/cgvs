import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE_CATEGORY = gql`
mutation updateTemplateCategory($input: UpdateTemplateCategoryInput!){
    updateTemplateCategory(input: $input){
        id
        name
        description
        categorySpecialType
        parentCategory{
            id
        }
        order
        createdAt
        updatedAt
    }
}
`;

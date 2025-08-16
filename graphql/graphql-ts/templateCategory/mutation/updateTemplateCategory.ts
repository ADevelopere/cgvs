import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE_CATEGORY = gql`
mutation updateTemplateCategory($input: UpdateTemplateCategoryInput!){
    updateTemplateCategory(input: $input){
        id
        name
        description
        order
        parentCategory{
            id
        }
        categorySpecialType
        createdAt
        updatedAt
    }
}
`;

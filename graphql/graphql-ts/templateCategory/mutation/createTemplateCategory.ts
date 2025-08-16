import { gql } from '@apollo/client';

export const CREATE_TEMPLATE_CATEGORY = gql`
mutation createTemplateCategory($input: CreateTemplateCategoryInput!){
    createTemplateCategory(input: $input){
        id
        name
        description
        categorySpecialType
        parentCategory{
            id
        }
        order
        createdAt
    }
}
`;

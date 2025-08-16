import { gql } from '@apollo/client';

export const MAIN_TEMPLATE_CATEGORY = gql`
query mainTemplateCategory{
    mainTemplateCategory{
        id
        name
        description
        categorySpecialType
        parentCategory{
            id
            name
        }
        order
        childCategories{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

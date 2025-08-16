import { gql } from '@apollo/client';

export const SUSPENSION_TEMPLATE_CATEGORY = gql`
query suspensionTemplateCategory{
    suspensionTemplateCategory{
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

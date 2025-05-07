import { gql } from '@apollo/client';

export const REORDER_TEMPLATE_CATEGORIES = gql`
mutation reorderTemplateCategories($input: [ReorderCategoriesInput!]!){
    reorderTemplateCategories(input: $input){
        id
        name
        special_type
        parentCategory{
            id
        }
        order
        updated_at
    }
}
`;

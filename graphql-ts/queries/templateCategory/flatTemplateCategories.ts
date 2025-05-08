import { gql } from '@apollo/client';

export const FLAT_TEMPLATE_CATEGORIES = gql`
query flatTemplateCategories{
    flatTemplateCategories{
        id
        name
        description
        special_type
        parentCategory{
            id
        }
        order
        templates{
            id
            name
            description
            image_url
            order
            trashed_at
            created_at
            updated_at
        }
        created_at
        updated_at
    }
}
`;

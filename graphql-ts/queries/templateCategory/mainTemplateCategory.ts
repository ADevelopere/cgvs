import { gql } from '@apollo/client';

export const MAIN_TEMPLATE_CATEGORY = gql`
query mainTemplateCategory{
    mainTemplateCategory{
        id
        name
        description
        special_type
        templates{
            id
            name
            image_url
            description
            order
            created_at
            updated_at
        }
        created_at
        updated_at
    }
}
`;

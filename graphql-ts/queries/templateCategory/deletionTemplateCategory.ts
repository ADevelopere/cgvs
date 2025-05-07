import { gql } from '@apollo/client';

export const DELETION_TEMPLATE_CATEGORY = gql`
query deletionTemplateCategory{
    deletionTemplateCategory{
        id
        name
        description
        special_type
        templates{
            id
            name
            description
            background_url
            order
            created_at
            trashed_at
            updated_at
        }
        created_at
        updated_at
    }
}
`;

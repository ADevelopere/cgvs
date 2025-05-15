import { gql } from '@apollo/client';

export const TEMPLATE = gql`
query template($id: ID!){
    template(id: $id){
        id
        name
        description
        image_url
        category{
            id
        }
        variables {
            type
            id
            name
            description
            preview_value
            required
            order

            # Using inline fragments to get type-specific fields
            ... on TemplateTextVariable {
                min_length
                max_length
                pattern
            }

            ... on TemplateNumberVariable {
                min_value
                max_value
                decimal_places
            }

            ... on TemplateDateVariable {
                min_date
                max_date
                format
            }

            ... on TemplateSelectVariable {
                options
                multiple
            }
        }
        order
        created_at
        updated_at
        trashed_at
    }
}
`;

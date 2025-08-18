import { gql } from '@apollo/client';

export const TEMPLATE = gql`
query template($id: Int!){
    template(id: $id){
        id
        name
        description
        imageUrl
        category{
            id
            name
        }
        order
        preSuspensionCategory{
            id
            name
        }
        variables {
            type
            id
            name
            description
            required
            order

            # Using inline fragments to get type-specific fields
            ... on TextTemplateVariable {
                minLength
                maxLength
                pattern
                textPreviewValue
            }

            ... on NumberTemplateVariable {
                minValue
                maxValue
                decimalPlaces
                numberPreviewValue
            }

            ... on DateTemplateVariable {
                minDate
                maxDate
                format
                datePreviewValue
            }

            ... on SelectTemplateVariable {
                options
                multiple
                selectPreviewValue
            }
        }
        createdAt
        updatedAt
    }
}
`;

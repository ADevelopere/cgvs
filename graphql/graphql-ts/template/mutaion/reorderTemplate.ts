import { gql } from '@apollo/client';

export const REORDER_TEMPLATE = gql`
mutation reorderTemplate($input: ReorderTemplateInput!){
    reorderTemplate(input: $input){
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
        createdAt
        updatedAt
    }
}
`;

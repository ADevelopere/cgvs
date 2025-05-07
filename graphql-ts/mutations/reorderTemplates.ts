import { gql } from '@apollo/client';

export const REORDER_TEMPLATES = gql`
mutation reorderTemplates($input: [ReorderTemplateInput!]!){
    reorderTemplates(input: $input){
        id
        name
        category{
            id
        }
        order
        updated_at
    }
}
`;

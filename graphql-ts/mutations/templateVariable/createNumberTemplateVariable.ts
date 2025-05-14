import { gql } from '@apollo/client';

export const CREATE_NUMBER_TEMPLATE_VARIABLE = gql`
mutation createNumberTemplateVariable($input: NumberTemplateVariableInput!){
    createNumberTemplateVariable(input: $input){
        id
        name
        description
        order
        decimal_places
        min_value
        max_value
        preview_value
        required
        template{
            id
            name
        }
        created_at
        updated_at
    }
}
`;

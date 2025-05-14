import { gql } from '@apollo/client';

export const UPDATE_NUMBER_TEMPLATE_VARIABLE = gql`
mutation updateNumberTemplateVariable($input: UpdateNumberTemplateVariableInput!){
    updateNumberTemplateVariable(input: $input){
        decimal_places
        id
        name
        description
        order
        max_value
        min_value
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

import { gql } from '@apollo/client';

export const UPDATE_TEXT_TEMPLATE_VARIABLE = gql`
mutation updateTextTemplateVariable($input: TextTemplateVariableInput!){
    updateTextTemplateVariable(input: $input){
        id
        name
        description
        order
        pattern
        min_length
        max_length
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

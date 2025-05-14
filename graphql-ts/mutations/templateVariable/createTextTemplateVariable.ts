import { gql } from '@apollo/client';

export const CREATE_TEXT_TEMPLATE_VARIABLE = gql`
mutation createTextTemplateVariable($input: TextTemplateVariableInput!){
    createTextTemplateVariable(input: $input){
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

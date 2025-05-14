import { gql } from '@apollo/client';

export const UPDATE_SELECT_TEMPLATE_VARIABLE = gql`
mutation updateSelectTemplateVariable($input: UpdateSelectTemplateVariableInput!){
    updateSelectTemplateVariable(input: $input){
        id
        name
        description
        order
        options
        multiple
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

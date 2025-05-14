import { gql } from '@apollo/client';

export const CREATE_SELECT_TEMPLATE_VARIABLE = gql`
mutation createSelectTemplateVariable($input: CreateSelectTemplateVariableInput!){
    createSelectTemplateVariable(input: $input){
        id
        name
        description
        multiple
        options
        order
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

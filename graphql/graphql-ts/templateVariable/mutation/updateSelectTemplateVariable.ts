import { gql } from '@apollo/client';

export const UPDATE_SELECT_TEMPLATE_VARIABLE = gql`
mutation updateSelectTemplateVariable($input: UpdateSelectTemplateVariableInput!){
    updateSelectTemplateVariable(input: $input){
        id
        name
        description
        type
        required
        order
        options
        multiple
        selectPreviewValue
        template{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

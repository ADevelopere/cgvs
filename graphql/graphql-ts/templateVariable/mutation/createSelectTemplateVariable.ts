import { gql } from '@apollo/client';

export const CREATE_SELECT_TEMPLATE_VARIABLE = gql`
mutation createSelectTemplateVariable($input: CreateSelectTemplateVariableInput!){
    createSelectTemplateVariable(input: $input){
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

import { gql } from '@apollo/client';

export const CREATE_SELECT_TEMPLATE_VARIABLE = gql`
mutation createSelectTemplateVariable($input: CreateSelectCreateTemplateVariableInput!){
    createSelectTemplateVariable(input: $input){
        id
        name
        description
        type
        required
        order
        options
        multiple
        previewValue
        template{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

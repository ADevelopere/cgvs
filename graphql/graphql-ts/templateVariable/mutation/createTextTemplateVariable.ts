import { gql } from '@apollo/client';

export const CREATE_TEXT_TEMPLATE_VARIABLE = gql`
mutation createTextTemplateVariable($input: CreateTextCreateTemplateVariableInput!){
    createTextTemplateVariable(input: $input){
        id
        name
        description
        type
        required
        order
        minLength
        maxLength
        pattern
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

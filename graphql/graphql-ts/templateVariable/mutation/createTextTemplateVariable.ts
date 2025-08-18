import { gql } from '@apollo/client';

export const CREATE_TEXT_TEMPLATE_VARIABLE = gql`
mutation createTextTemplateVariable($input: CreateTextTemplateVariableInput!){
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
        textPreviewValue
        template{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

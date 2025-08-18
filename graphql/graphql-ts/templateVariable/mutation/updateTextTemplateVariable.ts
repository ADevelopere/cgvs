import { gql } from '@apollo/client';

export const UPDATE_TEXT_TEMPLATE_VARIABLE = gql`
mutation updateTextTemplateVariable($input: UpdateTextTemplateVariableInput!){
    updateTextTemplateVariable(input: $input){
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

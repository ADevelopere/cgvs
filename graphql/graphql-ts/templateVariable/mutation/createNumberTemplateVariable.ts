import { gql } from '@apollo/client';

export const CREATE_NUMBER_TEMPLATE_VARIABLE = gql`
mutation createNumberTemplateVariable($input: CreateNumberCreateTemplateVariableInput!){
    createNumberTemplateVariable(input: $input){
        id
        name
        description
        type
        required
        order
        minValue
        maxValue
        decimalPlaces
        numberPreviewValue
        template{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

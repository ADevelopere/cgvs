import { gql } from '@apollo/client';

export const UPDATE_NUMBER_TEMPLATE_VARIABLE = gql`
mutation updateNumberTemplateVariable($input: UpdateNumberCreateTemplateVariableInput!){
    updateNumberTemplateVariable(input: $input){
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

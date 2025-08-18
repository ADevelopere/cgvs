import { gql } from '@apollo/client';

export const UPDATE_DATE_TEMPLATE_VARIABLE = gql`
mutation updateDateTemplateVariable($input: UpdateDateCreateTemplateVariableInput!){
    updateDateTemplateVariable(input: $input){
        id
        name
        description
        type
        required
        order
        minDate
        maxDate
        format
        datePreviewValue
        template{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

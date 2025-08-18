import { gql } from '@apollo/client';

export const CREATE_DATE_TEMPLATE_VARIABLE = gql`
mutation createDateTemplateVariable($input: CreateDateCreateTemplateVariableInput!){
    createDateTemplateVariable(input: $input){
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

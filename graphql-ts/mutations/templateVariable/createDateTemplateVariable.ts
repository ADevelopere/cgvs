import { gql } from '@apollo/client';

export const CREATE_DATE_TEMPLATE_VARIABLE = gql`
mutation createDateTemplateVariable($input: DateTemplateVariableInput!){
    createDateTemplateVariable(input: $input){
        id
        name
        description
        order
        format
        min_date
        max_date
        preview_value
        required
        template{
            id
            name
        }
        created_at
        updated_at
    }
}
`;

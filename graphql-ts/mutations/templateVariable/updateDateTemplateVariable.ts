import { gql } from '@apollo/client';

export const UPDATE_DATE_TEMPLATE_VARIABLE = gql`
mutation updateDateTemplateVariable($input: UpdateDateTemplateVariableInput!){
    updateDateTemplateVariable(input: $input){
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

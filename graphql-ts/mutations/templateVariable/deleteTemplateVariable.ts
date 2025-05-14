import { gql } from '@apollo/client';

export const DELETE_TEMPLATE_VARIABLE = gql`
mutation deleteTemplateVariable($id: ID!){
    deleteTemplateVariable(id: $id){
        id
        name
        template{
            id
            name
        }
    }
}
`;

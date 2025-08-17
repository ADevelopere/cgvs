import { gql } from '@apollo/client';

export const DELETE_TEMPLATE_VARIABLE = gql`
mutation deleteTemplateVariable($id: Int!){
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

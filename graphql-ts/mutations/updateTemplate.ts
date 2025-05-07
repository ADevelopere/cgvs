import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE = gql`
mutation updateTemplate($id: ID!, $input: UpdateTemplateInput!){
    updateTemplate(id: $id, input: $input){
        id
        name
        description
        background_url
        category{
            id
        }
        order
        created_at
        updated_at
        trashed_at
        deleted_at
    }
}
`;

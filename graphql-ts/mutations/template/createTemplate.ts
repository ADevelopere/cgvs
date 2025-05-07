import { gql } from '@apollo/client';

export const CREATE_TEMPLATE = gql`
mutation createTemplate($input: CreateTemplateInput!){
    createTemplate(input: $input){
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
    }
}
`;

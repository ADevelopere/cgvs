import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE_WITH_IMAGE = gql`
mutation updateTemplateWithImage($id: ID!, $input: UpdateTemplateWithImageInput!){
    updateTemplateWithImage(id: $id, input: $input){
        id
        name
        description
        image_url
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

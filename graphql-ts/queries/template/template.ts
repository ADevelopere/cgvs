import { gql } from '@apollo/client';

export const TEMPLATE = gql`
query template($id: ID!){
    template(id: $id){
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

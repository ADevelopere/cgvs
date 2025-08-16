import { gql } from '@apollo/client';

export const TEMPLATE = gql`
query template($id: Int!){
    template(id: $id){
        id
        name
        description
        imageUrl
        category{
            id
            name
        }
        order
        preSuspensionCategory{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

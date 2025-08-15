import { gql } from '@apollo/client';

export const UNSUSPEND_TEMPLATE = gql`
mutation unsuspendTemplate($id: Int!){
    unsuspendTemplate(id: $id){
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

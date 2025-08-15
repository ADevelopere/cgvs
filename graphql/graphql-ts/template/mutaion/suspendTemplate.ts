import { gql } from '@apollo/client';

export const SUSPEND_TEMPLATE = gql`
mutation suspendTemplate($id: Int!){
    suspendTemplate(id: $id){
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

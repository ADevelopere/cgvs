import { gql } from '@apollo/client';

export const TEMPLATES = gql`
query templates{
    templates{
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

import { gql } from '@apollo/client';

export const TEMPLATE_CATEGORIES = gql`
    query templateCategories{
        templateCategories{
            id
            name
            description
            categorySpecialType
            parentCategory{
                id
            }
            order
            templates{
                id
                name
                description
                imageUrl
                order
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;

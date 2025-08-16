import { gql } from '@apollo/client';

export const TEMPLATE_CATEGORY = gql`
query templateCategory($id: Int!){
    templateCategory(id: $id){
        id
        name
        description
        categorySpecialType
        parentCategory{
            id
            name
        }
        order
        childCategories{
            id
            name
        }
        createdAt
        updatedAt
    }
}
`;

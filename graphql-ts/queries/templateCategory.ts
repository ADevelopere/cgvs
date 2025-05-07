import { gql } from '@apollo/client';

export const TEMPLATE_CATEGORY = gql`
query templateCategory($id: ID!){
    templateCategory(id: $id){
        id
        name
        description
        parentCategory{
            id
        }
        order
        special_type
        created_at
        updated_at
    }
}
`;

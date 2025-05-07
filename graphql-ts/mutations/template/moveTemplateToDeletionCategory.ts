import { gql } from '@apollo/client';

export const MOVE_TEMPLATE_TO_DELETION_CATEGORY = gql`
mutation moveTemplateToDeletionCategory($templateId: ID!){
    moveTemplateToDeletionCategory(templateId: $templateId){
        id
        name
        category{
            id
        }
        order
        trashed_at
        updated_at
    }
}
`;

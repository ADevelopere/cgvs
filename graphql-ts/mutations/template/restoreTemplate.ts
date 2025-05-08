import { gql } from '@apollo/client';

export const RESTORE_TEMPLATE = gql`
mutation restoreTemplate($templateId: ID!){
    restoreTemplate(templateId: $templateId){
        id
        name
        description
        category{
            id
        }
        order
        created_at
        trashed_at
        updated_at
    }
}
`;

import { gql } from '@apollo/client';

export const UPDATE_TEMPLATE = gql`
mutation updateTemplate($input: UpdateTemplateInput!){
    updateTemplate(input: $input){
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

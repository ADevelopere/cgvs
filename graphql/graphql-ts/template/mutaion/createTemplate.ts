import { gql } from '@apollo/client';

export const CREATE_TEMPLATE = gql`
mutation createTemplate($input: CreateTemplateInput!){
    createTemplate(input: $input){
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

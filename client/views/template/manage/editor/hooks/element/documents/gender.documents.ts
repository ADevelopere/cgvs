import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createGenderElementMutationDocument: TypedDocumentNode<
  Graphql.CreateGenderElementMutation,
  Graphql.CreateGenderElementMutationVariables
> = gql`
  mutation createGenderElement($input: GenderElementInput!) {
    createGenderElement(input: $input) {
      base {
        alignment
        createdAt
        description
        height
        id
        name
        positionX
        positionY
        renderOrder
        type
        updatedAt
        width
      }
      template {
        id
      }
      textProps {
        color
        fontRef {
          ... on FontReferenceGoogle {
            identifier
            type
          }
          ... on FontReferenceSelfHosted {
            fontId
            type
          }
        }
        fontSize
        id
        overflow
      }
    }
  }
`;

export const updateGenderElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateGenderElementMutation,
  Graphql.UpdateGenderElementMutationVariables
> = gql`
  mutation updateGenderElement($input: GenderElementUpdateInput!) {
    updateGenderElement(input: $input) {
      base {
        alignment
        createdAt
        description
        height
        id
        name
        positionX
        positionY
        renderOrder
        type
        updatedAt
        width
      }
      template {
        id
      }
      textProps {
        color
        fontRef {
          ... on FontReferenceGoogle {
            identifier
            type
          }
          ... on FontReferenceSelfHosted {
            fontId
            type
          }
        }
        fontSize
        id
        overflow
      }
    }
  }
`;

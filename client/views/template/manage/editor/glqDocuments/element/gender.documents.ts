import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createGenderElementMutationDocument: TypedDocumentNode<
  Graphql.CreateGenderElementMutation,
  Graphql.CreateGenderElementMutationVariables
> = gql`
  mutation createGenderElement($input: GenderElementInput!) {
    createGenderElement(input: $input) {
      base {
        id
        templateId
        alignment
        createdAt
        description
        height
        name
        positionX
        positionY
        zIndex
        type
        updatedAt
        width
        hidden
      }
      textProps {
        color
        fontRef {
          ... on FontReferenceGoogle {
            family
            type
            variant
          }
          ... on FontReferenceSelfHosted {
            fontVariantId
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
        id
        templateId
        alignment
        createdAt
        description
        height
        name
        positionX
        positionY
        zIndex
        type
        updatedAt
        width
        hidden
      }
      textProps {
        color
        fontRef {
          ... on FontReferenceGoogle {
            family
            type
            variant
          }
          ... on FontReferenceSelfHosted {
            fontVariantId
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

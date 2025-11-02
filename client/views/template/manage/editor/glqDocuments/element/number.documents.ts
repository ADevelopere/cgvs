import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createNumberElementMutationDocument: TypedDocumentNode<
  Graphql.CreateNumberElementMutation,
  Graphql.CreateNumberElementMutationVariables
> = gql`
  mutation createNumberElement($input: NumberElementInput!) {
    createNumberElement(input: $input) {
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
      numberProps {
        elementId
        mapping
        textPropsId
        variableId
      }
      numberDataSource {
        numberVariableId
        type
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

export const updateNumberElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateNumberElementMutation,
  Graphql.UpdateNumberElementMutationVariables
> = gql`
  mutation updateNumberElement($input: NumberElementUpdateInput!) {
    updateNumberElement(input: $input) {
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
      numberDataSource {
        numberVariableId
        type
      }
      numberProps {
        elementId
        mapping
        textPropsId
        variableId
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

export const updateNumberElementDataSourceMutationDocument: TypedDocumentNode<
  Graphql.UpdateNumberElementDataSourceMutation,
  Graphql.UpdateNumberElementDataSourceMutationVariables
> = gql`
  mutation updateNumberElementDataSource(
    $input: NumberElementDataSourceStandaloneUpdateInput!
  ) {
    updateNumberElementDataSource(input: $input) {
      elementId
      numberDataSource {
        numberVariableId
        type
      }
    }
  }
`;

export const updateNumberElementSpecPropsMutationDocument: TypedDocumentNode<
  Graphql.UpdateNumberElementSpecPropsMutation,
  Graphql.UpdateNumberElementSpecPropsMutationVariables
> = gql`
  mutation updateNumberElementSpecProps(
    $input: NumberElementSpecPropsStandaloneUpdateInput!
  ) {
    updateNumberElementSpecProps(input: $input) {
      elementId
      numberProps {
        elementId
        mapping
        textPropsId
        variableId
      }
    }
  }
`;

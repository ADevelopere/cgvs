import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createNumberElementMutationDocument: TypedDocumentNode<
  Graphql.CreateNumberElementMutation,
  Graphql.CreateNumberElementMutationVariables
> = gql`
  mutation createNumberElement($input: NumberElementInput!) {
    createNumberElement(input: $input) {
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

export const updateNumberElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateNumberElementMutation,
  Graphql.UpdateNumberElementMutationVariables
> = gql`
  mutation updateNumberElement($input: NumberElementUpdateInput!) {
    updateNumberElement(input: $input) {
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

export const updateNumberElementDataSourceMutationDocument: TypedDocumentNode<
  Graphql.UpdateNumberElementDataSourceMutation,
  Graphql.UpdateNumberElementDataSourceMutationVariables
> = gql`
  mutation updateNumberElementDataSource($input: NumberElementDataSourceStandaloneUpdateInput!) {
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
  mutation updateNumberElementSpecProps($input: NumberElementSpecPropsStandaloneUpdateInput!) {
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

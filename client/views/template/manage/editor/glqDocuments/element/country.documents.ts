import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createCountryElementMutationDocument: TypedDocumentNode<
  Graphql.CreateCountryElementMutation,
  Graphql.CreateCountryElementMutationVariables
> = gql`
  mutation createCountryElement($input: CountryElementInput!) {
    createCountryElement(input: $input) {
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
        renderOrder
        type
        updatedAt
        width
      }
      countryProps {
        representation
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

export const updateCountryElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateCountryElementMutation,
  Graphql.UpdateCountryElementMutationVariables
> = gql`
  mutation updateCountryElement($input: CountryElementUpdateInput!) {
    updateCountryElement(input: $input) {
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
        renderOrder
        type
        updatedAt
        width
      }
      countryProps {
        representation
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

export const updateCountryElementSpecPropsMutationDocument: TypedDocumentNode<
  Graphql.UpdateCountryElementSpecPropsMutation,
  Graphql.UpdateCountryElementSpecPropsMutationVariables
> = gql`
  mutation UpdateCountryElementSpecProps($input: CountryElementSpecPropsStandaloneUpdateInput!) {
  updateCountryElementSpecProps(input: $input) {
    countryProps {
      representation
    }
    elementId
  }
}
`;
import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const textElementFragment: TypedDocumentNode<Graphql.TextElementDetailsFragment> = gql`
  fragment TextElementDetails on TextElement {
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
    textDataSource {
      ... on TextDataSourceCertificateField {
        certificateField
        type
      }
      ... on TextDataSourceStatic {
        type
        value
      }
      ... on TextDataSourceStudentField {
        studentField
        type
      }
      ... on TextDataSourceTemplateSelectVariable {
        selectVariableId
        type
      }
      ... on TextDataSourceTemplateTextVariable {
        textVariableId
        type
      }
    }
    textElementSpecProps {
      elementId
      textPropsId
      variableId
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
`;

export const textElementByIdQueryDocument: TypedDocumentNode<
  Graphql.TextElementByIdQuery,
  Graphql.TextElementByIdQueryVariables
> = gql`
  query textElementById($id: Int!) {
    textElementById(id: $id) {
      ...TextElementDetails
    }
  }
`;

export const createTextElementMutationDocument: TypedDocumentNode<
  Graphql.CreateTextElementMutation,
  Graphql.CreateTextElementMutationVariables
> = gql`
  mutation createTextElement($input: TextElementInput!) {
    createTextElement(input: $input) {
      ...TextElementDetails
    }
  }
`;

export const updateTextElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateTextElementMutation,
  Graphql.UpdateTextElementMutationVariables
> = gql`
  mutation updateTextElement($input: TextElementUpdateInput!) {
    updateTextElement(input: $input) {
      ...TextElementDetails
    }
  }
`;

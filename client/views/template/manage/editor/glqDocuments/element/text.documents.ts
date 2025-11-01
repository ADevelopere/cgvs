import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const textElementByIdQueryDocument: TypedDocumentNode<
  Graphql.TextElementByIdQuery,
  Graphql.TextElementByIdQueryVariables
> = gql`
  query textElementById($id: Int!) {
    textElementById(id: $id) {
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
  }
`;

export const createTextElementMutationDocument: TypedDocumentNode<
  Graphql.CreateTextElementMutation,
  Graphql.CreateTextElementMutationVariables
> = gql`
  mutation createTextElement($input: TextElementInput!) {
    createTextElement(input: $input) {
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
  }
`;

export const updateTextElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateTextElementMutation,
  Graphql.UpdateTextElementMutationVariables
> = gql`
  mutation updateTextElement($input: TextElementUpdateInput!) {
    updateTextElement(input: $input) {
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
  }
`;

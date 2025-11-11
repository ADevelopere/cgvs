import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createDateElementMutationDocument: TypedDocumentNode<
  Graphql.CreateDateElementMutation,
  Graphql.CreateDateElementMutationVariables
> = gql`
  mutation createDateElement($input: DateElementInput!) {
    createDateElement(input: $input) {
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
      dateDataSource {
        ... on DateDataSourceCertificateField {
          certificateField
          type
        }
        ... on DateDataSourceStatic {
          type
          value
        }
        ... on DateDataSourceStudentField {
          studentField
          type
        }
        ... on DateDataSourceTemplateVariable {
          dateVariableId
          type
        }
      }
      dateProps {
        calendarType
        format
        offsetDays
        transformation
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

export const updateDateElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateDateElementMutation,
  Graphql.UpdateDateElementMutationVariables
> = gql`
  mutation updateDateElement($input: DateElementUpdateInput!) {
    updateDateElement(input: $input) {
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
      dateDataSource {
        ... on DateDataSourceCertificateField {
          certificateField
          type
        }
        ... on DateDataSourceStatic {
          type
          value
        }
        ... on DateDataSourceStudentField {
          studentField
          type
        }
        ... on DateDataSourceTemplateVariable {
          dateVariableId
          type
        }
      }
      dateProps {
        calendarType
        format
        offsetDays
        transformation
      }
      template {
        id
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

export const updateDateElementDataSourceMutationDocument: TypedDocumentNode<
  Graphql.UpdateDateElementDataSourceMutation,
  Graphql.UpdateDateElementDataSourceMutationVariables
> = gql`
  mutation updateDateElementDataSource($input: DateDataSourceStandaloneInput!) {
    updateDateElementDataSource(input: $input) {
      elementId
      dateDataSource {
        ... on DateDataSourceCertificateField {
          certificateField
          type
        }
        ... on DateDataSourceStatic {
          type
          value
        }
        ... on DateDataSourceStudentField {
          studentField
          type
        }
        ... on DateDataSourceTemplateVariable {
          dateVariableId
          type
        }
      }
    }
  }
`;

export const updateDateElementSpecPropsMutationDocument: TypedDocumentNode<
  Graphql.UpdateDateElementSpecPropsMutation,
  Graphql.UpdateDateElementSpecPropsMutationVariables
> = gql`
  mutation updateDateElementSpecProps($input: DateElementSpecPropsStandaloneInput!) {
    updateDateElementSpecProps(input: $input) {
      dateProps {
        calendarType
        format
        offsetDays
        transformation
      }
      elementId
    }
  }
`;

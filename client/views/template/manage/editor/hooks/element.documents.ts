import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const elementsByTemplateIdQueryDocument: TypedDocumentNode<
  Graphql.ElementsByTemplateIdQuery,
  Graphql.ElementsByTemplateIdQueryVariables
> = gql`
  query ElementsByTemplateId($templateId: Int!) {
    elementsByTemplateId(templateId: $templateId) {
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
        name
      }
      ... on CountryElement {
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
      ... on DateElement {
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
      ... on GenderElement {
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
      ... on ImageElement {
        imageDataSource {
          ... on ImageDataSourceStorageFile {
            storageFileId
            type
          }
        }
        imageProps {
          elementId
          fit
          storageFileId
        }
      }
      ... on NumberElement {
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
          fontSize
          id
          overflow
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
        }
      }
      ... on QRCodeElement {
        qrCodeProps {
          backgroundColor
          elementId
          errorCorrection
          foregroundColor
        }
      }
      ... on TextElement {
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
  }
`;

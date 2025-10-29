import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const elementsByTemplateIdQueryDocument: TypedDocumentNode<
  Graphql.ElementsByTemplateIdQuery,
  Graphql.ElementsByTemplateIdQueryVariables
> = gql`
  query elementsByTemplateId($templateId: Int!) {
  elementsByTemplateId(templateId: $templateId) {
    # Base fields from CertificateElementPothosInterface
    id
    name
    description
    type
    positionX
    positionY
    width
    height
    alignment
    renderOrder
    createdAt
    updatedAt
    template {
      id
      name
    }
    
    # Type-specific fields
    ... on CountryElement {
      representation
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
        overflow
      }
    }
    
    ... on DateElement {
      calendarType
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
      format
      offsetDays
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
        overflow
      }
      transformation
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
      fit
    }
    
    ... on NumberElement {
      mapping
      numberDataSource {
          numberVariableId
        type
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
        overflow
      }
    }
    
    ... on QRCodeElement {
      backgroundColor
      errorCorrection
      foregroundColor
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
        overflow
      }
    }
  }
}

`;
import { TypedDocumentNode, gql } from "@apollo/client";
import * as GQL from "@/client/graphql/generated/gql/graphql";

export const elementsByTemplateIdQueryDocument: TypedDocumentNode<
  GQL.ElementsByTemplateIdQuery,
  GQL.ElementsByTemplateIdQueryVariables
> = gql`
  query ElementsByTemplateId($templateId: Int!) {
    elementsByTemplateId(templateId: $templateId) {
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
            storageFilePath
            type
            imageUrl
          }
        }
        imageProps {
          elementId
          fit
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

export const certificateElementFragment: TypedDocumentNode<GQL.CertificateElementFragment> = gql`
  fragment CertificateElement on CertificateElementUnion {
    __typename
    ... on TextElement {
      base {
        id
      }
    }
    ... on ImageElement {
      base {
        id
      }
    }
    ... on DateElement {
      base {
        id
      }
    }
    ... on CountryElement {
      base {
        id
      }
    }
    ... on GenderElement {
      base {
        id
      }
    }
    ... on NumberElement {
      base {
        id
      }
    }
    ... on QRCodeElement {
      base {
        id
      }
    }
  }
`;

export const deleteElementMutationDocument: TypedDocumentNode<
  GQL.DeleteElementMutation,
  GQL.DeleteElementMutationVariables
> = gql`
  mutation DeleteElement($deleteElementId: Int!) {
    deleteElement(id: $deleteElementId)
  }
`;

export const deleteElementsByIdsMutationDocument: TypedDocumentNode<
  GQL.DeleteElementsMutation,
  GQL.DeleteElementsMutationVariables
> = gql`
  mutation deleteElements($ids: [Int!]!) {
    deleteElements(ids: $ids)
  }
`;

export const updateElementCommonPropertiesMutationDocument: TypedDocumentNode<
  GQL.UpdateElementCommonPropertiesMutation,
  GQL.UpdateElementCommonPropertiesMutationVariables
> = gql`
  mutation UpdateElementCommonProperties($input: CertificateElementBaseUpdateInput!) {
    updateElementCommonProperties(input: $input) {
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
    }
  }
`;

export const updateElementTextPropsMutationDocument: TypedDocumentNode<
  GQL.UpdateElementTextPropsMutation,
  GQL.UpdateElementTextPropsMutationVariables
> = gql`
  mutation UpdateElementTextProps($input: TextPropsUpdateInput!) {
    updateElementTextProps(input: $input) {
      textProps {
        id
        color
        fontSize
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
  }
`;

export const moveElementMutationDocument: TypedDocumentNode<GQL.MoveElementMutation, GQL.MoveElementMutationVariables> =
  gql`
    mutation MoveElement($input: ElementMoveInput!) {
      moveElement(input: $input) {
        base {
          alignment
          createdAt
          description
          height
          hidden
          id
          name
          positionX
          positionY
          zIndex
          templateId
          type
          updatedAt
          width
        }
      }
    }
  `;

export const increaseElementOrderMutationDocument: TypedDocumentNode<
  GQL.IncreaseElementOrderMutation,
  GQL.IncreaseElementOrderMutationVariables
> = gql`
  mutation IncreaseElementOrder($input: IncreaseElementOrderInput!) {
    increaseElementOrder(input: $input) {
      base {
        alignment
        createdAt
        description
        height
        hidden
        id
        name
        positionX
        positionY
        zIndex
        templateId
        type
        updatedAt
        width
      }
    }
  }
`;

export const decreaseElementOrderMutationDocument: TypedDocumentNode<
  GQL.DecreaseElementOrderMutation,
  GQL.DecreaseElementOrderMutationVariables
> = gql`
  mutation decreaseElementOrder($input: DecreaseElementOrderInput!) {
    decreaseElementOrder(input: $input) {
      base {
        alignment
        createdAt
        description
        height
        hidden
        id
        name
        positionX
        positionY
        zIndex
        templateId
        type
        updatedAt
        width
      }
    }
  }
`;

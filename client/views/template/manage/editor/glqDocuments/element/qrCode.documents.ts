import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createQRCodeElementMutationDocument: TypedDocumentNode<
  Graphql.CreateQrCodeElementMutation,
  Graphql.CreateQrCodeElementMutationVariables
> = gql`
  mutation createQRCodeElement($input: QRCodeElementInput!) {
    createQRCodeElement(input: $input) {
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
        hidden
      }
      qrCodeProps {
        backgroundColor
        elementId
        errorCorrection
        foregroundColor
      }
    }
  }
`;

export const updateQRCodeElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateQrCodeElementMutation,
  Graphql.UpdateQrCodeElementMutationVariables
> = gql`
  mutation updateQRCodeElement($input: QRCodeElementUpdateInput!) {
    updateQRCodeElement(input: $input) {
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
        hidden
      }
      qrCodeProps {
        backgroundColor
        elementId
        errorCorrection
        foregroundColor
      }
    }
  }
`;

export const updateQRCodeElementSpecPropsMutationDocument: TypedDocumentNode<
  Graphql.UpdateQrCodeElementSpecPropsMutation,
  Graphql.UpdateQrCodeElementSpecPropsMutationVariables
> = gql`
  mutation updateQRCodeElementSpecProps($input: QRCodeElementSpecPropsStandaloneUpdateInput!) {
    updateQRCodeElementSpecProps(input: $input) {
      elementId
      qrCodeProps {
        backgroundColor
        elementId
        errorCorrection
        foregroundColor
      }
    }
  }
`;

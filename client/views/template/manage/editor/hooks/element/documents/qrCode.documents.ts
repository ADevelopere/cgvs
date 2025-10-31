import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createQRCodeElementMutationDocument: TypedDocumentNode<
  Graphql.CreateQrCodeElementMutation,
  Graphql.CreateQrCodeElementMutationVariables
> = gql`
  mutation createQRCodeElement($input: QRCodeElementInput!) {
    createQRCodeElement(input: $input) {
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
      qrCodeProps {
        backgroundColor
        elementId
        errorCorrection
        foregroundColor
      }
      template {
        id
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
      qrCodeProps {
        backgroundColor
        elementId
        errorCorrection
        foregroundColor
      }
      template {
        id
      }
    }
  }
`;

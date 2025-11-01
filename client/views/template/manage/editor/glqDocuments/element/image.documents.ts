import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createImageElementMutationDocument: TypedDocumentNode<
  Graphql.CreateImageElementMutation,
  Graphql.CreateImageElementMutationVariables
> = gql`
  mutation createImageElement($input: ImageElementInput!) {
    createImageElement(input: $input) {
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
      template {
        id
      }
    }
  }
`;

export const updateImageElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateImageElementMutation,
  Graphql.UpdateImageElementMutationVariables
> = gql`
  mutation updateImageElement($input: ImageElementUpdateInput!) {
    updateImageElement(input: $input) {
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
      template {
        id
      }
    }
  }
`;

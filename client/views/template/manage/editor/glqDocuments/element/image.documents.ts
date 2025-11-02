import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createImageElementMutationDocument: TypedDocumentNode<
  Graphql.CreateImageElementMutation,
  Graphql.CreateImageElementMutationVariables
> = gql`
  mutation createImageElement($input: ImageElementInput!) {
    createImageElement(input: $input) {
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
  }
`;

export const updateImageElementMutationDocument: TypedDocumentNode<
  Graphql.UpdateImageElementMutation,
  Graphql.UpdateImageElementMutationVariables
> = gql`
  mutation updateImageElement($input: ImageElementUpdateInput!) {
    updateImageElement(input: $input) {
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
  }
`;

export const updateImageElementSpecPropsMutationDocument: TypedDocumentNode<
  Graphql.UpdateImageElementSpecPropsMutation,
  Graphql.UpdateImageElementSpecPropsMutationVariables
> = gql`
  mutation UpdateImageElementSpecProps(
    $input: ImageElementSpecPropsStandaloneUpdateInput!
  ) {
    updateImageElementSpecProps(input: $input) {
      elementId
      imageProps {
        elementId
        fit
        storageFileId
      }
    }
  }
`;

"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/element";

const mapImageDataSourceInputToOutput = (
  dataSourceInput: GQL.ImageDataSourceInput
): GQL.ImageDataSource => {
  if (dataSourceInput.storageFile) {
    const s: GQL.ImageDataSourceStorageFile = {
      storageFileId: dataSourceInput.storageFile.storageFileId,
    };
    return s;
  } else {
    throw new Error(
      "Invalid ImageDataSourceInput provided for optimistic response"
    );
  }
};


export const useImageElementMutation = (
  existingElement: GQL.ImageElement
) => {

  const [createImageElementMutation] = useMutation(
    Documents.createImageElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createImageElement) return;
        const newElement = data.createImageElement;
        const templateId = newElement.template?.id;
        if (!templateId) return;

        cache.updateQuery<GQL.ElementsByTemplateIdQuery>({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: { templateId },
        }, existing => {
          if (!existing?.elementsByTemplateId) return existing;
          return {
            elementsByTemplateId: [
              ...existing.elementsByTemplateId,
              newElement,
            ],
          };
        });
      },
    }
  );

  const [updateImageElementMutation] = useMutation(
    Documents.updateImageElementMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateImageElement: {
            __typename: existingElement.__typename,
            // 1. Spread the "existing value"
            ...existingElement,

            // 2. Deep-merge the new values from the variables
            // This is based on your fragment structure
            base: {
              ...existingElement.base,
              ...input.base, // Merge new 'base' fields
            },
            imageDataSource: mapImageDataSourceInputToOutput(input.dataSource),
            imageProps: {
              ...existingElement.imageProps,
              storageFileId: input.dataSource.storageFile.storageFileId,
              ...input.imageProps, // Merge new 'imageProps' fields
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateImageElement) return;
        const updated = data.updateImageElement;
        const templateId = updated.template?.id;
        if (!templateId) return;

        cache.updateQuery<GQL.ElementsByTemplateIdQuery>({
          query: Documents.elementsByTemplateIdQueryDocument,
          variables: { templateId },
        }, existing => {
          if (!existing?.elementsByTemplateId) return existing;
          return {
            elementsByTemplateId: existing.elementsByTemplateId.map(el =>
              el.base?.id === updated.base?.id ? updated : el
            ),
          };
        });
      },
    }
  );

  // Return the same tuple as useMutation
  return React.useMemo(
    () => ({
      /**
      * Mutation to create a new text element
      */
      createImageElementMutation,
      /**
 * Mutation to update an existing text element
 */
      updateImageElementMutation,
    }),
    [createImageElementMutation, updateImageElementMutation]
  );
};
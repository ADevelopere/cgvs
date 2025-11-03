"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/element";

export const useQRCodeElementMutation = (
  existingElement: GQL.QrCodeElement
) => {
  const [createQRCodeElementMutation] = useMutation(
    Documents.createQRCodeElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createQRCodeElement) return;
        const newElement = data.createQRCodeElement;
        const templateId = newElement.base.templateId;
        if (!templateId) return;

        cache.updateQuery<GQL.ElementsByTemplateIdQuery>(
          {
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          existing => {
            if (!existing?.elementsByTemplateId) return existing;
            return {
              elementsByTemplateId: [
                ...existing.elementsByTemplateId,
                newElement,
              ],
            };
          }
        );
      },
    }
  );

  const [updateQRCodeElementMutation] = useMutation(
    Documents.updateQRCodeElementMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateQRCodeElement: {
            __typename: existingElement.__typename,
            // 1. Spread the "existing value"
            ...existingElement,

            // 2. Deep-merge the new values from the variables
            // This is based on your fragment structure
            base: {
              ...existingElement.base,
              ...input.base, // Merge new 'base' fields
            },
            qrCodeProps: {
              ...existingElement.qrCodeProps,
              ...input.qrCodeProps, // Merge new 'qrCodeProps' fields
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateQRCodeElement) return;
        const updated = data.updateQRCodeElement;
        const templateId = updated.base.templateId;
        if (!templateId) return;

        cache.updateQuery<GQL.ElementsByTemplateIdQuery>(
          {
            query: Documents.elementsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          existing => {
            if (!existing?.elementsByTemplateId) return existing;
            return {
              elementsByTemplateId: existing.elementsByTemplateId.map(el =>
                el.base?.id === updated.base?.id ? updated : el
              ),
            };
          }
        );
      },
    }
  );

  // Return the same tuple as useMutation
  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new text element
       */
      createQRCodeElementMutation,
      /**
       * Mutation to update an existing text element
       */
      updateQRCodeElementMutation,
    }),
    [createQRCodeElementMutation, updateQRCodeElementMutation]
  );
};

"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./documents";
import { mapFontRefInputToFontRef } from "./useCertificateElementMutation";

export const useGenderElementMutation = (
  existingElement: GQL.GenderElement
) => {

  const [createGenderElementMutation] = useMutation(
    Documents.createGenderElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createGenderElement) return;
        const newElement = data.createGenderElement;
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

  const [updateGenderElementMutation] = useMutation(
    Documents.updateGenderElementMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateGenderElement: {
            __typename: existingElement.__typename,
            // 1. Spread the "existing value"
            ...existingElement,

            // 2. Deep-merge the new values from the variables
            // This is based on your fragment structure
            base: {
              ...existingElement.base,
              ...input.base, // Merge new 'base' fields
            },
            textProps: {
              ...existingElement.textProps,
              ...input.textProps, // Merge new 'textProps' fields
              fontRef: mapFontRefInputToFontRef(input.textProps.fontRef),
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateGenderElement) return;
        const updated = data.updateGenderElement;
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
      createGenderElementMutation,
      /**
 * Mutation to update an existing text element
 */
      updateGenderElementMutation,
    }),
    [createGenderElementMutation, updateGenderElementMutation]
  );
};
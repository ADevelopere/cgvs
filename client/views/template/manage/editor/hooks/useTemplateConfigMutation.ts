"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./config.documents";

export const useTemplateConfigMutation = (
  existingElement: GQL.TemplateConfig
) => {
  const [createTemplateConfigMutation] = useMutation(
   Documents.createTemplateConfigMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateConfig) return;
        const newConfig = data.createTemplateConfig;
        const templateId = newConfig.templateId;

        cache.updateQuery<GQL.TemplateConfigsByTemplateIdQuery>(
          {
            query: Documents.templateConfigsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          existing => {
            if (!existing?.) return existing;
            return {
              elementsByTemplateId: [
                ...existing.elementsByTemplateId,
                newConfig,
              ],
            };
          }
        );
      },
    }
  );

  const [updateTemplateConfigMutation] = useMutation(
    Documents.updateTemplateConfigMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateTemplateConfig: {
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
            countryProps: {
              ...existingElement.countryProps,
              ...input.countryProps, // Merge new 'countryProps' fields
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateTemplateConfig) return;
        const updated = data.updateTemplateConfig;
        const templateId = updated.template?.id;
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
       * Mutation to create a new template config
       */
      createTemplateConfigMutation,
      /**
       * Mutation to update an existing template config
       */
      updateTemplateConfigMutation,
    }),
    [createTemplateConfigMutation, updateTemplateConfigMutation]
  );
};

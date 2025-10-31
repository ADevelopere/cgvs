"use client";

import React from "react";
import { ApolloCache, Reference } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./documents";

/**
 * Hook for certificate element mutations
 * Provides mutation functions for all element types with cache management
 */
export const useCertificateElementMutation = (templateId: number) => {
  // Helper function to update elements cache using cache.modify (Apollo recommended pattern)
  const updateElementsCache = React.useCallback(
    (
      cache: ApolloCache,
      updater: (
        existing: GQL.CertificateElementUnion[]
      ) => GQL.CertificateElementUnion[]
    ) => {
      cache.modify({
        fields: {
          elementsByTemplateId(
            existingElementsRefs: readonly Reference[] | undefined,
            { readField, toReference }
          ) {
            const refs = existingElementsRefs ?? [];
            const existingElements = refs
              .map(ref => {
                const templateIdField = readField<number>(
                  "id",
                  readField("template", ref)
                );
                if (templateIdField !== templateId) return null;
                return cache.readFragment<GQL.CertificateElementUnion>({
                  id: cache.identify(ref),
                  fragment: Documents.certificateElementFragment,
                });
              })
              .filter((el): el is GQL.CertificateElementUnion => el !== null);

            const updatedElements = updater(existingElements);

            // Only keep valid references
            return updatedElements
              .map(element =>
                toReference({
                  __typename: element.__typename,
                  id: element.base?.id,
                })
              )
              .filter((ref): ref is Reference => !!ref);
          },
        },
      });
    },
    [templateId]
  );

  // ============================================================================
  // TEXT ELEMENT MUTATIONS
  // ============================================================================

  const [createTextElementMutation] = useMutation(
    Documents.createTextElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTextElement) return;
        const newElement = data.createTextElement;

        updateElementsCache(cache, existing => [...existing, newElement]);
      },
    }
  );

  const [updateTextElementMutation] = useMutation(
    Documents.updateTextElementMutationDocument,
    {
      optimisticResponse: variables => ({
        __typename: "Mutation" as const,
        updateTextElement: {
          __typename: "TextElement" as const,
          base: {
            __typename: "CertificateElementBase" as const,
            id: variables.input.id,
            type: null,
            alignment: variables.input.base.alignment,
            description: variables.input.base.description,
            height: variables.input.base.height,
            name: variables.input.base.name,
            positionX: variables.input.base.positionX,
            positionY: variables.input.base.positionY,
            renderOrder: variables.input.base.renderOrder,
            width: variables.input.base.width,
            createdAt: null,
            updatedAt: new Date().toISOString(),
          },
          template: {
            __typename: "Template" as const,
            id: templateId,
          },
          textDataSource: null,
          textElementSpecProps: null,
          textProps: null,
        },
      }),
      update(cache, { data }) {
        if (!data?.updateTextElement) return;
        const updatedElement = data.updateTextElement;

        updateElementsCache(cache, existing =>
          existing.map(element =>
            element.base?.id === updatedElement.base?.id
              ? updatedElement
              : element
          )
        );
      },
    }
  );

  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new text element
       */
      createTextElementMutation,
      /**
       * Mutation to update an existing text element
       */
      updateTextElementMutation,
    }),
    [createTextElementMutation, updateTextElementMutation]
  );
};

"use client";

import React from "react";
import { ApolloCache, Reference } from "@apollo/client";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/element";
import { useMutation } from "@apollo/client/react";
import { logger } from "@/client/lib/logger";
import { ElementsByTemplateIdQueryVariables } from "@/client/graphql/generated/gql/graphql";

export const mapFontRefInputToFontRef = (
  fontRefInput: GQL.FontReferenceInput
): GQL.FontReference => {
  if (fontRefInput.google) {
    const g: GQL.FontReferenceGoogle = {
      __typename: "FontReferenceGoogle",
      identifier: fontRefInput.google.identifier,
      type: GQL.FontSource.Google,
    };
    return g;
  } else if (fontRefInput.selfHosted) {
    const s: GQL.FontReferenceSelfHosted = {
      __typename: "FontReferenceSelfHosted",
      fontId: fontRefInput.selfHosted.fontId,
      type: GQL.FontSource.SelfHosted,
    };
    return s;
  } else {
    throw new Error(
      "Invalid FontReferenceInput provided for optimistic response"
    );
  }
};

export const useUpdateElementsCache = (templateId?: number | null) => {
  // Helper function to update elements cache using cache.modify (Apollo recommended pattern)
  const updateElementsCache = React.useCallback(
    (
      cache: ApolloCache,
      updater: (
        existing: GQL.CertificateElementUnion[]
      ) => GQL.CertificateElementUnion[]
    ) => {
      if (!templateId) return;
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

  return React.useMemo(
    () => ({
      updateElementsCache,
    }),
    [updateElementsCache]
  );
};

export const useTextPropsMutation = (elementId: number) => {
  const [updateTextPropsMutation] = useMutation(
    Documents.updateElementTextPropsMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        // 1. Get the updated data from the mutation
        const updatedItemFragment = mutationResult?.updateElementTextProps;
        if (!updatedItemFragment) {
          return;
        }

        // 2. Identify the item in the cache
        const cacheId = cache.identify({
          __typename: updatedItemFragment.textProps.__typename,
          id: updatedItemFragment.textProps.id,
        });
        logger.info("[updateTextPropsMutation] cacheId", { cacheId });

        if (!cacheId) {
          return; // Item isn't in the cache
        }

        // 2. Identify the parent Element's ID in the cache.
        // We can just pass the object itself (with id and __typename)
        // to cache.identify()
        const cacheId2 = cache.identify(updatedItemFragment.textProps);
        logger.info("[updateTextPropsMutation] cacheId2", { cacheId2 });

        if (!cacheId2) {
          // This Element isn't in the cache, nothing to do.
          return;
        }

        // 3. Modify only the fields that changed
        cache.modify({
          id: cacheId,
          fields: {
            // This 'fields' function gives you access to the existing values
            textProps(_existingValue) {
              // Return the new 'textProps' from the mutation result
              return updatedItemFragment.textProps;
            },
          },
        });

        cache.modify({
          id: cacheId2, // This is now correct (e.g., 'Element:123')
          fields: {
            // Find the 'textProps' field on this Element...
            textProps(_existingValue) {
              // ...and replace it with the new textProps from the mutation.
              return updatedItemFragment.textProps;
            },
          },
        });
      },
    }
  );

  return React.useMemo(
    () => ({
      updateTextPropsMutation,
    }),
    [updateTextPropsMutation]
  );
};

/**
 * Version 1: Eviction Strategy
 *
 * This hook evicts the `elementsByTemplateId` query from the cache.
 * The `useQuery` hook will then see that its data is missing and
 * trigger a network request to refetch it.
 *
 * @param templateId The ID of the template, needed to identify the query to evict.
 */
export const useTextPropsMutation_Evict = (templateId: number) => {
  const [updateTextPropsMutation, mutationState] = useMutation(
    Documents.updateElementTextPropsMutationDocument,
    {
      update(cache) {
        // We don't even need the mutation result.
        // We just need to evict the query that shows the list.
        const args: ElementsByTemplateIdQueryVariables = { templateId };
        const success = cache.evict({
          id: "ROOT_QUERY",
          fieldName: "elementsByTemplateId",
          args,
        });

        if (success) {
          // Optional: Garbage collect to remove orphaned data
          cache.gc();
        }
      },
    }
  );

  return React.useMemo(
    () => ({
      updateTextPropsMutation,
      ...mutationState,
    }),
    [updateTextPropsMutation, mutationState]
  );
};

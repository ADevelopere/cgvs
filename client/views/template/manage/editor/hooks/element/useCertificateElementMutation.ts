"use client";

import React from "react";
import { ApolloCache, Reference } from "@apollo/client";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/element";

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

  // Example for your 'updateTextProps' mutation
  const [updateTextProps] = useMutation(Documents.updateElementTextPropsMutationDocument, {
    update(cache, { data: mutationResult }) {
      // 1. Get the updated data from the mutation
      const updatedItemFragment = mutationResult?.updateElementTextProps;
      if (!updatedItemFragment) {
        return;
      }

      // 2. Identify the item in the cache
      const cacheId = cache.identify({
        __typename: "Item", // Or your item's __typename
        id: updatedItemFragment.id,
      });

      if (!cacheId) {
        return; // Item isn't in the cache
      }

      // 3. Modify only the fields that changed
      cache.modify({
        id: cacheId,
        fields: {
          // This 'fields' function gives you access to the existing values
          textProps(existingValue) {
            // Return the new 'textProps' from the mutation result
            return updatedItemFragment.textProps;
          },
          // Note: You don't need to touch 'base' or
          // 'specificItemTypeProps'. They remain untouched.
        },
      });
    },
  });

  return React.useMemo(
    () => ({
      updateElementsCache,
    }),
    [updateElementsCache]
  );
};

"use client";

import React from "react";
import { ApolloCache, Reference } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./documents";

export const extractVariableIdFromDataSourceInput = (
  dataSource: GQL.TextDataSourceInput
): number | null => {
  if (dataSource.templateTextVariable?.variableId) {
    return dataSource.templateTextVariable.variableId;
  } else if (dataSource.templateSelectVariable?.variableId) {
    return dataSource.templateSelectVariable.variableId;
  }
  return null;
};

const mapFontRefInputToFontRef = (
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
const mapTextDataSourceInputToOutput = (
  dataSourceInput: GQL.TextDataSourceInput
): GQL.TextDataSource => {
  if (dataSourceInput.static) {
    const s: GQL.TextDataSourceStatic = {
      value: dataSourceInput.static.value,
    };
    return s;
  } else if (dataSourceInput.certificateField) {
    const cf: GQL.TextDataSourceCertificateField = {
      certificateField: dataSourceInput.certificateField.field,
    };
    return cf;
  } else if (dataSourceInput.studentField) {
    const sf: GQL.TextDataSourceStudentField = {
      studentField: dataSourceInput.studentField.field,
    };
    return sf;
  } else if (dataSourceInput.templateSelectVariable) {
    const tsv: GQL.TextDataSourceTemplateSelectVariable = {
      selectVariableId: dataSourceInput.templateSelectVariable.variableId,
    };
    return tsv;
  } else if (dataSourceInput.templateTextVariable) {
    const ttv: GQL.TextDataSourceTemplateTextVariable = {
      textVariableId: dataSourceInput.templateTextVariable.variableId,
    };
    return ttv;
  } else {
    throw new Error(
      "Invalid TextDataSourceInput provided for optimistic response"
    );
  }
};

/**
 * A custom hook to update a text element with an optimistic response.
 *
 * @param existingElement - The current, full element object (or null).
 */
export const useOptimisticTextElementUpdate = (
  existingElement: GQL.TextElement
) => {
  const [updateTextElementMutation, mutationResult] = useMutation(
    Documents.updateTextElementMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateTextElement: {
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
            textDataSource: mapTextDataSourceInputToOutput(input.dataSource),
            textElementSpecProps: {
              ...existingElement.textElementSpecProps,
              variableId: extractVariableIdFromDataSourceInput(
                input.dataSource
              ),
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateTextElement) return;
        const updated = data.updateTextElement;
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
  return [updateTextElementMutation, mutationResult];
};

/**
 * Hook for certificate element mutations
 * Provides mutation functions for all element types with cache management
 */
export const useCertificateElementMutation = (templateId: number) => {
  // Helper function to update elements cache using cache.modify (Apollo recommended pattern)
  const _updateElementsCache = React.useCallback(
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

  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new text element
       */
      createTextElementMutation,
      /**
       * Mutation to update an existing text element
       */
      updateTextElementMutation: useOptimisticTextElementUpdate,
    }),
    [createTextElementMutation]
  );
};

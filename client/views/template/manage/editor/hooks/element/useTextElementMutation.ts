"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/element";
import { mapFontRefInputToFontRef } from "./useCertificateElementMutation";

export const extractVariableIdFromTextDataSourceInput = (
  dataSource: GQL.TextDataSourceInput
): number | null => {
  if (dataSource.templateTextVariable?.variableId) {
    return dataSource.templateTextVariable.variableId;
  } else if (dataSource.templateSelectVariable?.variableId) {
    return dataSource.templateSelectVariable.variableId;
  }
  return null;
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


export const useTextElementMutation = (
  existingElement: GQL.TextElement
) => {

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

  const [updateTextElementMutation] = useMutation(
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
              variableId: extractVariableIdFromTextDataSourceInput(
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
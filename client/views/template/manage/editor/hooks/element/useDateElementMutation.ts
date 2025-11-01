"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "./documents";
import { mapFontRefInputToFontRef } from "./useCertificateElementMutation";

export const extractVariableIdFromDataSourceInput = (
  dataSource: GQL.DateDataSourceInput
): number | null => {
  if (dataSource.templateVariable?.variableId) {
    return dataSource.templateVariable.variableId;
  }
  return null;
};


const mapDateDataSourceInputToOutput = (
  dataSourceInput: GQL.DateDataSourceInput
): GQL.DateDataSource => {
  if (dataSourceInput.static) {
    const s: GQL.DateDataSourceStatic = {
      value: dataSourceInput.static.value,
    };
    return s;
  } else if (dataSourceInput.certificateField) {
    const cf: GQL.DateDataSourceCertificateField = {
      certificateField: dataSourceInput.certificateField.field,
    };
    return cf;
  } else if (dataSourceInput.studentField) {
    const sf: GQL.DateDataSourceStudentField = {
      studentField: dataSourceInput.studentField.field,
    };
    return sf;
  } else if (dataSourceInput.templateVariable) {
    const tsv: GQL.DateDataSourceTemplateVariable = {
      dateVariableId: dataSourceInput.templateVariable.variableId,
    };
    return tsv;
  } else {
    throw new Error(
      "Invalid DateDataSourceInput provided for optimistic response"
    );
  }
};


export const useDateElementMutation = (
  existingElement: GQL.DateElement
) => {

  const [createDateElementMutation] = useMutation(
    Documents.createDateElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createDateElement) return;
        const newElement = data.createDateElement;
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

  const [updateDateElementMutation] = useMutation(
    Documents.updateDateElementMutationDocument,
    {
      // This config object is re-created if 'existingElement' changes,
      // which is exactly what we want.
      optimisticResponse: variables => {
        const { input } = variables;

        return {
          // Key matches your mutation name
          updateDateElement: {
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
            dateDataSource: mapDateDataSourceInputToOutput(input.dataSource),
            dateProps: {
              ...existingElement.dateProps,
              variableId: extractVariableIdFromDataSourceInput(
                input.dataSource
              ),
            },
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateDateElement) return;
        const updated = data.updateDateElement;
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
      * Mutation to create a new date element
      */
      createDateElementMutation,
      /**
 * Mutation to update an existing date element
 */
      updateDateElementMutation,
    }),
    [createDateElementMutation, updateDateElementMutation]
  );
};
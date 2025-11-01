"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import * as Documents from "../../glqDocuments/config.documents";

export const useTemplateConfigMutation = () => {
  const [createTemplateConfigMutation] = useMutation(
    Documents.createTemplateConfigMutationDocument,
    {
      update(cache, { data: mutationResult }) {
        const newTemplateConfig = mutationResult?.createTemplateConfig;
        if (!newTemplateConfig?.templateId) {
          return;
        }

        cache.writeQuery({
          query: Documents.templateConfigByTemplateIdQueryDocument,

          // Specify the variables for the query you're writing
          variables: {
            templateId: newTemplateConfig.templateId,
          },

          // Provide the data in the *exact shape* of the query
          data: {
            templateConfigByTemplateId: newTemplateConfig,
          },
        });
        // const newConfig = data.createTemplateConfig;
        // const templateId = newConfig.templateId;
        // if (!templateId) return;

        // cache.updateQuery<GQL.TemplateConfigByTemplateIdQuery>(
        //   {
        //     query: Documents.templateConfigByTemplateIdQueryDocument,
        //     variables: { templateId },
        //   },
        //   existing => {
        //     if (!existing?.templateConfigByTemplateId) return existing;
        //     return {
        //       templateConfigByTemplateId: newConfig,
        //     };
        //   }
        // );
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
            __typename: "TemplateConfig" as const,
            ...input,
          },
        };
      },
      update(cache, { data }) {
        if (!data?.updateTemplateConfig) return;
        const updated = data.updateTemplateConfig;
        const templateId = updated.templateId;
        if (!templateId) return;

        cache.updateQuery<GQL.TemplateConfigByTemplateIdQuery>(
          {
            query: Documents.templateConfigByTemplateIdQueryDocument,
            variables: { templateId },
          },
          existing => {
            if (!existing?.templateConfigByTemplateId) return existing;
            return {
              templateConfigByTemplateId: updated,
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

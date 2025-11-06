"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as Documents from "../../glqDocuments/config.documents";

export const useTemplateConfigMutation = () => {
  const [createTemplateConfigMutation] = useMutation(Documents.createTemplateConfigMutationDocument, {
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
    },
  });

  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new template config, and write it to templateConfigByTemplateIdQuery
       */
      createTemplateConfigMutation,
    }),
    [createTemplateConfigMutation]
  );
};

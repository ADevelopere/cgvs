"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateMutations } from "./useTemplateMutations";

/**
 * Template Service Hook
 *
 * Provides data operations for templates
 */
export const useTemplateOperations = () => {
  const apollo = useTemplateMutations();
  const notifications = useNotifications();
  const { templateCategoryTranslations: strings } = useAppTranslation();
  /**
   * Update an existing template.
   * Updates the store directly on success.
   */
  const updateTemplate = useCallback(
    async (input: Graphql.UpdateTemplateMutationVariables["input"]): Promise<Graphql.Template | undefined> => {
      try {
        const result = await apollo.updateTemplateMutation({
          variables: { input },
        });

        if (result.data?.updateTemplate) {
          notifications.show(strings.templateUpdatedSuccessfully, {
            severity: "success",
          });
          // Directly update the store
          return result.data.updateTemplate;
        } else {
          logger.error("Error updating template:", result.error);
          notifications.show(strings.templateUpdateFailed, {
            severity: "error",
          });
        }
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage = gqlError.graphQLErrors?.[0]?.message || gqlError.message || strings.templateUpdateFailed;

        logger.error("Error updating template:", error);
        notifications.show(errorMessage, { severity: "error" });
      }
    },
    [apollo, notifications, strings]
  );

  return useMemo(
    () => ({
      updateTemplate,
    }),
    [updateTemplate]
  );
};

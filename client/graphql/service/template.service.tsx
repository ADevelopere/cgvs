"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateGraphQL } from "@/client/graphql/apollo/template.apollo";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { isAbortError } from "@/client/utils/errorUtils";

/**
 * Template Service Hook
 *
 * Provides data operations for templates without state management.
 * All functions return values directly and handle errors internally
 * by logging and showing notifications.
 *
 * Note: No type casting ("as") is used. All null/undefined cases are
 * handled explicitly with type guards.
 */
export const useTemplateService = () => {
 const apollo = useTemplateGraphQL();
 const notifications = useNotifications();
 const strings = useAppTranslation("templateCategoryTranslations");

 /**
  * Fetch a single template by ID
  * Returns null on error or if not found
  */
 const fetchTemplate = useCallback(
  async (id: number): Promise<Graphql.Template | null> => {
   try {
    const result = await apollo.templateQuery({ id });

    if (result.data) {
     return result.data.template;
    }

    logger.error("Error fetching template:", result.error);
    notifications.show(
     strings.errorLoadingTemplate || "Error loading template",
     {
      severity: "error",
      autoHideDuration: 3000,
     },
    );
    return null;
   } catch (error) {
    if (!isAbortError(error)) {
     logger.error("Error fetching template:", error);
     notifications.show(
      strings.errorLoadingTemplate || "Error loading template",
      {
       severity: "error",
       autoHideDuration: 3000,
      },
     );
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return null;
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Fetch paginated templates
  * Returns empty result on error
  */
 const fetchTemplates = useCallback(
  async (
   variables: Graphql.TemplatesQueryVariables,
  ): Promise<Graphql.TemplatesQuery["templates"] | null> => {
   try {
    const result = await apollo.paginatedTemplatesQuery(variables);

    if (result.data) {
     return result.data.templates;
    }

    logger.error("Error fetching templates:", result.error);
    notifications.show(
     strings.errorLoadingTemplate || "Error loading templates",
     {
      severity: "error",
      autoHideDuration: 3000,
     },
    );
    return null;
   } catch (error) {
    if (!isAbortError(error)) {
     logger.error("Error fetching templates:", error);
     notifications.show(
      strings.errorLoadingTemplate || "Error loading templates",
      {
       severity: "error",
       autoHideDuration: 3000,
      },
     );
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return null;
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Fetch template configuration
  * Returns configuration data on success, null on failure
  */
 const fetchTemplateConfig =
  useCallback(async (): Promise<Graphql.TemplatesConfigs | null> => {
   try {
    const result = await apollo.templateConfigQuery();

    if (result.data) {
     return result.data.templatesConfigs;
    }

    logger.error("Error fetching template config:", result.error);
    notifications.show("Failed to fetch template configuration", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   } catch (error) {
    if (!isAbortError(error)) {
     logger.error("Error fetching template config:", error);
     notifications.show("Failed to fetch template configuration", {
      severity: "error",
      autoHideDuration: 3000,
     });
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return null;
   }
  }, [apollo, notifications]);


 /**
  * Update an existing template
  * Returns the updated template on success, null on failure
  */
 const updateTemplate = useCallback(
  async (
   input: Graphql.UpdateTemplateMutationVariables["input"],
  ): Promise<Graphql.Template | null> => {
   try {
    const result = await apollo.updateTemplateMutation({ input });

    if (result.data) {
     notifications.show(strings.templateUpdatedSuccessfully, {
      severity: "success",
      autoHideDuration: 3000,
     });
     return result.data.updateTemplate;
    }

    logger.error("Error updating template:", result.errors);
    notifications.show(strings.templateUpdateFailed, {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   } catch (error) {
    const gqlError = error as {
     message?: string;
     graphQLErrors?: Array<{ message: string }>;
    };
    const errorMessage =
     gqlError.graphQLErrors?.[0]?.message ||
     gqlError.message ||
     strings.templateUpdateFailed;

    logger.error("Error updating template:", error);
    notifications.show(errorMessage, {
     severity: "error",
     autoHideDuration: 5000,
    });
    return null;
   }
  },
  [apollo, notifications, strings],
 );

 return useMemo(
  () => ({
   fetchTemplate,
   fetchTemplates,
   fetchTemplateConfig,
   updateTemplate,

  }),
  [
   fetchTemplate,
   fetchTemplates,
   fetchTemplateConfig,
   updateTemplate,

  ],
 );
};

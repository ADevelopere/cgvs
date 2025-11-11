"use client";

import { useCallback, useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import { useFontMutations } from "./useFontMutations";

/**
 * Font Service Hook
 *
 * Provides data operations for fonts
 */
export const useFontOperations = () => {
  const apollo = useFontMutations();
  const notifications = useNotifications();
  const { fontManagementTranslations: strings } = useAppTranslation();

  /**
   * Delete a font variant.
   * Updates the store directly on success.
   */
  const deleteFontVariant = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const result = await apollo.deleteFontVariantMutation({
          variables: { id },
        });

        if (result.data?.deleteFontVariant) {
          notifications.show(strings.fontDeletedSuccessfully, {
            severity: "success",
          });
          return true;
        } else {
          logger.error({ caller: "useFontOperations" }, "Error deleting font variant:", result.error);
          notifications.show(strings.errorDeletingFont, {
            severity: "error",
          });
          return false;
        }
      } catch (error) {
        const gqlError = error as {
          message?: string;
          graphQLErrors?: Array<{ message: string }>;
        };
        const errorMessage = gqlError.graphQLErrors?.[0]?.message || gqlError.message || strings.errorDeletingFont;

        logger.error({ caller: "useFontOperations" }, "Error deleting font variant:", error);
        notifications.show(errorMessage, { severity: "error" });
        return false;
      }
    },
    [apollo, notifications, strings]
  );

  return useMemo(
    () => ({
      deleteFontVariant,
    }),
    [deleteFontVariant]
  );
};

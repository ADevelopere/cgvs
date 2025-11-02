import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateImageElementSpecPropsMutationDocument } from "../../glqDocuments/element/image.documents";
import { useElementState } from "./useElementState";
import { validateImagePropsField } from "../element/image/imageValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedImagePropsFormState,
  ImagePropsFormErrors,
  UpdateImagePropsWithElementIdFn,
  ValidateImagePropsFieldFn,
} from "../element/image";

export type UseImagePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseImagePropsStateReturn = {
  getState: (elementId: number) => SanitizedImagePropsFormState | null;
  updateFn: UpdateImagePropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, ImagePropsFormErrors>;
};

/**
 * Extract imageProps state from ImageElement
 */
function extractImagePropsState(
  element: GQL.CertificateElementUnion
): SanitizedImagePropsFormState | null {
  if (element.__typename !== "ImageElement" || !element.imageProps) {
    return null;
  }

  return {
    fit: element.imageProps.fit as GQL.ElementImageFit,
  };
}

/**
 * Convert imageProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedImagePropsFormState
): GQL.ImageElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    imageProps: {
      fit: state.fit,
    },
  };
}

export function useImagePropsState(
  params: UseImagePropsStateParams
): UseImagePropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateImageElementSpecPropsMutation] = useMutation(
    updateImageElementSpecPropsMutationDocument
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedImagePropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateImageElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update image properties";
        logger.error("useImagePropsState: Mutation failed", {
          elementId,
          error,
        });
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
        throw error;
      }
    },
    [updateImageElementSpecPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const validator: ValidateImagePropsFieldFn = validateImagePropsField();

  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractImagePropsState,
    mutationFn,
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}

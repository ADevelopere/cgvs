import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateImageElementSpecPropsMutationDocument } from "../../glqDocuments/element/image.documents";
import { useElementState } from "./useElementState";
import { validateImageProps } from "../element/image/imageValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  ImagePropsFormState,
  ImagePropsFormErrors,
  UpdateImagePropsWithElementIdFn,
  UpdateImagePropsFn,
} from "../element/image";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseImagePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseImagePropsStateReturn = {
  imagePropsStates: Map<number, ImagePropsFormState>;
  updateImagePropsStateFn: UpdateImagePropsWithElementIdFn;
  pushImagePropsStateUpdate: (elementId: number) => Promise<void>;
  initImagePropsState: (elementId: number) => ImagePropsFormState;
  imagePropsStateErrors: Map<number, ImagePropsFormErrors>;
};

/**
 * Extract imageProps state from ImageElement
 */
function extractImagePropsState(element: GQL.CertificateElementUnion): ImagePropsFormState | null {
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
function toUpdateInput(elementId: number, state: ImagePropsFormState): GQL.ImageElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    imageProps: {
      fit: state.fit,
    },
  };
}

export function useImagePropsState(params: UseImagePropsStateParams): UseImagePropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateImageElementSpecPropsMutation] = useMutation(updateImageElementSpecPropsMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: ImagePropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateImageElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update image properties";
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
  const validator = validateImageProps();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    ImagePropsFormState,
    ImagePropsFormErrors,
    string | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractImagePropsState,
    mutationFn,
    stateNamespace: "imageProps",
  });

  return {
    imagePropsStates: states,
    updateImagePropsStateFn: updateFn,
    pushImagePropsStateUpdate: pushUpdate,
    initImagePropsState: initState,
    imagePropsStateErrors: errors,
  };
}

export type UseImagePropsParams = {
  elementId: number;
};

export const useImageProps = (params: UseImagePropsParams) => {
  const {
    imageProps: {
      imagePropsStates,
      updateImagePropsStateFn,
      pushImagePropsStateUpdate,
      initImagePropsState,
      imagePropsStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const imageProps: ImagePropsFormState = React.useMemo(() => {
    return imagePropsStates.get(params.elementId) ?? initImagePropsState(params.elementId);
  }, [imagePropsStates, params.elementId, initImagePropsState]);

  const updateImageProps: UpdateImagePropsFn = React.useCallback(
    action => {
      updateImagePropsStateFn(params.elementId, action);
    },
    [params.elementId, updateImagePropsStateFn]
  );

  const pushImagePropsUpdate = React.useCallback(async () => {
    await pushImagePropsStateUpdate(params.elementId);
  }, [params.elementId, pushImagePropsStateUpdate]);

  const errors: ImagePropsFormErrors = React.useMemo(() => {
    return imagePropsStateErrors.get(params.elementId) || {};
  }, [imagePropsStateErrors, params.elementId]);

  return {
    imagePropsState: imageProps,
    updateImageProps,
    pushImagePropsUpdate,
    imagePropsErrors: errors,
  };
};

import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateImageElementDataSourceMutationDocument } from "../../glqDocuments/element/image.documents";
import { validateImageDataSource } from "../element/image/imageValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  ImageDataSourceFormState,
  ImageDataSourceFormErrors,
  UpdateImageDataSourceWithElementIdFn,
  imageDataSourceToInput,
  ImageDataSourceFieldErrors,
} from "../element/image/types";
import { useElementState } from "./useElementState";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseImageDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseImageDataSourceStateReturn = {
  imageDataSourceStates: Map<number, ImageDataSourceFormState>;
  updateImageDataSourceStateFn: UpdateImageDataSourceWithElementIdFn;
  pushImageDataSourceStateUpdate: (elementId: number) => Promise<void>;
  initImageDataSourceState: (elementId: number) => ImageDataSourceFormState;
  imageDataSourceStateErrors: Map<number, ImageDataSourceFormErrors>;
};

/**
 * Type guard to check if element is ImageElement
 */
function isImageElement(element: GQL.CertificateElementUnion): element is GQL.ImageElement {
  return element.__typename === "ImageElement";
}

/**
 * Extract imageDataSource state from element
 */
function extractImageDataSourceState(element: GQL.CertificateElementUnion): ImageDataSourceFormState | null {
  if (isImageElement(element) && element.imageDataSource) {
    return {
      dataSource: imageDataSourceToInput(element.imageDataSource),
    };
  }
  return null;
}

/**
 * Convert imageDataSource input to update input
 */
function toUpdateInput(elementId: number, state: ImageDataSourceFormState): GQL.ImageDataSourceStandaloneUpdateInput {
  return {
    elementId: elementId,
    dataSource: state.dataSource,
  };
}

export function useImageDataSourceState(params: UseImageDataSourceStateParams): UseImageDataSourceStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateImageElementDataSourceMutation] = useMutation(updateImageElementDataSourceMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: ImageDataSourceFormState): Promise<void> => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateImageElementDataSourceMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update image data source";
        logger.error({ caller: "useImageDataSourceState" }, "Mutation failed", {
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
    [updateImageElementDataSourceMutation, notifications, errorStrings]
  );

  const validator = validateImageDataSource();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    ImageDataSourceFormState,
    ImageDataSourceFormErrors,
    ImageDataSourceFieldErrors
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractImageDataSourceState,
    mutationFn,
    stateNamespace: "imageDataSource",
  });

  return {
    imageDataSourceStates: states,
    updateImageDataSourceStateFn: updateFn,
    pushImageDataSourceStateUpdate: pushUpdate,
    initImageDataSourceState: initState,
    imageDataSourceStateErrors: errors,
  };
}

export type UseImageDataSourceParams = {
  elementId: number;
};

export const useImageDataSource = (params: UseImageDataSourceParams) => {
  const {
    imageDataSource: {
      imageDataSourceStates,
      updateImageDataSourceStateFn,
      pushImageDataSourceStateUpdate,
      initImageDataSourceState,
      imageDataSourceStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const { dataSource } = React.useMemo(() => {
    return imageDataSourceStates.get(params.elementId) ?? initImageDataSourceState(params.elementId);
  }, [imageDataSourceStates, params.elementId, initImageDataSourceState]);

  const updateImageDataSource = React.useCallback(
    (dataSource: GQL.ImageDataSourceInput) => {
      updateImageDataSourceStateFn(params.elementId, {
        key: "dataSource",
        value: dataSource,
      });
    },
    [params.elementId, updateImageDataSourceStateFn]
  );

  const pushImageDataSourceUpdate = React.useCallback(async () => {
    await pushImageDataSourceStateUpdate(params.elementId);
  }, [params.elementId, pushImageDataSourceStateUpdate]);

  const errors: ImageDataSourceFormErrors = React.useMemo(() => {
    return (
      imageDataSourceStateErrors.get(params.elementId) || {
        dataSource: {},
      }
    );
  }, [imageDataSourceStateErrors, params.elementId]);

  return {
    imageDataSourceState: dataSource,
    updateImageDataSource,
    pushImageDataSourceUpdate,
    imageDataSourceErrors: errors,
  };
};

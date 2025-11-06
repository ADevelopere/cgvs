import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateQRCodeElementSpecPropsMutationDocument } from "../../glqDocuments/element/qrCode.documents";
import { useElementState } from "./useElementState";
import { validateQRCodeProps } from "../element/qrcode/qrCodeValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  QRCodePropsFormState,
  QRCodePropsFormErrors,
  UpdateQRCodePropsWithElementIdFn,
  UpdateQRCodePropsFn,
} from "../element/qrcode";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseQRCodePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseQRCodePropsStateReturn = {
  qrCodePropsStates: Map<number, QRCodePropsFormState>;
  updateQRCodePropsStateFn: UpdateQRCodePropsWithElementIdFn;
  pushQRCodePropsStateUpdate: (elementId: number) => Promise<void>;
  initQRCodePropsState: (elementId: number) => QRCodePropsFormState;
  qrCodePropsStateErrors: Map<number, QRCodePropsFormErrors>;
};

/**
 * Extract qrCodeProps state from QRCodeElement
 */
function extractQRCodePropsState(element: GQL.CertificateElementUnion): QRCodePropsFormState | null {
  if (element.__typename !== "QRCodeElement" || !element.qrCodeProps) {
    return null;
  }

  return {
    backgroundColor: element.qrCodeProps.backgroundColor ?? "#FFFFFF",
    foregroundColor: element.qrCodeProps.foregroundColor ?? "#000000",
    errorCorrection: (element.qrCodeProps.errorCorrection as GQL.QrCodeErrorCorrection) ?? GQL.QrCodeErrorCorrection.L,
  };
}

/**
 * Convert qrCodeProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: QRCodePropsFormState
): GQL.QrCodeElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    qrCodeProps: state,
  };
}

export function useQRCodePropsState(params: UseQRCodePropsStateParams): UseQRCodePropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateQRCodeElementSpecPropsMutation] = useMutation(updateQRCodeElementSpecPropsMutationDocument);

  // Get validator
  const validator = validateQRCodeProps();

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: QRCodePropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateQRCodeElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update QR code properties";
        logger.error({ caller: "useQRCodePropsState" }, "Mutation failed", {
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
    [updateQRCodeElementSpecPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    QRCodePropsFormState,
    QRCodePropsFormErrors,
    string | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractQRCodePropsState,
    mutationFn,
    stateNamespace: "qrCodeProps",
  });

  return {
    qrCodePropsStates: states,
    updateQRCodePropsStateFn: updateFn,
    pushQRCodePropsStateUpdate: pushUpdate,
    initQRCodePropsState: initState,
    qrCodePropsStateErrors: errors,
  };
}

export type UseQRCodePropsParams = {
  elementId: number;
};

export const useQRCodeProps = (params: UseQRCodePropsParams) => {
  const {
    qrCodeProps: {
      qrCodePropsStates,
      updateQRCodePropsStateFn,
      pushQRCodePropsStateUpdate,
      initQRCodePropsState,
      qrCodePropsStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const qrCodeProps: QRCodePropsFormState = React.useMemo(() => {
    return qrCodePropsStates.get(params.elementId) ?? initQRCodePropsState(params.elementId);
  }, [qrCodePropsStates, params.elementId, initQRCodePropsState]);

  const updateQRCodeProps: UpdateQRCodePropsFn = React.useCallback(
    action => {
      updateQRCodePropsStateFn(params.elementId, action);
    },
    [params.elementId, updateQRCodePropsStateFn]
  );

  const pushQRCodePropsUpdate = React.useCallback(async () => {
    await pushQRCodePropsStateUpdate(params.elementId);
  }, [params.elementId, pushQRCodePropsStateUpdate]);

  const errors: QRCodePropsFormErrors = React.useMemo(() => {
    return qrCodePropsStateErrors.get(params.elementId) || {};
  }, [qrCodePropsStateErrors, params.elementId]);

  return {
    qrCodePropsState: qrCodeProps,
    updateQRCodeProps,
    pushQRCodePropsUpdate,
    qrCodePropsErrors: errors,
  };
};

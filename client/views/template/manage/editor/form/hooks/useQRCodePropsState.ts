import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateQRCodeElementSpecPropsMutationDocument } from "../../glqDocuments/element/qrCode.documents";
import { useElementState } from "./useElementState";
import { validateQrCodePropsField } from "../element/qrcode/qrCodeValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedQRCodePropsFormState,
  QrCodePropsFormErrors,
  UpdateQRCodePropsWithElementIdFn,
  ValidateQRCodePropsFieldFn,
} from "../element/qrcode";

export type UseQRCodePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseQRCodePropsStateReturn = {
  getState: (elementId: number) => SanitizedQRCodePropsFormState | null;
  updateFn: UpdateQRCodePropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, QrCodePropsFormErrors>;
};

/**
 * Extract qrCodeProps state from QRCodeElement
 */
function extractQRCodePropsState(
  element: GQL.CertificateElementUnion
): SanitizedQRCodePropsFormState | null {
  if (element.__typename !== "QRCodeElement" || !element.qrCodeProps) {
    return null;
  }

  return {
    backgroundColor: element.qrCodeProps.backgroundColor ?? "",
    foregroundColor: element.qrCodeProps.foregroundColor ?? "",
    errorCorrection: element.qrCodeProps.errorCorrection as GQL.QrCodeErrorCorrection,
  };
}

/**
 * Convert qrCodeProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedQRCodePropsFormState
): GQL.QrCodeElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    qrCodeProps: state,
  };
}

export function useQRCodePropsState(
  params: UseQRCodePropsStateParams
): UseQRCodePropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateQRCodeElementSpecPropsMutation] = useMutation(
    updateQRCodeElementSpecPropsMutationDocument
  );

  // Get validator
  const validator: ValidateQRCodePropsFieldFn = validateQrCodePropsField();

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedQRCodePropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateQRCodeElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update QR code properties";
        logger.error("useQRCodePropsState: Mutation failed", {
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
  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractQRCodePropsState,
    mutationFn,
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}


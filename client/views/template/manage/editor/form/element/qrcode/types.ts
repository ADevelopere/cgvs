import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors, UpdateStateFn, ValidateFieldFn, UpdateStateWithElementIdFn } from "../../types";

// ============================================================================
// QR Code-specific Props State
// ============================================================================

export type QRCodePropsFormState = GQL.QrCodeElementSpecPropsInput;

// ============================================================================
// Form State Types
// ============================================================================

export type QrCodeElementFormState = GQL.QrCodeElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type QRCodePropsFormErrors = FormErrors<QRCodePropsFormState>;

export type QrCodeElementFormErrors = {
  base: BaseElementFormErrors;
  qrCodeProps: QRCodePropsFormErrors;
};

// ============================================================================
// Update and Validation Function Types
// ============================================================================

export type UpdateQRCodePropsFn = UpdateStateFn<QRCodePropsFormState>;
export type UpdateQRCodePropsWithElementIdFn = UpdateStateWithElementIdFn<QRCodePropsFormState>;

export type ValidateQRCodePropsFn = ValidateFieldFn<QRCodePropsFormState, string | undefined>;

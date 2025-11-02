import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors, UpdateStateFn, ValidateFieldFn, UpdateStateWithElementIdFn } from "../../types";

// ============================================================================
// QR Code-specific Props State
// ============================================================================

export type QrCodePropsState = GQL.QrCodeElementSpecPropsInput;
export type UpdateQrCodePropsFn = UpdateStateFn<QrCodePropsState>;

// ============================================================================
// Form State Types
// ============================================================================

export type QrCodeElementFormState = GQL.QrCodeElementInput;

// Sanitized form state (same as QrCodePropsState, no sanitization needed)
export type SanitizedQRCodePropsFormState = GQL.QrCodeElementSpecPropsInput;

// ============================================================================
// Error Types
// ============================================================================

export type QrCodePropsFormErrors = FormErrors<QrCodePropsState>;

export type QrCodeElementFormErrors = {
  base: BaseElementFormErrors;
  qrCodeProps: QrCodePropsFormErrors;
};

// ============================================================================
// Update and Validation Function Types
// ============================================================================

export type QrCodePropsFormUpdateFn = UpdateStateFn<QrCodePropsState>;
export type QrCodeElementSpecPropsValidateFn =
  ValidateFieldFn<GQL.QrCodeElementSpecPropsInput>;
export type ValidateQRCodePropsFieldFn =
  ValidateFieldFn<GQL.QrCodeElementSpecPropsInput>;
export type UpdateQRCodePropsWithElementIdFn =
  UpdateStateWithElementIdFn<GQL.QrCodeElementSpecPropsInput>;

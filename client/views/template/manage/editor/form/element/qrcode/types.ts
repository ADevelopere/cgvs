import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { FormErrors, UpdateStateFn } from "../../types";

// ============================================================================
// QR Code-specific Props State
// ============================================================================

export type QrCodePropsState = GQL.QrCodeElementSpecPropsInput;
export type UpdateQrCodePropsFn = UpdateStateFn<QrCodePropsState>;

// ============================================================================
// Form State Types
// ============================================================================

export type QrCodeElementFormState = GQL.QrCodeElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type QrCodePropsFormErrors = FormErrors<QrCodePropsState>;

export type QrCodeElementFormErrors = {
  base: BaseElementFormErrors;
  qrCodeProps: QrCodePropsFormErrors;
};

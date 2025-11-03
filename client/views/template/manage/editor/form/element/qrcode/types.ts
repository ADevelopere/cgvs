import * as GQL from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import {
  FormErrors,
  UpdateStateFn,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
  Action,
} from "../../types";

// ============================================================================
// QR Code-specific Props State
// ============================================================================

export type QRCodePropsFormState = {
  qrCodeProps: GQL.QrCodeElementSpecPropsInput;
};

export type UpdateQRCodePropsFn = UpdateStateFn<QRCodePropsFormState>;

// ============================================================================
// Form State Types
// ============================================================================

export type QrCodeElementFormState = GQL.QrCodeElementInput;

// ============================================================================
// Error Types
// ============================================================================

export type QRCodePropsFieldErrors =
  | FormErrors<GQL.QrCodeElementSpecPropsInput>

export type QRCodePropsFormErrors = {
  qrCodeProps: QRCodePropsFieldErrors;
};

export type QrCodeElementFormErrors = {
  base: BaseElementFormErrors;
  qrCodeProps: QRCodePropsFormErrors;
};

// ============================================================================
// Update and Validation Function Types
// ============================================================================

export type UpdateQRCodePropsWithElementIdFn =
  UpdateStateWithElementIdFn<QRCodePropsFormState>;

export type QRCodePropsUpdateAction = Action<QRCodePropsFormState>;

export type ValidateQRCodePropsFn = ValidateFieldFn<
  QRCodePropsFormState,
  QRCodePropsFormErrors
>;

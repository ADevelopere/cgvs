import type { CertificateElementBaseInput } from "@/client/graphql/generated/gql/graphql";
import {
  UpdateStateFn,
  FormErrors,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";

export type BaseCertificateElementFormState = CertificateElementBaseInput;

export type BaseElementFormErrors = FormErrors<CertificateElementBaseInput>;

export type SanitizedBaseElementFormState = Omit<
  BaseCertificateElementFormState,
  "templateId"
>;

export type ValidateBaseElementFieldFn =
  ValidateFieldFn<SanitizedBaseElementFormState>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<SanitizedBaseElementFormState>;

export type UpdateBaseElementWithElementIdFn =
  UpdateStateWithElementIdFn<SanitizedBaseElementFormState>;

import type { CertificateElementBaseInput } from "@/client/graphql/generated/gql/graphql";
import {
  UpdateStateFn,
  FormErrors,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";

export type SanitizedBaseElementFormState = Omit<
  CertificateElementBaseInput,
  "templateId"
>;

export type BaseCertificateElementFormState = SanitizedBaseElementFormState;

export type BaseElementFormErrors = FormErrors<BaseCertificateElementFormState>;


export type ValidateBaseElementFieldFn =
  ValidateFieldFn<BaseCertificateElementFormState, BaseElementFormErrors>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<BaseCertificateElementFormState>;

export type UpdateBaseElementWithElementIdFn =
  UpdateStateWithElementIdFn<BaseCertificateElementFormState>;

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

export type BaseElementFormErrors = FormErrors<SanitizedBaseElementFormState>;


export type ValidateBaseElementFieldFn =
  ValidateFieldFn<SanitizedBaseElementFormState>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<SanitizedBaseElementFormState>;

export type UpdateBaseElementWithElementIdFn =
  UpdateStateWithElementIdFn<SanitizedBaseElementFormState>;

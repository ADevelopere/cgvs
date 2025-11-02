import type { CertificateElementBaseInput } from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn, FormErrors, ValidateFieldFn } from "../../types";

export type BaseCertificateElementFormState = CertificateElementBaseInput;

export type BaseElementFormErrors = FormErrors<CertificateElementBaseInput>;

export type ValidateBaseElementFieldFn = ValidateFieldFn<
  Omit<BaseCertificateElementFormState, "hidden">
>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<BaseCertificateElementFormState>;

import type {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn, FormErrors } from "../types";

export type BaseCertificateElementFormState =
  | CertificateElementBaseUpdateInput
  | CertificateElementBaseCreateInput;
// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type BaseElementFormErrors = FormErrors<
  CertificateElementBaseCreateInput | CertificateElementBaseUpdateInput
>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<
  CertificateElementBaseCreateInput | CertificateElementBaseUpdateInput
>;

import type {
  CertificateElementBaseCreateInput as GQLCertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput as GQLCertificateElementBaseUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn, FormErrors, ValidateFieldFn } from "../types";

// Re-export GraphQL types for use in other modules
export type CertificateElementBaseCreateInput =
  GQLCertificateElementBaseCreateInput;
export type CertificateElementBaseUpdateInput =
  GQLCertificateElementBaseUpdateInput;

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
// VALIDATION
// ============================================================================

export const validateBaseElementField: ValidateFieldFn<
  CertificateElementBaseCreateInput | CertificateElementBaseUpdateInput
> = (key, value) => {
  switch (key) {
    case "name":
      const nameValue = value as string;
      if (!nameValue) return "Name is required";
      if (nameValue.length < 2) return "Name must be at least 2 characters";
      return undefined;
    case "description":
      const descValue = value as string;
      if (!descValue) return "Description is required";
      return undefined;
    case "width":
    case "height":
      const dimensionValue = value as number;
      if (dimensionValue === undefined || dimensionValue === null)
        return "Required";
      if (dimensionValue <= 0) return "Must be positive";
      return undefined;
    default:
      return undefined;
  }
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementCreateFn =
  UpdateStateFn<CertificateElementBaseCreateInput>;

export type UpdateBaseElementUpdateFn =
  UpdateStateFn<CertificateElementBaseUpdateInput>;

export type UpdateBaseElementFn = UpdateStateFn<
  CertificateElementBaseCreateInput | CertificateElementBaseUpdateInput
>;

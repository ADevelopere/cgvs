import type { CertificateElementBaseInput } from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn, FormErrors, ValidateFieldFn } from "../../types";

export type BaseCertificateElementFormState = CertificateElementBaseInput;

export type BaseElementFormErrors = FormErrors<CertificateElementBaseInput>;

export const validateBaseElementField: ValidateFieldFn<
  CertificateElementBaseInput
> = (key, value) => {
  switch (key) {
    case "name":
      const nameValue = value as string;
      if (!nameValue) return "Name is required";
      if (nameValue.length < 2) return "Name must be at least 2 characters";
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

export type UpdateBaseElementFn = UpdateStateFn<CertificateElementBaseInput>;

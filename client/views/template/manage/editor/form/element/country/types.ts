import type {
  CountryRepresentation,
  TextPropsCreateInput,
  TextPropsUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors, CertificateElementBaseCreateInput, CertificateElementBaseUpdateInput } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  representation: CountryRepresentation;
};

// ============================================================================
// UPDATE STATE
// ============================================================================

export type CountryElementFormUpdateState = {
  base: CertificateElementBaseUpdateInput;
  textProps: TextPropsUpdateInput;
  representation: CountryRepresentation;
};

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryRepresentationFormErrors = {
  representation?: string;
};

export type CountryElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  representation?: string;
};


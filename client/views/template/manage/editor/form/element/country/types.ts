import type {
  CertificateElementBaseInput,
  CountryRepresentation,
  TextPropsInput,
} from "@/client/graphql/generated/gql/graphql";
import { BaseElementFormErrors } from "../base/types";
import { TextPropsFormErrors } from "../textProps/types";

// ============================================================================
// CREATE STATE
// ============================================================================

export type CountryElementFormState = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  representation: CountryRepresentation;
};

// ============================================================================
// ERROR TYPES
// ============================================================================

export type CountryElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  representation?: string;
};

import {
  CertificateElementBaseInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CountryDataSourceType,
  CountryRepresentation,
} from "../output";
import { TextPropsInput, TextPropsUpdateInput } from "./textProps.input";

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSourceInput = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type CountryElementCreateInput = CertificateElementBaseInput & {
  textProps: TextPropsInput;
  representation: CountryRepresentation;
};

export type CountryElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
  representation?: CountryRepresentation | null;
};

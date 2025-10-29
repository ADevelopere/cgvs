import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CountryDataSourceType,
  CountryRepresentation,
} from "../output";
import { TextPropsCreateInput, TextPropsUpdateInput } from "./textProps.input";

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSourceInput = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type CountryElementCreateInput = CertificateElementBaseCreateInput & {
  textProps: TextPropsCreateInput;
  representation: CountryRepresentation;
};

export type CountryElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
  representation?: CountryRepresentation | null;
};

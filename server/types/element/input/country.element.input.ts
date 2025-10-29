import {
  TextPropsCreateInput,
  TextPropsUpdateInput,
} from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CountryDataSourceType,
  CountryRepresentation,
} from "../output";

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSourceInput = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// ============================================================================
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type CountryElementConfigCreateInput = {
  textProps: TextPropsCreateInput;
  representation: CountryRepresentation;
  // dataSource: CountryDataSourceInput;
};

export type CountryElementConfigUpdateInput = {
  textProps?: TextPropsUpdateInput | null;
  representation?: CountryRepresentation | null;
  // dataSource?: CountryDataSourceInput | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// create input type
export type CountryElementCreateInput = CertificateElementBaseCreateInput & {
  config: CountryElementConfigCreateInput;
};

// update input type (deep partial support)
export type CountryElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: CountryElementConfigUpdateInput | null;
};

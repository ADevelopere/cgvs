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
  ElementType,
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
  type: ElementType.COUNTRY;
  textProps: TextPropsCreateInput;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInput;
};

export type CountryElementConfigUpdateInput = {
  type: ElementType.COUNTRY;
  textProps?: TextPropsUpdateInput | null;
  representation?: CountryRepresentation | null;
  dataSource?: CountryDataSourceInput | null;
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

import { ElementType } from "./enum.element.types";
import {
  TextProps,
  TextPropsCreateInput,
  TextPropsCreateInputGraphql,
  TextPropsUpdateInput,
  TextPropsUpdateInputGraphql,
} from "./config.element.types";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

// ============================================================================
// COUNTRY-specific Enums
// ============================================================================

export enum CountryRepresentation {
  COUNTRY_NAME = "COUNTRY_NAME",
  NATIONALITY = "NATIONALITY",
}

export enum CountryDataSourceType {
  STUDENT_NATIONALITY = "STUDENT_NATIONALITY",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type CountryDataSource = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

export type CountryDataSourceInput = {
  type: CountryDataSourceType.STUDENT_NATIONALITY;
};

// GraphQL input types (used in Pothos isOneOf definitions)
export type CountryDataSourceStudentNationalityInputGraphql = Record<
  string,
  never
>;

export type CountryDataSourceInputGraphql = {
  studentNationality: CountryDataSourceStudentNationalityInputGraphql;
};

// ============================================================================
// Element Config
// ============================================================================

export interface CountryElementConfig {
  type: ElementType.COUNTRY;
  textProps: TextProps;
  representation: CountryRepresentation;
  dataSource: CountryDataSource;
  // The application uses TemplateConfig.locale to map country code to country name
}

// GraphQL input type (type field omitted - implied by mutation)

// Repository input type (matches Config structure)
export type CountryElementConfigCreateInput = {
  type: ElementType.COUNTRY;
  textProps: TextPropsCreateInput;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInput;
};

// compatible with isOneOf definitions
export type CountryElementConfigCreateInputGraphql = {
  textProps: TextPropsCreateInputGraphql;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInputGraphql;
};

export type CountryElementConfigUpdateInput = {
  type: ElementType.COUNTRY;
  textProps?: TextPropsUpdateInput | null;
  representation?: CountryRepresentation | null;
  dataSource?: CountryDataSourceInput | null;
};

// GraphQL update input type (deep partial)
export type CountryElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql | null;
  representation?: CountryRepresentation | null;
  dataSource?: CountryDataSourceInputGraphql | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// create input type
export type CountryElementCreateInput = CertificateElementBaseCreateInput & {
  config: CountryElementConfigCreateInput;
};
export type CountryElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: CountryElementConfigCreateInputGraphql;
  };

// update input type (deep partial support)
export type CountryElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: CountryElementConfigUpdateInput | null;
};

export type CountryElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: CountryElementConfigUpdateInputGraphql | null;
  };

// ============================================================================
// Pothos Definition
// ============================================================================

export type CountryElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: CountryElementConfig;
};

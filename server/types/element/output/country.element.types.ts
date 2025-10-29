import { TextProps } from "./config.element.types";
import type { CertificateElementPothosDefinition } from "../union.element.types";

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

// ============================================================================
// Element Config
// ============================================================================

export interface CountryElementConfig {
  textProps: TextProps;
  representation: CountryRepresentation;
  dataSource: CountryDataSource;
  // The application uses TemplateConfig.locale to map country code to country name
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type CountryElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: CountryElementConfig;
};

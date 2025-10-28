import { ElementType, ElementAlignment } from "./enum.element.types";
import { TextProps, TextPropsInput } from "./config.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
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

export type CountryElementConfigInput = {
  type: ElementType.COUNTRY;
  textProps: TextPropsInput;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type CountryElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: CountryElementConfigInput;
};

export type CountryElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<CountryElementConfigInput>;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type CountryElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: CountryElementConfig;
};

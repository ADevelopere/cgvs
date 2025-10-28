import { ElementType, ElementAlignment } from "./enum.element.types";
import {
  TextProps,
  TextPropsInput,
  TextPropsInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.types";
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
export type CountryElementConfigInputGraphql = {
  textProps: TextPropsInputGraphql;
  representation: CountryRepresentation;
  dataSource: CountryDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type CountryElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  representation?: CountryRepresentation;
  dataSource?: CountryDataSourceInputGraphql;
};

// Repository input type (matches Config structure)
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

// GraphQL create input type
export type CountryElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: CountryElementConfigInputGraphql;
};

// GraphQL update input type (deep partial support)
export type CountryElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: CountryElementConfigUpdateInputGraphql;
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

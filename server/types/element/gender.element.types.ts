import { ElementType } from "./enum.element.types";
import {
  TextProps,
  TextPropsCreateInput,
  TextPropsCreateInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.types";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

// ============================================================================
// GENDER-specific Enum
// ============================================================================

export enum GenderDataSourceType {
  STUDENT_GENDER = "STUDENT_GENDER",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type GenderDataSource = {
  type: GenderDataSourceType.STUDENT_GENDER;
};

export type GenderDataSourceInput = {
  type: GenderDataSourceType.STUDENT_GENDER;
};

// GraphQL input types (used in Pothos isOneOf definitions)
export type GenderDataSourceStudentGenderInputGraphql = Record<string, never>;

export type GenderDataSourceInputGraphql = {
  studentGender: GenderDataSourceStudentGenderInputGraphql;
};

// ============================================================================
// Element Config
// ============================================================================

export interface GenderElementConfig {
  type: ElementType.GENDER;
  textProps: TextProps;
  dataSource: GenderDataSource;
  // The application uses TemplateConfig.locale for mapping gender to text
}

// GraphQL input type (type field omitted - implied by mutation)
export type GenderElementConfigInputGraphql = {
  textProps: TextPropsCreateInputGraphql;
  dataSource: GenderDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type GenderElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  dataSource?: GenderDataSourceInputGraphql;
};

// Repository input type (matches Config structure)
export type GenderElementConfigInput = {
  type: ElementType.GENDER;
  textProps: TextPropsCreateInput;
  dataSource: GenderDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type GenderElementCreateInput = CertificateElementBaseCreateInput & {
  config: GenderElementConfigInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<GenderElementConfigInput>;
};

// GraphQL create input type
export type GenderElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: GenderElementConfigInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type GenderElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: GenderElementConfigUpdateInputGraphql;
  };

// ============================================================================
// Pothos Definition
// ============================================================================

export type GenderElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: GenderElementConfig;
};

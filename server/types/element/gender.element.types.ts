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
  textProps: TextPropsInputGraphql;
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
  textProps: TextPropsInput;
  dataSource: GenderDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type GenderElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: GenderElementConfigInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<GenderElementConfigInput>;
};

// GraphQL create input type
export type GenderElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: GenderElementConfigInputGraphql;
};

// GraphQL update input type (deep partial support)
export type GenderElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
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

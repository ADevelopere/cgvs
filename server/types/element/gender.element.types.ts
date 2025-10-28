import { ElementType, ElementAlignment } from "./enum.element.types";
import { TextProps, TextPropsInput } from "./config.element.types";
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

// ============================================================================
// Element Config
// ============================================================================

export interface GenderElementConfig {
  type: ElementType.GENDER;
  textProps: TextProps;
  dataSource: GenderDataSource;
  // The application uses TemplateConfig.locale for mapping gender to text
}

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

// ============================================================================
// Pothos Definition
// ============================================================================

export type GenderElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: GenderElementConfig;
};


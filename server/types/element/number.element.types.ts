import { ElementType, ElementAlignment } from "./enum.element.types";
import { TextProps, TextPropsInput } from "./config.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

// ============================================================================
// NUMBER-specific Enum
// ============================================================================

export enum NumberDataSourceType {
  TEMPLATE_NUMBER_VARIABLE = "TEMPLATE_NUMBER_VARIABLE",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type NumberDataSource = {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE;
  variableId: number;
};

export type NumberDataSourceInput = {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE;
  variableId: number;
};

// ============================================================================
// Element Config
// ============================================================================

export interface NumberElementConfig {
  type: ElementType.NUMBER;
  textProps: TextProps;
  dataSource: NumberDataSource;
  mapping: Record<string, string>; // Breakpoint-to-text rules
}

export type NumberElementConfigInput = {
  type: ElementType.NUMBER;
  textProps: TextPropsInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type NumberElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: NumberElementConfigInput;
};

export type NumberElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<NumberElementConfigInput>;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type NumberElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: NumberElementConfig;
};

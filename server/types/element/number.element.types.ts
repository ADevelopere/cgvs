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

// GraphQL input type (no discriminator needed - only 1 variant)
export type NumberDataSourceInputGraphql = {
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

// GraphQL input type (type field omitted - implied by mutation)
export type NumberElementConfigInputGraphql = {
  textProps: TextPropsInputGraphql;
  dataSource: NumberDataSourceInputGraphql;
  mapping: Record<string, string>; // StringMap scalar type
};

// GraphQL update input type (deep partial)
export type NumberElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  dataSource?: NumberDataSourceInputGraphql;
  mapping?: Record<string, string>; // StringMap scalar type
};

// Repository input type (matches Config structure)
export type NumberElementConfigInput = {
  type: ElementType.NUMBER;
  textProps: TextPropsInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type NumberElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: NumberElementConfigInputGraphql;
};

// GraphQL update input type (deep partial support)
export type NumberElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: NumberElementConfigUpdateInputGraphql;
};

// Repository input types
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
  "config"
> & {
  config: NumberElementConfig;
};

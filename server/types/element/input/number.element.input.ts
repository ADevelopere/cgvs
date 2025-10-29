import { TextPropsCreateInput } from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import { ElementType, NumberDataSourceType } from "../output";

// ============================================================================
// Data Source Types
// ============================================================================

export type NumberDataSourceInput = {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE;
  variableId: number;
};

// ============================================================================
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type NumberElementConfigInput = {
  type: ElementType.NUMBER;
  textProps: TextPropsCreateInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// Repository input types
export type NumberElementCreateInput = CertificateElementBaseCreateInput & {
  config: NumberElementConfigInput;
};

export type NumberElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<NumberElementConfigInput>;
};

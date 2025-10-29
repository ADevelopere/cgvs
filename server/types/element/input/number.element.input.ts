import { TextPropsCreateInput, TextPropsUpdateInput } from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import { NumberDataSourceType } from "../output";

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
export type NumberElementConfigCreateInput = {
  textProps: TextPropsCreateInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

export type NumberElementConfigUpdateInput = {
  textProps?: TextPropsUpdateInput | null;
  dataSource?: NumberDataSourceInput | null;
  mapping?: Record<string, string> | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// Repository input types
export type NumberElementCreateInput = CertificateElementBaseCreateInput & {
  config: NumberElementConfigCreateInput;
};

export type NumberElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: NumberElementConfigUpdateInput | null;
};

import { TextPropsInput, TextPropsUpdateInput } from "./textProps.input";
import {
  CertificateElementBaseInput,
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
// Mutation Inputs (no config field)
// ============================================================================

export type NumberElementCreateInput = CertificateElementBaseInput & {
  textProps: TextPropsInput;
  mapping: Record<string, string>;
  dataSource: NumberDataSourceInput;
};

export type NumberElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
  mapping?: Record<string, string> | null;
  dataSource?: NumberDataSourceInput | null;
};

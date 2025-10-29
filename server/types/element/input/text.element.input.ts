import { TextPropsCreateInput, TextPropsUpdateInput } from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CertificateTextField,
  StudentTextField,
  TextDataSourceType,
} from "../output";

// ============================================================================
// Data Source Types
// ============================================================================

export type TextDataSourceStaticInput = {
  type: TextDataSourceType.STATIC;
  value: string;
};

export type TextDataSourceStudentFieldInput = {
  type: TextDataSourceType.STUDENT_TEXT_FIELD;
  field: StudentTextField;
};
  
export type TextDataSourceCertificateFieldInput = {
  type: TextDataSourceType.CERTIFICATE_TEXT_FIELD;
  field: CertificateTextField;
};

export type TextDataSourceTemplateTextVariableInput = {
  type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE;
  variableId: number;
};

export type TextDataSourceTemplateSelectVariableInput = {
  type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE;
  variableId: number;
};

export type TextDataSourceInput =
  | TextDataSourceStaticInput
  | TextDataSourceStudentFieldInput
  | TextDataSourceCertificateFieldInput
  | TextDataSourceTemplateTextVariableInput
  | TextDataSourceTemplateSelectVariableInput;

// ============================================================================
// Element Config
// ============================================================================

export type TextElementConfigCreateInput = {
  textProps: TextPropsCreateInput;
  dataSource: TextDataSourceInput;
};

export type TextElementConfigUpdateInput = {
  textProps?: TextPropsUpdateInput | null;
  dataSource?: TextDataSourceInput | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type TextElementCreateInput = CertificateElementBaseCreateInput & {
  config: TextElementConfigCreateInput;
};

export type TextElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: TextElementConfigUpdateInput | null;
};

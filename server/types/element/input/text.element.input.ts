import { TextPropsInput } from "./textProps.input";
import { CertificateElementBaseInput } from "./base.element.input";
import {
  CertificateTextField,
  StudentTextField,
  TextDataSourceType,
} from "../output";
import { textElement } from "@/server/db/schema";

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
// Mutation Inputs (no config field)
// ============================================================================

export type TextElementEntityInput = typeof textElement.$inferInsert;
export type TextElementTextPropsInput = Omit<
  TextElementEntityInput,
  "elementId" | "textPropsId" | "variableId" | "textDataSource"
>;

export type TextElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  dataSource: TextDataSourceInput;
};

export type TextElementUpdateInput = TextElementInput & {
  id: number;
};

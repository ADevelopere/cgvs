import { ElementType, ElementAlignment } from "./enum.element.types";
import {
  TextProps,
  TextPropsInput,
  TextPropsInputGraphql,
} from "./config.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

// ============================================================================
// TEXT-specific Enums
// ============================================================================

export enum TextDataSourceType {
  STATIC = "STATIC",
  TEMPLATE_TEXT_VARIABLE = "TEMPLATE_TEXT_VARIABLE",
  TEMPLATE_SELECT_VARIABLE = "TEMPLATE_SELECT_VARIABLE",
  STUDENT_TEXT_FIELD = "STUDENT_TEXT_FIELD",
  CERTIFICATE_TEXT_FIELD = "CERTIFICATE_TEXT_FIELD",
}

export enum StudentTextField {
  STUDENT_NAME = "STUDENT_NAME",
  STUDENT_EMAIL = "STUDENT_EMAIL",
}

export enum CertificateTextField {
  VERIFICATION_CODE = "VERIFICATION_CODE",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type TextDataSource =
  | { type: TextDataSourceType.STATIC; value: string }
  | {
      type: TextDataSourceType.STUDENT_TEXT_FIELD;
      field: StudentTextField;
    }
  | {
      type: TextDataSourceType.CERTIFICATE_TEXT_FIELD;
      field: CertificateTextField;
    }
  | {
      type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE;
      variableId: number;
    }
  | {
      type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE;
      variableId: number;
    };

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

export interface TextElementConfig {
  type: ElementType.TEXT;
  textProps: TextProps;
  dataSource: TextDataSource;
}

// GraphQL input type
export type TextElementConfigInputGraphql = {
  type: ElementType.TEXT;
  textProps: TextPropsInputGraphql;
  dataSource: TextDataSourceInput;
};

// Repository input type (matches Config structure)
export type TextElementConfigInput = {
  type: ElementType.TEXT;
  textProps: TextPropsInput;
  dataSource: TextDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type TextElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: TextElementConfigInput;
};

export type TextElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<TextElementConfigInput>;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type TextElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: TextElementConfig;
};

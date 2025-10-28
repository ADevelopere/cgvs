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

// GraphQL input types (used in Pothos isOneOf definitions)
export type TextDataSourceStaticInputGraphql = {
  value: string;
};

export type TextDataSourceStudentFieldInputGraphql = {
  field: StudentTextField;
};

export type TextDataSourceCertificateFieldInputGraphql = {
  field: CertificateTextField;
};

export type TextDataSourceTemplateTextVariableInputGraphql = {
  variableId: number;
};

export type TextDataSourceTemplateSelectVariableInputGraphql = {
  variableId: number;
};

export type TextDataSourceInputGraphql =
  | {
      static: TextDataSourceStaticInputGraphql;
      studentField?: never;
      certificateField?: never;
      templateTextVariable?: never;
      templateSelectVariable?: never;
    }
  | {
      studentField: TextDataSourceStudentFieldInputGraphql;
      static?: never;
      certificateField?: never;
      templateTextVariable?: never;
      templateSelectVariable?: never;
    }
  | {
      certificateField: TextDataSourceCertificateFieldInputGraphql;
      static?: never;
      studentField?: never;
      templateTextVariable?: never;
      templateSelectVariable?: never;
    }
  | {
      templateTextVariable: TextDataSourceTemplateTextVariableInputGraphql;
      static?: never;
      studentField?: never;
      certificateField?: never;
      templateSelectVariable?: never;
    }
  | {
      templateSelectVariable: TextDataSourceTemplateSelectVariableInputGraphql;
      static?: never;
      studentField?: never;
      certificateField?: never;
      templateTextVariable?: never;
    };

// ============================================================================
// Element Config
// ============================================================================

export interface TextElementConfig {
  type: ElementType.TEXT;
  textProps: TextProps;
  dataSource: TextDataSource;
}

// GraphQL input type (type field omitted - implied by mutation)
export type TextElementConfigInputGraphql = {
  textProps: TextPropsInputGraphql;
  dataSource: TextDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type TextElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  dataSource?: TextDataSourceInputGraphql;
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

// GraphQL create input type
export type TextElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: TextElementConfigInputGraphql;
};

export type TextElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<TextElementConfigInput>;
};

// GraphQL update input type (deep partial support)
export type TextElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: TextElementConfigUpdateInputGraphql;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type TextElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: TextElementConfig;
};

import { ElementConfigBase } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "../union.element.types";

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

// ============================================================================
// Element Config
// ============================================================================

export type TextElementConfig = ElementConfigBase & {
  dataSource: TextDataSource;
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

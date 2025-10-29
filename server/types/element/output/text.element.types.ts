import type { CertificateElementEntity } from "./base.element.types";
import type { TextProps } from "./config.element.types";
import type { textElement } from "@/server/db/schema";

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
      studentField: StudentTextField;
    }
  | {
      type: TextDataSourceType.CERTIFICATE_TEXT_FIELD;
      certificateField: CertificateTextField;
    }
  | {
      type: TextDataSourceType.TEMPLATE_TEXT_VARIABLE;
      textVariableId: number;
    }
  | {
      type: TextDataSourceType.TEMPLATE_SELECT_VARIABLE;
      selectVariableId: number;
    };

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type TextElementEntity = typeof textElement.$inferSelect;
// { elementId, textPropsId, dataSource, variableId }

// ============================================================================
// Output Type (mirrors database - base + text_element + element_text_props joined)
// ============================================================================

export type TextElementOutput = CertificateElementEntity & {
  // From element_text_props table (joined)
  textProps: TextProps;
  
  // From text_element table
  dataSource: TextDataSource;
  variableId: number | null;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type TextElementPothosDefinition = TextElementOutput;

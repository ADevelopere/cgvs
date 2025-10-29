import type { CertificateElementEntity } from "./base.element.types";
import type { TextProps } from "./config.element.types";
import type { dateElement } from "@/server/db/schema";

// ============================================================================
// DATE-specific Enums
// ============================================================================

export enum DateDataSourceType {
  STATIC = "STATIC",
  TEMPLATE_DATE_VARIABLE = "TEMPLATE_DATE_VARIABLE",
  STUDENT_DATE_FIELD = "STUDENT_DATE_FIELD",
  CERTIFICATE_DATE_FIELD = "CERTIFICATE_DATE_FIELD",
}

export enum StudentDateField {
  DATE_OF_BIRTH = "DATE_OF_BIRTH",
}

export enum CertificateDateField {
  RELEASE_DATE = "RELEASE_DATE",
}

export enum CalendarType {
  GREGORIAN = "GREGORIAN",
  HIJRI = "HIJRI",
}

export enum DateTransformationType {
  AGE_CALCULATION = "AGE_CALCULATION",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type DateDataSource =
  | { type: DateDataSourceType.STATIC; value: string }
  | {
      type: DateDataSourceType.STUDENT_DATE_FIELD;
      studentField: StudentDateField;
    }
  | {
      type: DateDataSourceType.CERTIFICATE_DATE_FIELD;
      certificateField: CertificateDateField;
    }
  | {
      type: DateDataSourceType.TEMPLATE_DATE_VARIABLE;
      dateVariableId: number;
    };

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type DateElementEntity = typeof dateElement.$inferSelect;
// { elementId, textPropsId, calendarType, offsetDays, format, transformation, dataSource, variableId }

// ============================================================================
// Output Type (mirrors database - base + date_element + element_text_props joined)
// ============================================================================

export type DateElementOutput = CertificateElementEntity & {
  // From element_text_props (joined)
  textProps: TextProps;
  
  // From date_element table
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation: DateTransformationType | null;
  dataSource: DateDataSource;
  variableId: number | null;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type DateElementPothosDefinition = DateElementOutput;

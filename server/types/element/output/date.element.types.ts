import {
  TextProps,
} from "./config.element.types";

import type { CertificateElementPothosDefinition } from "../union.element.types";

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
      field: StudentDateField;
    }
  | {
      type: DateDataSourceType.CERTIFICATE_DATE_FIELD;
      field: CertificateDateField;
    }
  | {
      type: DateDataSourceType.TEMPLATE_DATE_VARIABLE;
      variableId: number;
    };

// ============================================================================
// Element Config
// ============================================================================

export interface DateElementConfig {
  textProps: TextProps;
  calendarType: CalendarType;
  offsetDays: number;
  format: string; // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  transformation?: DateTransformationType | null;
  dataSource: DateDataSource;
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type DateElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: DateElementConfig;
};

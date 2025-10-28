import { ElementType, ElementAlignment } from "./enum.element.types";
import { TextProps, TextPropsInput } from "./config.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

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

export type DateDataSourceStaticInput = {
  type: DateDataSourceType.STATIC;
  value: string;
};

export type DateDataSourceStudentFieldInput = {
  type: DateDataSourceType.STUDENT_DATE_FIELD;
  field: StudentDateField;
};

export type DateDataSourceCertificateFieldInput = {
  type: DateDataSourceType.CERTIFICATE_DATE_FIELD;
  field: CertificateDateField;
};

export type DateDataSourceTemplateVariableInput = {
  type: DateDataSourceType.TEMPLATE_DATE_VARIABLE;
  variableId: number;
};

export type DateDataSourceInput =
  | DateDataSourceStaticInput
  | DateDataSourceStudentFieldInput
  | DateDataSourceCertificateFieldInput
  | DateDataSourceTemplateVariableInput;

// ============================================================================
// Element Config
// ============================================================================

export interface DateElementConfig {
  type: ElementType.DATE;
  textProps: TextProps;
  calendarType: CalendarType;
  offsetDays: number;
  format: string; // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  mapping?: Record<string, string>; // Custom date component mappings (e.g., month names)
  dataSource: DateDataSource;
}

export type DateElementConfigInput = {
  type: ElementType.DATE;
  textProps: TextPropsInput;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  mapping?: Record<string, string> | null;
  dataSource: DateDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type DateElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: DateElementConfigInput;
};

export type DateElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<DateElementConfigInput>;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type DateElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "parsedConfig"
> & {
  parsedConfig: DateElementConfig;
};


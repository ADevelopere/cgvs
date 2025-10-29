import { TextPropsCreateInput } from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CalendarType,
  CertificateDateField,
  DateDataSourceType,
  DateTransformationType,
  ElementType,
  StudentDateField,
} from "../output";

// ============================================================================
// Data Source Types
// ============================================================================

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

// Repository input type (matches Config structure)
export type DateElementConfigInput = {
  type: ElementType.DATE;
  textProps: TextPropsCreateInput;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation?: DateTransformationType | null;
  dataSource: DateDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type DateElementCreateInput = CertificateElementBaseCreateInput & {
  config: DateElementConfigInput;
};

export type DateElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<DateElementConfigInput> | null;
};

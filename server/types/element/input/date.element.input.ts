import { TextPropsCreateInput, TextPropsUpdateInput } from "./textProps.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import {
  CalendarType,
  CertificateDateField,
  DateDataSourceType,
  DateTransformationType,
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
// Mutation Inputs
// ============================================================================

export type DatePropsCreateInput = {
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation?: DateTransformationType | null;
};

export type DatePropsUpdateInput = {
  calendarType?: CalendarType | null;
  offsetDays?: number | null;
  format?: string | null;
  transformation?: DateTransformationType | null;
};

export type DateElementCreateInput = CertificateElementBaseCreateInput & {
  textProps: TextPropsCreateInput;
  dataSource: DateDataSourceInput;
  dateProps: DatePropsCreateInput;
};

export type DateElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
  dataSource?: DateDataSourceInput | null;
  dateProps?: DatePropsUpdateInput | null;
};

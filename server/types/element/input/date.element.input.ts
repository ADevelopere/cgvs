import {
  TextPropsCreateInput,
  TextPropsUpdateInput,
} from "./config.element.input";
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
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type DateElementConfigCreateInput = {
  textProps: TextPropsCreateInput;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation?: DateTransformationType | null;
  dataSource: DateDataSourceInput;
};

export type DateElementConfigUpdateInput = {
  textProps?: TextPropsUpdateInput | null;
  calendarType?: CalendarType | null;
  offsetDays?: number | null;
  format?: string | null;
  transformation?: DateTransformationType | null;
  dataSource?: DateDataSourceInput | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type DateElementCreateInput = CertificateElementBaseCreateInput & {
  config: DateElementConfigCreateInput;
};

export type DateElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: DateElementConfigUpdateInput | null;
};

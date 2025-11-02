import { TextPropsInput } from "./textProps.input";
import { CertificateElementBaseInput } from "./base.element.input";
import {
  CalendarType,
  CertificateDateField,
  DateDataSourceType,
  DateTransformationType,
  StudentDateField,
} from "../output";
import { dateElement } from "@/server/db/schema";

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

export type DateDataSourceStandaloneInput = {
  elementId: number;
  dataSource: DateDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================
export type DateElementEntityInput = typeof dateElement.$inferInsert;
export type DateElementSpecPropsInput = {
  format: string;
  calendarType: CalendarType;
  offsetDays?: number | null;
  transformation?: DateTransformationType | null;
};

export type DateElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  dataSource: DateDataSourceInput;
  dateProps: DateElementSpecPropsInput;
};

export type DateElementUpdateInput = DateElementInput & {
  id: number;
};

export type DateElementSpecPropsStandaloneInput = {
  elementId: number;
  dateProps: DateElementSpecPropsInput;
};
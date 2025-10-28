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

// GraphQL input types (used in Pothos isOneOf definitions)
export type DateDataSourceStaticInputGraphql = {
  value: string;
};

export type DateDataSourceStudentFieldInputGraphql = {
  field: StudentDateField;
};

export type DateDataSourceCertificateFieldInputGraphql = {
  field: CertificateDateField;
};

export type DateDataSourceTemplateVariableInputGraphql = {
  variableId: number;
};

export type DateDataSourceInputGraphql =
  | {
      static: DateDataSourceStaticInputGraphql;
      studentField?: never;
      certificateField?: never;
      templateVariable?: never;
    }
  | {
      studentField: DateDataSourceStudentFieldInputGraphql;
      static?: never;
      certificateField?: never;
      templateVariable?: never;
    }
  | {
      certificateField: DateDataSourceCertificateFieldInputGraphql;
      static?: never;
      studentField?: never;
      templateVariable?: never;
    }
  | {
      templateVariable: DateDataSourceTemplateVariableInputGraphql;
      static?: never;
      studentField?: never;
      certificateField?: never;
    };

// ============================================================================
// Element Config
// ============================================================================

export interface DateElementConfig {
  type: ElementType.DATE;
  textProps: TextProps;
  calendarType: CalendarType;
  offsetDays: number;
  format: string; // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  transformation?: DateTransformationType | null;
  dataSource: DateDataSource;
}

// GraphQL input type (type field omitted - implied by mutation)
export type DateElementConfigInputGraphql = {
  textProps: TextPropsInputGraphql;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation?: DateTransformationType | null;
  dataSource: DateDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type DateElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql;
  calendarType?: CalendarType;
  offsetDays?: number;
  format?: string;
  transformation?: DateTransformationType | null;
  dataSource?: DateDataSourceInputGraphql;
};

// Repository input type (matches Config structure)
export type DateElementConfigInput = {
  type: ElementType.DATE;
  textProps: TextPropsInput;
  calendarType: CalendarType;
  offsetDays: number;
  format: string;
  transformation?: DateTransformationType | null;
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

// GraphQL create input type
export type DateElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: DateElementConfigInputGraphql;
};

// GraphQL update input type (deep partial support)
export type DateElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: DateElementConfigUpdateInputGraphql;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type DateElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: DateElementConfig;
};

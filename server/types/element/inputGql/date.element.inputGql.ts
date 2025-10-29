import { CertificateElementBaseCreateInput, CertificateElementBaseUpdateInput } from "../input";
import { CalendarType, CertificateDateField, DateTransformationType, StudentDateField } from "../output";
import {
  TextPropsCreateInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.inputGql";


// ============================================================================
// Data Source Types
// ============================================================================

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
      studentField?: never | null;
      certificateField?: never | null;
      templateVariable?: never | null;
    }
  | {
      studentField: DateDataSourceStudentFieldInputGraphql;
      static?: never | null;
      certificateField?: never | null;
      templateVariable?: never | null;
    }
  | {
      certificateField: DateDataSourceCertificateFieldInputGraphql;
      static?: never | null;
      studentField?: never | null;
      templateVariable?: never | null;
    }
  | {
      templateVariable: DateDataSourceTemplateVariableInputGraphql;
      static?: never | null;
      studentField?: never | null;
      certificateField?: never | null;
    };

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type DateElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    textProps: TextPropsCreateInputGraphql;
    calendarType: CalendarType;
    offsetDays: number;
    format: string;
    transformation?: DateTransformationType | null;
    dataSource: DateDataSourceInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type DateElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    textProps?: TextPropsUpdateInputGraphql | null;
    calendarType?: CalendarType | null;
    offsetDays?: number | null;
    format?: string | null;
    transformation?: DateTransformationType | null;
    dataSource?: DateDataSourceInputGraphql | null;
  };

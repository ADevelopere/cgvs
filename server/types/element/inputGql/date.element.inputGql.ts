import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
  DatePropsCreateInput,
  DatePropsUpdateInput,
} from "../input";
import { CertificateDateField, StudentDateField } from "../output";
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
    dataSource: DateDataSourceInputGraphql;
    dateProps: DatePropsCreateInput;
  };

// GraphQL update input type (deep partial support)
export type DateElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    textProps?: TextPropsUpdateInputGraphql | null;
    dataSource?: DateDataSourceInputGraphql | null;
    dateProps?: DatePropsUpdateInput | null;
  };

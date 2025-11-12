import { CertificateElementBaseInput, DateElementSpecPropsInput } from "../input";
import { CertificateDateField, StudentDateField } from "../output";
import { TextPropsInputGraphql } from "./config.element.inputGql";

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
      studentField?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateVariable?: never | null | undefined;
    }
  | {
      studentField: DateDataSourceStudentFieldInputGraphql;
      static?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateVariable?: never | null | undefined;
    }
  | {
      certificateField: DateDataSourceCertificateFieldInputGraphql;
      static?: never | null | undefined;
      studentField?: never | null | undefined;
      templateVariable?: never | null | undefined;
    }
  | {
      templateVariable: DateDataSourceTemplateVariableInputGraphql;
      static?: never | null | undefined;
      studentField?: never | null | undefined;
      certificateField?: never | null | undefined;
    };

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type DateElementInputGraphql = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInputGraphql;
  dataSource: DateDataSourceInputGraphql;
  dateProps: DateElementSpecPropsInput;
};

// GraphQL update input type (deep partial support)
export type DateElementUpdateInputGraphql = DateElementInputGraphql & {
  id: number;
};

export type DateDataSourceStandaloneInputGraphql = {
  elementId: number;
  dataSource: DateDataSourceInputGraphql;
};

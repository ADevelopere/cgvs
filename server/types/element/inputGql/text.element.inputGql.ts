import { CertificateElementBaseInput } from "../input";
import { CertificateTextField, StudentTextField } from "../output";
import { TextPropsInputGraphql } from "./config.element.inputGql";

// ============================================================================
// Data Source Types
// ============================================================================

// GraphQL input types (used in Pothos isOneOf definitions)
export type TextDataSourceStaticInputGraphql = {
  value: string;
};

export type TextDataSourceStudentFieldInputGraphql = {
  field: StudentTextField;
};

export type TextDataSourceCertificateFieldInputGraphql = {
  field: CertificateTextField;
};

export type TextDataSourceTemplateTextVariableInputGraphql = {
  variableId: number;
};

export type TextDataSourceTemplateSelectVariableInputGraphql = {
  variableId: number;
};

export type TextDataSourceInputGraphql =
  | {
      static: TextDataSourceStaticInputGraphql;
      studentField?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateTextVariable?: never | null | undefined;
      templateSelectVariable?: never | null | undefined;
    }
  | {
      studentField: TextDataSourceStudentFieldInputGraphql;
      static?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateTextVariable?: never | null | undefined;
      templateSelectVariable?: never | null | undefined;
    }
  | {
      certificateField: TextDataSourceCertificateFieldInputGraphql;
      static?: never | null | undefined;
      studentField?: never | null | undefined;
      templateTextVariable?: never | null | undefined;
      templateSelectVariable?: never | null | undefined;
    }
  | {
      templateTextVariable: TextDataSourceTemplateTextVariableInputGraphql;
      static?: never | null | undefined;
      studentField?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateSelectVariable?: never | null | undefined;
    }
  | {
      templateSelectVariable: TextDataSourceTemplateSelectVariableInputGraphql;
      static?: never | null | undefined;
      studentField?: never | null | undefined;
      certificateField?: never | null | undefined;
      templateTextVariable?: never | null | undefined;
    };

// ============================================================================
// Mutation Inputs
// ============================================================================

export type TextDataSourceStandaloneInputGraphql = {
  elementId: number;
  dataSource: TextDataSourceInputGraphql;
};

// GraphQL create input type
export type TextElementInputGraphql = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInputGraphql;
  dataSource: TextDataSourceInputGraphql;
};

// GraphQL update input type
export type TextElementUpdateInputGraphql = TextElementInputGraphql & {
  id: number;
};

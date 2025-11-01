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
      studentField?: never | null;
      certificateField?: never | null;
      templateTextVariable?: never | null;
      templateSelectVariable?: never | null;
    }
  | {
      studentField: TextDataSourceStudentFieldInputGraphql;
      static?: never | null;
      certificateField?: never | null;
      templateTextVariable?: never | null;
      templateSelectVariable?: never | null;
    }
  | {
      certificateField: TextDataSourceCertificateFieldInputGraphql;
      static?: never | null;
      studentField?: never | null;
      templateTextVariable?: never | null;
      templateSelectVariable?: never | null;
    }
  | {
      templateTextVariable: TextDataSourceTemplateTextVariableInputGraphql;
      static?: never | null;
      studentField?: never | null;
      certificateField?: never | null;
      templateSelectVariable?: never | null;
    }
  | {
      templateSelectVariable: TextDataSourceTemplateSelectVariableInputGraphql;
      static?: never | null;
      studentField?: never | null;
      certificateField?: never | null;
      templateTextVariable?: never | null;
    };

// ============================================================================
// Mutation Inputs
// ============================================================================

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

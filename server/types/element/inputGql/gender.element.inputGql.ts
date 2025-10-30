import {
  CertificateElementBaseInput,
  CertificateElementBaseUpdateInput,
} from "../input";
import {
  TextPropsInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.inputGql";

// ============================================================================
// Data Source Types
// ============================================================================

// GraphQL input types (used in Pothos isOneOf definitions)
export type GenderDataSourceStudentGenderInputGraphql = Record<string, never>;

export type GenderDataSourceInputGraphql = {
  studentGender: GenderDataSourceStudentGenderInputGraphql;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type GenderElementCreateInputGraphql =
  CertificateElementBaseInput & {
    textProps: TextPropsInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type GenderElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    textProps?: TextPropsUpdateInputGraphql | null;
  };
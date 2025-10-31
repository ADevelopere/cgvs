import { CertificateElementBaseInput } from "../input";
import { TextPropsInputGraphql } from "./config.element.inputGql";

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
export type GenderElementInputGraphql = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInputGraphql;
};

// GraphQL update input type
export type GenderElementUpdateInputGraphql = GenderElementInputGraphql & {
  id: number;
};

import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "../input";
import {
  TextPropsCreateInputGraphql,
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
// Element Config
// ============================================================================

// GraphQL input type (type field omitted - implied by mutation)
export type GenderElementConfigInputGraphql = {
  textProps: TextPropsCreateInputGraphql;
  dataSource: GenderDataSourceInputGraphql;
};

// GraphQL update input type (deep partial)
export type GenderElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql | null;
  dataSource?: GenderDataSourceInputGraphql | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type GenderElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: GenderElementConfigInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type GenderElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: GenderElementConfigUpdateInputGraphql | null;
  };
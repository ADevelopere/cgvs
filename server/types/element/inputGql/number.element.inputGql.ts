import { CertificateElementBaseCreateInput, CertificateElementBaseUpdateInput } from "../input";
import {

  TextPropsCreateInputGraphql,
  TextPropsUpdateInputGraphql,
} from "./config.element.inputGql";


// ============================================================================
// Data Source Types
// ============================================================================


// GraphQL input type (no discriminator needed - only 1 variant)
export type NumberDataSourceInputGraphql = {
  variableId: number;
};

// ============================================================================
// Element Config
// ============================================================================

// GraphQL input type (type field omitted - implied by mutation)
export type NumberElementConfigInputGraphql = {
  textProps: TextPropsCreateInputGraphql;
  dataSource: NumberDataSourceInputGraphql;
  mapping: Record<string, string>; // StringMap scalar type
};

// GraphQL update input type (deep partial)
export type NumberElementConfigUpdateInputGraphql = {
  textProps?: TextPropsUpdateInputGraphql | null;
  dataSource?: NumberDataSourceInputGraphql | null;
  mapping?: Record<string, string> | null; // StringMap scalar type
};


// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type NumberElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: NumberElementConfigInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type NumberElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: NumberElementConfigUpdateInputGraphql | null;
  };
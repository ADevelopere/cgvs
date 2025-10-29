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
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type NumberElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    textProps: TextPropsCreateInputGraphql;
    mapping: Record<string, string>; // StringMap scalar type
    dataSource: NumberDataSourceInputGraphql;
  };

// GraphQL update input type (deep partial support)
export type NumberElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    textProps?: TextPropsUpdateInputGraphql | null;
    mapping?: Record<string, string> | null; // StringMap scalar type
    dataSource?: NumberDataSourceInputGraphql | null;
  };
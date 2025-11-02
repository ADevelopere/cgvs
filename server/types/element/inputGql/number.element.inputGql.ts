import {
  CertificateElementBaseInput,
  NumberElementSpecPropsInput,
} from "../input";
import { TextPropsInputGraphql } from "./config.element.inputGql";

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
export type NumberElementInputGraphql = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInputGraphql;
  numberProps: NumberElementSpecPropsInput;
  dataSource: NumberDataSourceInputGraphql;
};

// GraphQL update input type
export type NumberElementUpdateInputGraphql = NumberElementInputGraphql & {
  id: number;
};

export type NumberElementDataSourceStandaloneUpdateInputGraphql = {
  elementId: number;
  dataSource: NumberDataSourceInputGraphql;
};
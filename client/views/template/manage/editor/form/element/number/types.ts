import type {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
  NumberDataSource,
  NumberDataSourceInput,
  TextPropsCreateInput,
  TextPropsUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { FormErrors } from "../types";
import { TextPropsFormErrors, TextPropsState } from "../textProps";
import {
  BaseCertificateElementFormState,
  BaseElementFormErrors,
} from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

// Complete number element working state
export type NumberElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsState;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

export type NumberElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

export type NumberElementFormUpdateState = {
  base: CertificateElementBaseUpdateInput;
  textProps: TextPropsUpdateInput;
  dataSource: NumberDataSourceInput;
  mapping: Record<string, string>;
};

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DataSourceFormErrors = FormErrors<NumberDataSourceInput>;
export type MappingFormErrors = { [key: string]: string };

export type NumberElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
  mapping: MappingFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDataSourceFn = (dataSource: NumberDataSourceInput) => void;
export type UpdateMappingFn = (mapping: Record<string, string>) => void;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert Output type (from GraphQL queries) to Input type (for forms)
export const numberDataSourceToGraphQL = (
  state: NumberDataSource
): NumberDataSourceInput => {
  return { variableId: state.numberVariableId ?? 0 };
};


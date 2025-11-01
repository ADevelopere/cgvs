import type {
  NumberDataSourceInput,
  NumberElementInput,
} from "@/client/graphql/generated/gql/graphql";
import { FormErrors } from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

// Complete number element working state
export type NumberElementFormState = NumberElementInput;

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

import { TextPropsInput, TextPropsUpdateInput } from "./textProps.input";
import {
  CertificateElementBaseInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import { GenderDataSourceType } from "../output";

// ============================================================================
// Data Source Types
// ============================================================================

export type GenderDataSourceInput = {
  type: GenderDataSourceType.STUDENT_GENDER;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type GenderElementCreateInput = CertificateElementBaseInput & {
  textProps: TextPropsInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
};

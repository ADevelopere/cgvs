import { TextPropsCreateInput, TextPropsUpdateInput } from "../output";
import {
  CertificateElementBaseCreateInput,
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

export type GenderElementCreateInput = CertificateElementBaseCreateInput & {
  textProps: TextPropsCreateInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  textProps?: TextPropsUpdateInput | null;
};

import { TextPropsCreateInput, TextPropsUpdateInput } from "./config.element.input";
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
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type GenderElementConfigCreateInput = {
  textProps: TextPropsCreateInput;
  dataSource: GenderDataSourceInput;
};

export type GenderElementConfigUpdateInput = {
  textProps?: TextPropsUpdateInput | null;
  dataSource?: GenderDataSourceInput | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type GenderElementCreateInput = CertificateElementBaseCreateInput & {
  config: GenderElementConfigCreateInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: GenderElementConfigUpdateInput | null;
};

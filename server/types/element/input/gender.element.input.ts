import { TextPropsCreateInput } from "./config.element.input";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";
import { ElementType, GenderDataSourceType } from "../output";
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
export type GenderElementConfigInput = {
  type: ElementType.GENDER;
  textProps: TextPropsCreateInput;
  dataSource: GenderDataSourceInput;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type GenderElementCreateInput = CertificateElementBaseCreateInput & {
  config: GenderElementConfigInput;
};

export type GenderElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<GenderElementConfigInput>;
};

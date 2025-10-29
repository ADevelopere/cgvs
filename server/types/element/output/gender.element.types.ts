import { TextProps } from "./config.element.types";
import type { CertificateElementPothosDefinition } from "../union.element.types";

// ============================================================================
// GENDER-specific Enum
// ============================================================================

export enum GenderDataSourceType {
  STUDENT_GENDER = "STUDENT_GENDER",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type GenderDataSource = {
  type: GenderDataSourceType.STUDENT_GENDER;
};

// ============================================================================
// Element Config
// ============================================================================

export interface GenderElementConfig {
  textProps: TextProps;
  dataSource: GenderDataSource;
  // The application uses TemplateConfig.locale for mapping gender to text
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type GenderElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: GenderElementConfig;
};

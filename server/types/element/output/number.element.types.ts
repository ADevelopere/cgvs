import { TextProps } from "./config.element.types";
import type { CertificateElementPothosDefinition } from "../union.element.types";

// ============================================================================
// NUMBER-specific Enum
// ============================================================================

export enum NumberDataSourceType {
  TEMPLATE_NUMBER_VARIABLE = "TEMPLATE_NUMBER_VARIABLE",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type NumberDataSource = {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE;
  variableId: number;
};

// ============================================================================
// Element Config
// ============================================================================

export interface NumberElementConfig {
  textProps: TextProps;
  dataSource: NumberDataSource;
  mapping: Record<string, string>; // Breakpoint-to-text rules
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type NumberElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: NumberElementConfig;
};

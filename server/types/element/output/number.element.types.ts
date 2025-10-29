import type { CertificateElementEntity } from "./base.element.types";
import type { TextProps, ElementTextPropsEntity } from "./config.element.types";
import type { numberElement } from "@/server/db/schema";

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
  numberVariableId: number;
};

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type NumberElementEntity = typeof numberElement.$inferSelect;
// { elementId, textPropsId, mapping, dataSource, variableId }

// ============================================================================
// Output Type (mirrors database - base + number_element + element_text_props joined)
// ============================================================================

export type NumberElementOutput = CertificateElementEntity & NumberElementEntity & {
  // From element_text_props (joined)
  textPropsEntity: ElementTextPropsEntity;
  textProps: TextProps;
  
  // Type overrides to use proper types
  mapping: Record<string, string>;
  dataSource: NumberDataSource;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type NumberElementPothosDefinition = NumberElementOutput;

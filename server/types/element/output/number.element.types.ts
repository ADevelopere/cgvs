import type { CertificateElementEntity } from "./base.element.types";
import type { ElementTextPropsEntity } from "./config.element.types";
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
// { elementId, textPropsId, mapping, numberDataSource, variableId }

// ============================================================================
// Output Type (mirrors database - base + number_element + element_text_props joined)
// ============================================================================

export type NumberElementSpecProps = Omit<
  NumberElementEntity,
  "numberDataSource"
>;

export type NumberElementOutput = {
  base: CertificateElementEntity;
  textPropsEntity: ElementTextPropsEntity;
  numberProps: NumberElementSpecProps;
  numberDataSource: NumberDataSource;
};

export type NumberElementSpecPropsUpdateResponse = {
  elementId: number;
  numberProps: NumberElementSpecProps;
};

export type NumberElementDataSourceUpdateResponse = {
  elementId: number;
  numberDataSource: NumberDataSource;
};

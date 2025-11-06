import { TextPropsInput } from "./textProps.input";
import { CertificateElementBaseInput } from "./base.element.input";
import { NumberDataSourceType } from "../output";
import { numberElement } from "@/server/db/schema";

// ============================================================================
// Data Source Types
// ============================================================================

export type NumberDataSourceInput = {
  type: NumberDataSourceType.TEMPLATE_NUMBER_VARIABLE;
  variableId: number;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type NumberElementEntityInput = typeof numberElement.$inferInsert;
export type NumberElementSpecPropsInput = Omit<
  NumberElementEntityInput,
  "elementId" | "textPropsId" | "variableId" | "numberDataSource"
>;

export type NumberElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  numberProps: NumberElementSpecPropsInput;
  dataSource: NumberDataSourceInput;
};

export type NumberElementUpdateInput = NumberElementInput & {
  id: number;
};

export type NumberElementDataSourceStandaloneUpdateInput = {
  elementId: number;
  dataSource: NumberDataSourceInput;
};

export type NumberElementSpecPropsStandaloneUpdateInput = {
  elementId: number;
  numberProps: NumberElementSpecPropsInput;
};

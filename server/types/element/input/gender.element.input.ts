import { TextPropsInput } from "./textProps.input";
import { CertificateElementBaseInput } from "./base.element.input";
import { GenderDataSourceType } from "../output";
import { genderElement } from "@/server/db/schema";

// ============================================================================
// Data Source Types
// ============================================================================

export type GenderDataSourceInput = {
  type: GenderDataSourceType.STUDENT_GENDER;
};

// ============================================================================
// Mutation Inputs (no config field)
// ============================================================================

export type GenderElementEntityInput = typeof genderElement.$inferInsert;
export type GenderElementSpecPropsInput = Omit<
  GenderElementEntityInput,
  "elementId" | "textPropsId"
>;

export type GenderElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
  dataSource: GenderDataSourceInput;
  // genderProps: GenderElementSpecPropsInput;
};

export type GenderElementUpdateInput = GenderElementInput & {
  id: number;
};

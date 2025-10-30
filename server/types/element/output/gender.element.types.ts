import type { CertificateElementEntity } from "./base.element.types";
import type { ElementTextPropsEntity } from "./config.element.types";
import type { genderElement } from "@/server/db/schema";

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
// Raw Entity (from Drizzle schema)
// ============================================================================

export type GenderElementEntity = typeof genderElement.$inferSelect;
// { elementId, textPropsId }

// ============================================================================
// Output Type (mirrors database - base + gender_element + element_text_props joined)
// ============================================================================

export type GenderElementSpecProps = Omit<
  GenderElementEntity,
  "elementId" | "textPropsId"
>;

export type GenderElementOutput = {
  base: CertificateElementEntity;
  textPropsEntity: ElementTextPropsEntity;
  genderDataSource: GenderDataSource;
  // genderProps: GenderElementSpecProps;
};

import type { CertificateElementEntity } from "./base.element.types";
import type { ElementTextPropsEntity } from "./config.element.types";
import type { genderElement } from "@/server/db/schema";

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
};

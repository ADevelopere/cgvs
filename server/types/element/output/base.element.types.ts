import type { certificateElement } from "@/server/db/schema";
import { TextProps } from "./config.element.types";

// ============================================================================
// Entity Types (from Drizzle schema)
// ============================================================================

export type CertificateElementEntity = typeof certificateElement.$inferSelect;
export type CertificateElementEntityInput =
  typeof certificateElement.$inferInsert;

export type ElementConfigBase = {
  textProps: TextProps;
}
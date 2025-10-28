import type { certificateElement } from "@/server/db/schema";
import type { ElementAlignment } from "./enum.element.types";

// ============================================================================
// Entity Types (from Drizzle schema)
// ============================================================================

export type CertificateElementEntity = typeof certificateElement.$inferSelect;
export type CertificateElementEntityInput =
  typeof certificateElement.$inferInsert;

// ============================================================================
// Base Update Input (extended by all element update inputs)
// ============================================================================

export type CertificateElementBaseUpdateInput = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
};

// ============================================================================
// Batch Operations
// ============================================================================

export type ElementOrderUpdateInput = {
  id: number;
  renderOrder: number;
};

export type BatchElementOrderUpdateInput = {
  elements: ElementOrderUpdateInput[];
};

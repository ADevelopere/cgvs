import { certificateElement } from "@/server/db/schema";
import { ElementAlignment } from "../output";

export type CertificateElementEntityInput = typeof certificateElement.$inferInsert;
export type CertificateElementEntityCreateInput = Omit<CertificateElementEntityInput, "zIndex">;

export type CertificateElementBaseInput = Omit<
  CertificateElementEntityInput,
  "id" | "type" | "createdAt" | "updatedAt" | "zIndex"
> & {
  alignment: ElementAlignment;
};
// ============================================================================
// Base Update Input (extended by all element update inputs)
// ============================================================================

export type CertificateElementBaseUpdateInput = Omit<CertificateElementBaseInput, "templateId"> & {
  id: number;
};

// ============================================================================
// Batch Operations
// ============================================================================

export type ElementOrderUpdateInput = {
  id: number;
  zIndex: number;
};

export type BatchElementOrderUpdateInput = {
  elements: ElementOrderUpdateInput[];
};

export type IncreaseElementOrderInput = {
  elementId: number;
};

export type DecreaseElementOrderInput = {
  elementId: number;
};

export type ElementMoveInput = {
  /** The ID of the element being moved */
  elementId: number;
  /** The new render order (position) for the element */
  newZIndex: number;
};

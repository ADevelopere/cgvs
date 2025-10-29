import { ElementAlignment } from "../output";

export type CertificateElementBaseCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
};
// ============================================================================
// Base Update Input (extended by all element update inputs)
// ============================================================================

export type CertificateElementBaseUpdateInput = {
  id: number;
  name?: string | null;
  description?: string | null;
  positionX?: number | null;
  positionY?: number | null;
  width?: number | null;
  height?: number | null;
  alignment?: ElementAlignment | null;
  renderOrder?: number | null;
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
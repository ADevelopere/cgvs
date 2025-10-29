import type { TemplatePothosDefintion } from "../template.types";

import * as Output from "./output";

// ============================================================================
// Base Pothos Definition (extended by all element Pothos types)
// ============================================================================

// IMPORTANT: Table-Per-Type Architecture
// =======================================
// Element data is now split across multiple tables:
// 1. certificate_element - Base fields (id, name, position, alignment, etc.)
// 2. Type-specific tables - Element-specific fields (text_element, date_element, etc.)
// 3. element_text_props - Shared TextProps (used by 5 element types)
//
// WHY TABLE-PER-TYPE?
// - Proper normalization and referential integrity
// - No JSONB config field - all fields are typed columns
// - Efficient queries with proper indexes
// - FK constraints enforced at database level
//
// Base type for Pothos interface (with template relation)
export type CertificateElementPothosBase = Output.CertificateElementEntity & {
  template?: TemplatePothosDefintion | null;
};

// ============================================================================
// Pothos Union
// ============================================================================

export type CertificateElementPothosUnion =
  | Output.TextElementPothosDefinition
  | Output.DateElementPothosDefinition
  | Output.NumberElementPothosDefinition
  | Output.CountryElementPothosDefinition
  | Output.GenderElementPothosDefinition
  | Output.ImageElementPothosDefinition
  | Output.QRCodeElementPothosDefinition;

// ============================================================================
// Response Type
// ============================================================================

// Simple array response (no pagination or filters)
// Query by templateId, returned ordered by renderOrder
export type CertificateElementsResponse = CertificateElementPothosUnion[];

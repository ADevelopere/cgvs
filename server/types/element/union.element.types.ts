import type { TemplatePothosDefintion } from "../template.types";

import * as Output from "./output";

import * as Input from "./input";

// ============================================================================
// Config Unions
// ============================================================================

export type ElementConfigUnion =
  | Output.TextElementConfig
  | Output.DateElementConfig
  | Output.NumberElementConfig
  | Output.CountryElementConfig
  | Output.GenderElementConfig
  | Output.ImageElementConfig
  | Output.QRCodeElementConfig;

export type ElementConfigInput =
  | Input.TextElementConfigCreateInput
  | Input.DateElementConfigInput
  | Input.NumberElementConfigInput
  | Input.CountryElementConfigCreateInput
  | Input.GenderElementConfigInput
  | Input.ImageElementConfigInput
  | Input.QRCodeElementConfigInput;

// ============================================================================
// Base Pothos Definition (extended by all element Pothos types)
// ============================================================================

// IMPORTANT: Config-Column Synchronization Strategy
// ===================================================
// The certificate_element table has BOTH:
// 1. config (JSONB) - Source of truth for complete element configuration
// 2. FK columns (fontId, templateVariableId, storageFileId) - Mirrored for DB integrity
//
// WHY BOTH?
// - Config: Portable, versioned, complete configuration
// - Columns: Database FK constraints, relations, cascade protection, efficient queries
//
// APPLICATION LAYER MUST ensure these stay in sync when creating/updating:
// - Extract IDs from config and populate corresponding FK columns
// - See certificateElement.ts schema comments for sync rules per element type
//
// Base type for Pothos interface (without config)
export type CertificateElementPothosBase = Omit<
  Output.CertificateElementEntity,
  "config"
> & {
  template?: TemplatePothosDefintion | null;
};

export type CertificateElementPothosDefinition =
  Output.CertificateElementEntity & {
    template?: TemplatePothosDefintion | null;
    config: ElementConfigUnion;
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

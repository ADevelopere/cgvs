import type { CertificateElementEntity } from "./base.element.types";
import type { TemplatePothosDefintion } from "../template.types";
import type {
  TextElementConfig,
  TextElementConfigInput,
  TextElementPothosDefinition,
} from "./text.element.types";
import type {
  DateElementConfig,
  DateElementConfigInput,
  DateElementPothosDefinition,
} from "./date.element.types";
import type {
  NumberElementConfig,
  NumberElementConfigInput,
  NumberElementPothosDefinition,
} from "./number.element.types";
import type {
  CountryElementConfig,
  CountryElementConfigInput,
  CountryElementPothosDefinition,
} from "./country.element.types";
import type {
  GenderElementConfig,
  GenderElementConfigInput,
  GenderElementPothosDefinition,
} from "./gender.element.types";
import type {
  ImageElementConfig,
  ImageElementConfigInput,
  ImageElementPothosDefinition,
} from "./image.element.types";
import type {
  QRCodeElementConfig,
  QRCodeElementConfigInput,
  QRCodeElementPothosDefinition,
} from "./qrcode.element.types";

// ============================================================================
// Config Unions
// ============================================================================

export type ElementConfig =
  | TextElementConfig
  | DateElementConfig
  | NumberElementConfig
  | CountryElementConfig
  | GenderElementConfig
  | ImageElementConfig
  | QRCodeElementConfig;

export type ElementConfigInput =
  | TextElementConfigInput
  | DateElementConfigInput
  | NumberElementConfigInput
  | CountryElementConfigInput
  | GenderElementConfigInput
  | ImageElementConfigInput
  | QRCodeElementConfigInput;

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
  CertificateElementEntity,
  "config"
> & {
  template?: TemplatePothosDefintion | null;
};

export type CertificateElementPothosDefinition = CertificateElementEntity & {
  template?: TemplatePothosDefintion | null;
  config: ElementConfig;
};

// ============================================================================
// Pothos Union
// ============================================================================

export type CertificateElementPothosUnion =
  | TextElementPothosDefinition
  | DateElementPothosDefinition
  | NumberElementPothosDefinition
  | CountryElementPothosDefinition
  | GenderElementPothosDefinition
  | ImageElementPothosDefinition
  | QRCodeElementPothosDefinition;

// ============================================================================
// Response Type
// ============================================================================

// Simple array response (no pagination or filters)
// Query by templateId, returned ordered by renderOrder
export type CertificateElementsResponse = CertificateElementPothosUnion[];

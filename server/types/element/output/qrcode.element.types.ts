import type { CertificateElementPothosDefinition } from "../union.element.types";

// ============================================================================
// QR_CODE-specific Enums
// ============================================================================

export enum QRCodeDataSourceType {
  VERIFICATION_URL = "VERIFICATION_URL",
  VERIFICATION_CODE = "VERIFICATION_CODE",
}

export enum QRCodeErrorCorrection {
  L = "L", // Low (~7% correction)
  M = "M", // Medium (~15% correction)
  Q = "Q", // Quartile (~25% correction)
  H = "H", // High (~30% correction)
}

// ============================================================================
// Data Source Types
// ============================================================================

export type QRCodeDataSource =
  | { type: QRCodeDataSourceType.VERIFICATION_URL }
  | { type: QRCodeDataSourceType.VERIFICATION_CODE };

// ============================================================================
// Element Config
// ============================================================================

export interface QRCodeElementConfig {
  dataSource: QRCodeDataSource;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string; // e.g., "#000000"
  backgroundColor: string; // e.g., "#FFFFFF"
}

// ============================================================================
// Pothos Definition
// ============================================================================

export type QRCodeElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: QRCodeElementConfig;
};

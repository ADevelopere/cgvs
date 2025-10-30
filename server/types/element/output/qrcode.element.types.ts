import type { CertificateElementEntity } from "./base.element.types";
import type { qrCodeElement } from "@/server/db/schema";

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
// Raw Entity (from Drizzle schema)
// ============================================================================

export type QRCodeElementEntity = typeof qrCodeElement.$inferSelect;
// { elementId, errorCorrection, foregroundColor, backgroundColor }

// ============================================================================
// Output Type (mirrors database - base + qr_code_element joined)
// ============================================================================

export type QRCodeElementSpecProps = Omit<
  QRCodeElementEntity,
  "errorCorrection"
> & {
  errorCorrection: QRCodeErrorCorrection;
};

export type QRCodeElementOutput = {
  base: CertificateElementEntity;
  qrCodeProps: QRCodeElementSpecProps;
  qrCodeDataSource: QRCodeDataSource;
};

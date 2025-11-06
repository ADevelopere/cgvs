import type { CertificateElementEntity } from "./base.element.types";
import type { qrCodeElement } from "@/server/db/schema";

// ============================================================================
// QR_CODE-specific Enums
// ============================================================================

export enum QRCodeErrorCorrection {
  L = "L", // Low (~7% correction)
  M = "M", // Medium (~15% correction)
  Q = "Q", // Quartile (~25% correction)
  H = "H", // High (~30% correction)
}

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type QRCodeElementEntity = typeof qrCodeElement.$inferSelect;
// { elementId, errorCorrection, foregroundColor, backgroundColor }

// ============================================================================
// Output Type (mirrors database - base + qr_code_element joined)
// ============================================================================

export type QRCodeElementSpecProps = Omit<QRCodeElementEntity, "errorCorrection"> & {
  errorCorrection: QRCodeErrorCorrection;
};

export type QRCodeElementOutput = {
  base: CertificateElementEntity;
  qrCodeProps: QRCodeElementSpecProps;
};

export type QRCodeElementSpecPropsStandaloneUpdateResponse = {
  elementId: number;
  qrCodeProps: QRCodeElementSpecProps;
};

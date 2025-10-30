import { QRCodeDataSourceType, QRCodeErrorCorrection } from "../output";
import { CertificateElementBaseInput } from "./base.element.input";
import { qrCodeElement } from "@/server/db/schema";

// ============================================================================
// Data Source Types
// ============================================================================

export type QRCodeDataSourceVerificationUrlInput = {
  type: QRCodeDataSourceType.VERIFICATION_URL;
};

export type QRCodeDataSourceVerificationCodeInput = {
  type: QRCodeDataSourceType.VERIFICATION_CODE;
};

export type QRCodeDataSourceInput =
  | QRCodeDataSourceVerificationUrlInput
  | QRCodeDataSourceVerificationCodeInput;

// ============================================================================
// Mutation Inputs
// ============================================================================

export type QRCodeElementEntityInput = typeof qrCodeElement.$inferInsert;
export type QRCodeElementSpecPropsInput = Omit<
  QRCodeElementEntityInput,
  "elementId" | "errorCorrection"
> & {
  errorCorrection: QRCodeErrorCorrection;
};

export type QRCodeElementInput = {
  base: CertificateElementBaseInput;
  qrCodeProps: QRCodeElementSpecPropsInput;
  dataSource: QRCodeDataSourceInput;
};

export type QRCodeElementUpdateInput = QRCodeElementInput & {
  id: number;
};
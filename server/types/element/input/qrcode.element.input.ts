import { QRCodeErrorCorrection } from "../output";
import { CertificateElementBaseInput } from "./base.element.input";
import { qrCodeElement } from "@/server/db/schema";

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
};

export type QRCodeElementUpdateInput = QRCodeElementInput & {
  id: number;
};

export type QRCodeElementSpecPropsStandaloneUpdateInput = {
  elementId: number;
  qrCodeProps: QRCodeElementSpecPropsInput;
};

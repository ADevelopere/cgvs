import { CertificateElementBaseInput, QRCodeElementSpecPropsInput } from "../input";

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type QRCodeElementInputGraphql = {
  base: CertificateElementBaseInput;
  qrCodeProps: QRCodeElementSpecPropsInput;
};

// GraphQL update input type
export type QRCodeElementUpdateInputGraphql = QRCodeElementInputGraphql & {
  id: number;
};

import { ElementType, QRCodeDataSourceType, QRCodeErrorCorrection } from "../output";
import {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
} from "./base.element.input";


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
// Element Config
// ============================================================================

// Repository input type (matches Config structure)
export type QRCodeElementConfigInput = {
  type: ElementType.QR_CODE;
  dataSource: QRCodeDataSourceInput;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string;
  backgroundColor: string;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type QRCodeElementCreateInput = CertificateElementBaseCreateInput & {
  config: QRCodeElementConfigInput;
};

export type QRCodeElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<QRCodeElementConfigInput>;
};
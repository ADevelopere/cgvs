import { QRCodeDataSourceType, QRCodeErrorCorrection } from "../output";
import {
  CertificateElementBaseInput,
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
// Mutation Inputs
// ============================================================================

export type QRCodeElementCreateInput = CertificateElementBaseInput & {
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string;
  backgroundColor: string;
};

export type QRCodeElementUpdateInput = CertificateElementBaseUpdateInput & {
  errorCorrection?: QRCodeErrorCorrection | null;
  foregroundColor?: string | null;
  backgroundColor?: string | null;
};
import { QRCodeDataSourceType, QRCodeErrorCorrection } from "../output";
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
export type QRCodeElementConfigCreateInput = {
  dataSource: QRCodeDataSourceInput;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string;
  backgroundColor: string;
};

export type QRCodeElementConfigUpdateInput = {
  dataSource?: QRCodeDataSourceInput | null;
  errorCorrection?: QRCodeErrorCorrection | null;
  foregroundColor?: string | null;
  backgroundColor?: string | null;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type QRCodeElementCreateInput = CertificateElementBaseCreateInput & {
  config: QRCodeElementConfigCreateInput;
};

export type QRCodeElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: QRCodeElementConfigUpdateInput | null;
};
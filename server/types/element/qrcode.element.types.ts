import { ElementType, ElementAlignment } from "./enum.element.types";
import { CertificateElementBaseUpdateInput } from "./base.element.types";
import type { CertificateElementPothosDefinition } from "./union.element.types";

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

export type QRCodeDataSourceVerificationUrlInput = {
  type: QRCodeDataSourceType.VERIFICATION_URL;
};

export type QRCodeDataSourceVerificationCodeInput = {
  type: QRCodeDataSourceType.VERIFICATION_CODE;
};

export type QRCodeDataSourceInput =
  | QRCodeDataSourceVerificationUrlInput
  | QRCodeDataSourceVerificationCodeInput;

// GraphQL input types (used in Pothos isOneOf definitions)
export type QRCodeDataSourceVerificationUrlInputGraphql = Record<
  string,
  never
>;

export type QRCodeDataSourceVerificationCodeInputGraphql = Record<
  string,
  never
>;

export type QRCodeDataSourceInputGraphql =
  | {
      verificationUrl: QRCodeDataSourceVerificationUrlInputGraphql;
      verificationCode?: never;
    }
  | {
      verificationCode: QRCodeDataSourceVerificationCodeInputGraphql;
      verificationUrl?: never;
    };

// ============================================================================
// Element Config
// ============================================================================

export interface QRCodeElementConfig {
  type: ElementType.QR_CODE;
  dataSource: QRCodeDataSource;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string; // e.g., "#000000"
  backgroundColor: string; // e.g., "#FFFFFF"
}

// GraphQL input type (type field omitted - implied by mutation)
export type QRCodeElementConfigInputGraphql = {
  dataSource: QRCodeDataSourceInputGraphql;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string;
  backgroundColor: string;
};

// GraphQL update input type (all optional)
export type QRCodeElementConfigUpdateInputGraphql = {
  dataSource?: QRCodeDataSourceInputGraphql;
  errorCorrection?: QRCodeErrorCorrection;
  foregroundColor?: string;
  backgroundColor?: string;
};

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

export type QRCodeElementCreateInput = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: QRCodeElementConfigInput;
};

// GraphQL create input type
export type QRCodeElementCreateInputGraphql = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
  config: QRCodeElementConfigInputGraphql;
};

export type QRCodeElementUpdateInput = CertificateElementBaseUpdateInput & {
  config?: Partial<QRCodeElementConfigInput>;
};

// GraphQL update input type (deep partial support)
export type QRCodeElementUpdateInputGraphql = {
  id: number;
  name?: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  alignment?: ElementAlignment;
  renderOrder?: number;
  config?: QRCodeElementConfigUpdateInputGraphql;
};

// ============================================================================
// Pothos Definition
// ============================================================================

export type QRCodeElementPothosDefinition = Omit<
  CertificateElementPothosDefinition,
  "config"
> & {
  config: QRCodeElementConfig;
};

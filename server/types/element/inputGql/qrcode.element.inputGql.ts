// ============================================================================
// Data Source Types
// ============================================================================

import { CertificateElementBaseInput, CertificateElementBaseUpdateInput } from "../input";
import { QRCodeErrorCorrection } from "../output";

// GraphQL input types (used in Pothos isOneOf definitions)
export type QRCodeDataSourceVerificationUrlInputGraphql = Record<string, never>;

export type QRCodeDataSourceVerificationCodeInputGraphql = Record<
  string,
  never
>;

export type QRCodeDataSourceInputGraphql =
  | {
      verificationUrl: QRCodeDataSourceVerificationUrlInputGraphql;
      verificationCode?: never | null;
    }
  | {
      verificationCode: QRCodeDataSourceVerificationCodeInputGraphql;
      verificationUrl?: never | null;
    };

// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type QRCodeElementCreateInputGraphql =
  CertificateElementBaseInput & {
    errorCorrection: QRCodeErrorCorrection;
    foregroundColor: string;
    backgroundColor: string;
  };

// GraphQL update input type (deep partial support)
export type QRCodeElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    errorCorrection?: QRCodeErrorCorrection | null;
    foregroundColor?: string | null;
    backgroundColor?: string | null;
  };

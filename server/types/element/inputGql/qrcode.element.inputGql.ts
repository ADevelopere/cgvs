// ============================================================================
// Data Source Types
// ============================================================================

import { CertificateElementBaseCreateInput, CertificateElementBaseUpdateInput } from "../input";
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
// Element Config
// ============================================================================


// GraphQL input type (type field omitted - implied by mutation)
export type QRCodeElementConfigInputGraphql = {
  dataSource: QRCodeDataSourceInputGraphql;
  errorCorrection: QRCodeErrorCorrection;
  foregroundColor: string;
  backgroundColor: string;
};

// GraphQL update input type (all optional)
export type QRCodeElementConfigUpdateInputGraphql = {
  dataSource?: QRCodeDataSourceInputGraphql | null;
  errorCorrection?: QRCodeErrorCorrection | null;
  foregroundColor?: string | null;
  backgroundColor?: string | null;
};


// ============================================================================
// Mutation Inputs
// ============================================================================

// GraphQL create input type
export type QRCodeElementCreateInputGraphql =
  CertificateElementBaseCreateInput & {
    config: QRCodeElementConfigInputGraphql;
  };


// GraphQL update input type (deep partial support)
export type QRCodeElementUpdateInputGraphql =
  CertificateElementBaseUpdateInput & {
    config?: QRCodeElementConfigUpdateInputGraphql | null;
  };

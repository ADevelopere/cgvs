import {
  CertificateElementBaseInput,
  QRCodeElementSpecPropsInput,
} from "../input";

// ============================================================================
// Data Source Types
// ============================================================================

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
export type QRCodeElementInputGraphql = {
  base: CertificateElementBaseInput;
  qrCodeProps: QRCodeElementSpecPropsInput;
  dataSource: QRCodeDataSourceInputGraphql;
};

// GraphQL update input type
export type QRCodeElementUpdateInputGraphql = QRCodeElementInputGraphql & {
  id: number;
};

import * as Output from "./output";

// ============================================================================
// Pothos Union
// ============================================================================

export type CertificateElementUnion =
  | Output.TextElementOutput
  | Output.DateElementOutput
  | Output.NumberElementOutput
  | Output.CountryElementOutput
  | Output.GenderElementOutput
  | Output.ImageElementOutput
  | Output.QRCodeElementOutput;

// ============================================================================
// Font Reference (GraphQL isOneOf pattern)
// ============================================================================

import { TextPropsInput } from "../input";
import { FontFamily } from "@/lib/font/google/fontFamily.enum";

export type FontReferenceGoogleInputGraphql = {
  family: FontFamily;
  variant: string;
};

export type FontReferenceSelfHostedInputGraphql = {
  fontVariantId: number;
};

export type FontReferenceInputGraphql =
  | { google: FontReferenceGoogleInputGraphql; selfHosted?: never | null }
  | { selfHosted: FontReferenceSelfHostedInputGraphql; google?: never | null };

// ============================================================================
// Text Props (GraphQL version with isOneOf font reference)
// ============================================================================

// Re-export TextProps types with GraphQL naming and font reference pattern
export type TextPropsInputGraphql = Omit<TextPropsInput, "fontRef"> & {
  fontRef: FontReferenceInputGraphql;
};

export type TextPropsUpdateInputGraphql = TextPropsInputGraphql & {
  id: number;
};

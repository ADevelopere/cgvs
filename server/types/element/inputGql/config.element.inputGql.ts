
// ============================================================================
// Font Reference (GraphQL isOneOf pattern)
// ============================================================================

import { TextPropsCreateInput, TextPropsUpdateInput } from "../input";

export type FontReferenceGoogleInputGraphql = {
  identifier: string;
};

export type FontReferenceSelfHostedInputGraphql = {
  fontId: number;
};

export type FontReferenceInputGraphql =
  | { google: FontReferenceGoogleInputGraphql; selfHosted?: never | null }
  | { selfHosted: FontReferenceSelfHostedInputGraphql; google?: never | null };

// ============================================================================
// Text Props (GraphQL version with isOneOf font reference)
// ============================================================================

// Re-export TextProps types with GraphQL naming and font reference pattern
export type TextPropsCreateInputGraphql = Omit<
  TextPropsCreateInput,
  "fontRef"
> & {
  fontRef: FontReferenceInputGraphql;
};

export type TextPropsUpdateInputGraphql = Omit<
TextPropsUpdateInput,
  "fontRef"
> & {
  fontRef: FontReferenceInputGraphql;
};

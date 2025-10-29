import { ElementOverflow } from "../output";

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
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

export type TextPropsCreateInputGraphql = {
  fontRef: FontReferenceInputGraphql;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

export type TextPropsUpdateInputGraphql = {
  fontRef?: FontReferenceInputGraphql | null;
  fontSize?: number | null;
  color?: string | null;
  overflow?: ElementOverflow | null;
};

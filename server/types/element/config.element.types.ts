import { FontSource } from "./enum.element.types";

export enum ElementOverflow {
  RESIZE_DOWN = "RESIZE_DOWN",
  TRUNCATE = "TRUNCATE",
  ELLIPSE = "ELLIPSE",
  WRAP = "WRAP",
}

// ============================================================================
// Font Reference Types
// ============================================================================

export type FontReference =
  | { type: FontSource.GOOGLE; identifier: string }
  | { type: FontSource.SELF_HOSTED; fontId: number };

// GraphQL input types (used in Pothos definitions)
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

export type TextProps = {
  fontRef?: FontReference | null;
  fontSize?: number | null;
  color?: string | null; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow?: ElementOverflow | null;
};

export type TextPropsCreateInput = {
  fontRef: FontReference;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

export type TextPropsCreateInputGraphql = {
  fontRef: FontReferenceInputGraphql;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

export type TextPropsUpdateInput = {
  fontRef?: FontReference | null;
  fontSize?: number | null;
  color?: string | null;
  overflow?: ElementOverflow | null;
};

export type TextPropsUpdateInputGraphql = {
  fontRef?: FontReferenceInputGraphql | null;
  fontSize?: number | null;
  color?: string | null;
  overflow?: ElementOverflow | null;
};

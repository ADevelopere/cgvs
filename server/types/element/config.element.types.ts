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
  | { google: FontReferenceGoogleInputGraphql; selfHosted?: never }
  | { selfHosted: FontReferenceSelfHostedInputGraphql; google?: never };

export type TextPropsInputGraphql = {
  fontRef: FontReferenceInputGraphql;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

// ============================================================================
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

export type TextProps = {
  fontRef: FontReference;
  fontSize: number;
  color: string; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: ElementOverflow;
};

// Repository input types (match Config structure)
export type FontReferenceInput = FontReference;

export type TextPropsInput = {
  fontRef: FontReferenceInput;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

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

export type FontReferenceGoogleInput = {
  type: FontSource.GOOGLE;
  identifier: string;
};

export type FontReferenceSelfHostedInput = {
  type: FontSource.SELF_HOSTED;
  fontId: number;
};

export type FontReferenceInput =
  | FontReferenceGoogleInput
  | FontReferenceSelfHostedInput;

// ============================================================================
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

export type TextProps = {
  fontRef: FontReference;
  fontSize: number;
  color: string; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: ElementOverflow;
};

export type TextPropsInput = {
  fontRef: FontReferenceInput;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

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

// ============================================================================
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

export type TextProps = {
  fontRef: FontReference;
  fontSize: number;
  color?: string; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: ElementOverflow;
};

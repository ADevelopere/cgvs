import { FontSource } from "./enum.element.types";
import type { elementTextProps } from "@/server/db/schema";

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
// Element Text Props Entity (Raw DB - for repository internal use)
// ============================================================================

export type ElementTextPropsEntity = typeof elementTextProps.$inferSelect;
// { id, fontSource, fontId, googleFontIdentifier, fontSize, color, overflow }

// ============================================================================
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

// Logical structure - NO database fields
export type TextProps = Omit<
  ElementTextPropsEntity,
  "fontSource" | "fontId" | "googleFontIdentifier"
> & {
  fontRef: FontReference;
  overflow: ElementOverflow;
};

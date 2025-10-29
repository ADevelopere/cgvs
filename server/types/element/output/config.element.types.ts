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
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

// Logical structure - NO database fields
export type TextProps = {
  fontRef: FontReference;
  fontSize: number;
  color: string; // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: ElementOverflow;
};

// ============================================================================
// Element Text Props Entity (Raw DB - for repository internal use)
// ============================================================================

export type ElementTextPropsEntity = typeof elementTextProps.$inferSelect;
// { id, fontSource, fontId, googleFontIdentifier, fontSize, color, overflow }

export type ElementTextPropsInsert = typeof elementTextProps.$inferInsert;

import { elementTextProps } from "@/server/db/schema";
import { ElementOverflow, FontReference } from "../output";

export type ElementTextPropsInsert = typeof elementTextProps.$inferInsert;

export type TextPropsInput = Omit<
  ElementTextPropsInsert,
  "id" | "fontSource" | "fontId" | "googleFontIdentifier"
> & {
  fontRef: FontReference;
  overflow: ElementOverflow;
};

export type TextPropsUpdateInput = TextPropsInput & {
  id: number;
};

import * as GQL from "@/client/graphql/generated/gql/graphql";
import type { Font as OpentypeFont } from "opentype.js";
import { resolveTextContent } from "../../demo/textDemo";
import { getFontFamilyFromElement } from "./fontUtils";
import { drawDebugBorder } from "../util/debugUtils";
import { RenderBox } from "../types";
import { layoutResizeDown, layoutTruncate, layoutWrap, drawLayout, TextLayoutResult } from "./textLayout";

/**
 * Render a text element on canvas
 * Complexity: 10 (text resolution + font setup + layout calculation + drawing)
 */
export function renderTextElement(
  element: GQL.TextElement,
  ctx: CanvasRenderingContext2D,
  config: GQL.TemplateConfig,
  getFont: (family: string) => OpentypeFont | undefined,
  showDebugBorder = false
): void {
  const text = resolveTextContent(element.textDataSource, config.language, "Text");
  const family = getFontFamilyFromElement(element);
  const fontSize = element.textProps.fontSize;
  const color = element.textProps.color || "#000";
  const font = getFont(family);

  setupTextContext(ctx, fontSize, family);

  const layout = calculateTextLayout(ctx, text, element, font, fontSize, family);

  const renderBox = createRenderBox(element, color);
  drawLayout(ctx, renderBox, layout, font, family);

  if (showDebugBorder) {
    drawDebugBorder(ctx, element.base);
  }
}

/**
 * Setup canvas context for text rendering
 * Complexity: 2 (font + baseline setup)
 */
function setupTextContext(ctx: CanvasRenderingContext2D, fontSize: number, family: string): void {
  ctx.font = `${fontSize}px ${family}`;
  ctx.textBaseline = "alphabetic";
}

/**
 * Calculate text layout based on overflow mode
 * Complexity: 10 (multiple conditionals + layout calculations)
 */
function calculateTextLayout(
  ctx: CanvasRenderingContext2D,
  text: string,
  element: GQL.TextElement,
  font: OpentypeFont | undefined,
  fontSize: number,
  family: string
): TextLayoutResult {
  const overflow = element.textProps.overflow;
  const width = element.base.width;
  const height = element.base.height;

  switch (overflow) {
    case GQL.ElementOverflow.Wrap:
      return layoutWrap(ctx, text, width, font, fontSize);

    case GQL.ElementOverflow.Ellipse:
    case GQL.ElementOverflow.Truncate:
      return layoutTruncate(ctx, text, width, fontSize, overflow, font);

    case GQL.ElementOverflow.ResizeDown:
      return layoutResizeDown(ctx, text, width, height, font, fontSize, family);

    default:
      return layoutTruncate(ctx, text, width, fontSize, GQL.ElementOverflow.Truncate, font);
  }
}

/**
 * Create render box from element properties
 * Complexity: 2 (object creation)
 */
function createRenderBox(element: GQL.TextElement, color: string): RenderBox {
  return {
    x: element.base.positionX,
    y: element.base.positionY,
    width: element.base.width,
    height: element.base.height,
    color,
    alignment: element.base.alignment,
  };
}

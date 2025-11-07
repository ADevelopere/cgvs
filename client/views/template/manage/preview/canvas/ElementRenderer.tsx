import * as GQL from "@/client/graphql/generated/gql/graphql";
import type { Font as OpentypeFont } from "opentype.js";
import { renderImageElement } from "./image/ImageElementRenderer";
import { renderTextElement } from "./text/TextElementRenderer";

/**
 * Render a single element based on its type
 * Complexity: 5 (type checks + conditional rendering)
 */
export function renderElement(
  element: GQL.CertificateElementUnion,
  ctx: CanvasRenderingContext2D,
  config: GQL.TemplateConfig,
  imageCache: Map<string, HTMLImageElement>,
  getFont: (family: string) => OpentypeFont | undefined,
  showDebugBorder = false
): void {
  if (element.base.hidden) return;

  if (element.__typename === "ImageElement") {
    renderImageElement(element, ctx, imageCache, showDebugBorder);
  } else if (element.__typename === "TextElement") {
    renderTextElement(element, ctx, config, getFont, showDebugBorder);
  }
}

/**
 * Render all elements in proper z-index order
 * Complexity: 4 (loop + rendering)
 */
export function renderAllElements(
  elements: GQL.CertificateElementUnion[],
  ctx: CanvasRenderingContext2D,
  config: GQL.TemplateConfig,
  imageCache: Map<string, HTMLImageElement>,
  getFont: (family: string) => OpentypeFont | undefined,
  showDebugBorder = false
): void {
  for (const element of elements) {
    renderElement(element, ctx, config, imageCache, getFont, showDebugBorder);
  }
}

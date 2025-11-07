import * as GQL from "@/client/graphql/generated/gql/graphql";
import { calculateImageDimensions } from "./imageUtils";
import { drawDebugBorder } from "../util/debugUtils";

/**
 * Render an image element on canvas
 * Complexity: 8 (checks + dimension calculation + clipping + drawing)
 */
export function renderImageElement(
  element: GQL.ImageElement,
  ctx: CanvasRenderingContext2D,
  imageCache: Map<string, HTMLImageElement>,
  showDebugBorder = false
): void {
  const imageUrl = element.imageDataSource?.imageUrl;
  if (!imageUrl) return;

  const img = imageCache.get(imageUrl);
  if (!img) return;

  const fit = element.imageProps?.fit || GQL.ElementImageFit.Contain;
  
  drawImageWithFit(ctx, img, element, fit);

  if (showDebugBorder) {
    drawDebugBorder(ctx, element.base);
  }
}

/**
 * Draw image with appropriate fit mode
 * Complexity: 7 (dimension calculation + clipping + drawing)
 */
function drawImageWithFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  element: GQL.ImageElement,
  fit: GQL.ElementImageFit
): void {
  const dimensions = calculateImageDimensions(
    img.naturalWidth,
    img.naturalHeight,
    element.base.width,
    element.base.height,
    fit
  );

  ctx.save();

  if (fit === GQL.ElementImageFit.Cover) {
    applyClipping(ctx, element.base);
  }

  ctx.drawImage(
    img,
    element.base.positionX + dimensions.x,
    element.base.positionY + dimensions.y,
    dimensions.width,
    dimensions.height
  );

  ctx.restore();
}

/**
 * Apply clipping rectangle to canvas context
 * Complexity: 3 (beginPath + rect + clip)
 */
function applyClipping(ctx: CanvasRenderingContext2D, base: GQL.CertificateElementBase): void {
  ctx.beginPath();
  ctx.rect(base.positionX, base.positionY, base.width, base.height);
  ctx.clip();
}

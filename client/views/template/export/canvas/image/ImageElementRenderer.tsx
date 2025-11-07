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
 * Images render at native resolution without canvas scale transformation
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
  
  // Get current transform to extract scale
  const transform = ctx.getTransform();
  const scaleX = transform.a;
  const scaleY = transform.d;
  
  // Reset transform for native resolution rendering
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  if (fit === GQL.ElementImageFit.Cover) {
    // Apply clipping with scaled coordinates
    ctx.beginPath();
    ctx.rect(
      element.base.positionX * scaleX,
      element.base.positionY * scaleY,
      element.base.width * scaleX,
      element.base.height * scaleY
    );
    ctx.clip();
  }

  // Draw image at native resolution using full source image
  // Apply scale to coordinates but use full image data
  ctx.drawImage(
    img,
    0, 0, img.naturalWidth, img.naturalHeight, // source: full image
    (element.base.positionX + dimensions.x) * scaleX,
    (element.base.positionY + dimensions.y) * scaleY,
    dimensions.width * scaleX,
    dimensions.height * scaleY
  );

  ctx.restore();
}

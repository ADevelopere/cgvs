import * as GQL from "@/client/graphql/generated/gql/graphql";

/**
 * Canvas dimensions result
 */
export interface CanvasDimensions {
  renderWidth: number;
  renderHeight: number;
}

/**
 * Calculate canvas dimensions with render scale
 * Complexity: 2 (multiplication operations)
 */
export function calculateCanvasDimensions(config: GQL.TemplateConfig, renderScale: number): CanvasDimensions {
  return {
    renderWidth: config.width * renderScale,
    renderHeight: config.height * renderScale,
  };
}

/**
 * Setup canvas context with scale transformation
 * Complexity: 3 (save + scale operations)
 */
export function setupCanvasContext(ctx: CanvasRenderingContext2D, renderScale: number): void {
  ctx.save();
  ctx.scale(renderScale, renderScale);
}

/**
 * Clear canvas before drawing
 * Complexity: 2 (clearRect operation)
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Sort elements by zIndex for proper layering
 * Complexity: 3 (slice + sort)
 */
export function sortElementsByZIndex(elements: GQL.CertificateElementUnion[]): GQL.CertificateElementUnion[] {
  return elements.slice().sort((a, b) => a.base.zIndex - b.base.zIndex);
}

/**
 * Create downsampled canvas for export
 * Complexity: 8 (canvas creation + context setup + drawing)
 */
export function createDownsampledCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = targetWidth;
  outputCanvas.height = targetHeight;

  const outputCtx = outputCanvas.getContext("2d");
  if (!outputCtx) {
    return sourceCanvas;
  }

  setupImageSmoothing(outputCtx);
  outputCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  return outputCanvas;
}

/**
 * Setup high-quality image smoothing
 * Complexity: 2 (property assignments)
 */
function setupImageSmoothing(ctx: CanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
}

/**
 * Trigger canvas download
 * Complexity: 6 (link creation + DOM manipulation)
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

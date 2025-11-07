import React from "react";
import type { Font as OpentypeFont } from "opentype.js";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  calculateCanvasDimensions,
  setupCanvasContext,
  clearCanvas,
  sortElementsByZIndex,
} from "./util/canvasUtils";
import { renderAllElements } from "./ElementRenderer";

/**
 * Custom hook for canvas drawing operations
 * Manages the drawing loop and performance timing
 */
export function useCanvasDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  elements: GQL.CertificateElementUnion[],
  config: GQL.TemplateConfig,
  fontsLoaded: boolean,
  metricsReady: boolean,
  imagesLoaded: boolean,
  imageCache: React.RefObject<Map<string, HTMLImageElement>>,
  getFont: (family: string) => OpentypeFont | undefined,
  showDebugBorders: boolean,
  renderScale: number,
  onDrawComplete?: (dataUrl: string) => void
) {
  const canvasGenerationTimeRef = React.useRef<number>(0);

  const draw = React.useCallback(() => {
    const drawStartTime = performance.now();
    const canvas = canvasRef.current;

    if (!canvas || !fontsLoaded || !metricsReady || !imagesLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { renderWidth, renderHeight } = calculateCanvasDimensions(config, renderScale);

    clearCanvas(ctx, renderWidth, renderHeight);
    setupCanvasContext(ctx, renderScale);

    const sortedElements = sortElementsByZIndex(elements);
    renderAllElements(sortedElements, ctx, config, imageCache.current, getFont, showDebugBorders);

    ctx.restore();

    const drawEndTime = performance.now();
    canvasGenerationTimeRef.current = drawEndTime - drawStartTime;

    // Move expensive toDataURL() to idle callback to avoid blocking at high scales
    if (onDrawComplete) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // For high scales (>2x), use downsampled version for cache to reduce memory
          let cacheCanvas = canvas;
          if (renderScale > 2) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = config.width * 2; // Cache at max 2x scale
            tempCanvas.height = config.height * 2;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = true;
              tempCtx.imageSmoothingQuality = 'high';
              tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
              cacheCanvas = tempCanvas;
            }
          }
          const dataUrl = cacheCanvas.toDataURL("image/png");
          onDrawComplete(dataUrl);
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          let cacheCanvas = canvas;
          if (renderScale > 2) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = config.width * 2;
            tempCanvas.height = config.height * 2;
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = true;
              tempCtx.imageSmoothingQuality = 'high';
              tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
              cacheCanvas = tempCanvas;
            }
          }
          const dataUrl = cacheCanvas.toDataURL("image/png");
          onDrawComplete(dataUrl);
        }, 0);
      }
    }
  }, [
    canvasRef,
    elements,
    config,
    fontsLoaded,
    metricsReady,
    imagesLoaded,
    imageCache,
    getFont,
    showDebugBorders,
    renderScale,
    onDrawComplete,
  ]);

  return {
    draw,
    canvasGenerationTime: canvasGenerationTimeRef.current,
  };
}

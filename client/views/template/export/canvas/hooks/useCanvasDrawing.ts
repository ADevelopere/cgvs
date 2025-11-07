import React from "react";
import type { Font as OpentypeFont } from "opentype.js";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  calculateCanvasDimensions,
  setupCanvasContext,
  clearCanvas,
  sortElementsByZIndex,
} from "../util/canvasUtils";
import { renderAllElements } from "../ElementRenderer";
import { logger } from "@/client/lib/logger";

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

    logger.debug({ caller: "useCanvasDrawing" }, "draw() called", {
      hasCanvas: !!canvas,
      fontsLoaded,
      metricsReady,
      imagesLoaded,
    });

    if (!canvas || !fontsLoaded || !metricsReady || !imagesLoaded) {
      logger.warn({ caller: "useCanvasDrawing" }, "draw() early return", {
        hasCanvas: !!canvas,
        fontsLoaded,
        metricsReady,
        imagesLoaded,
      });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      logger.error({ caller: "useCanvasDrawing" }, "Failed to get 2d context");
      return;
    }

    const { renderWidth, renderHeight } = calculateCanvasDimensions(config, renderScale);

    logger.debug({ caller: "useCanvasDrawing" }, "Canvas dimensions", {
      renderWidth,
      renderHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    clearCanvas(ctx, renderWidth, renderHeight);
    setupCanvasContext(ctx, renderScale);

    const sortedElements = sortElementsByZIndex(elements);
    logger.debug({ caller: "useCanvasDrawing" }, "Rendering elements", {
      elementCount: sortedElements.length,
      elements: sortedElements.map(e => ({ type: e.__typename, hidden: e.base.hidden })),
    });

    renderAllElements(sortedElements, ctx, config, imageCache.current, getFont, showDebugBorders);

    ctx.restore();

    const drawEndTime = performance.now();
    canvasGenerationTimeRef.current = drawEndTime - drawStartTime;

    logger.debug({ caller: "useCanvasDrawing" }, "Canvas draw complete", {
      generationTime: canvasGenerationTimeRef.current,
    });

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

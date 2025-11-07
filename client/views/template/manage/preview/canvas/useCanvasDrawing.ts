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

    if (onDrawComplete) {
      const dataUrl = canvas.toDataURL("image/png");
      onDrawComplete(dataUrl);
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

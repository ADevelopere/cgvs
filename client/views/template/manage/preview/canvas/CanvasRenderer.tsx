"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import logger from "@/client/lib/logger";
import { FontContext } from "../FontContext";
import { useOpentypeMetrics } from "../useOpentypeMetrics";
import { useImageLoader } from "./image/useImageLoader";
import { useCanvasDrawing } from "./useCanvasDrawing";
import { calculateCanvasDimensions, createDownsampledCanvas, downloadCanvas } from "./util/canvasUtils";
import { CanvasRendererProps, ClientCanvasGeneratorRef } from "./types";

/**
 * Main canvas rendering component
 * Complexity: 14 (state + effects + timeout handling + imperative handle)
 * Optimized: Fonts, metrics, and images load in parallel
 */
function CanvasRenderer(
  {
    elements,
    config,
    onExport,
    onReady,
    showDebugBorders = true,
    renderScale = 1,
    onDrawComplete,
    timeoutMs,
    onTimeout,
    hashGenerationTimeRef,
  }: CanvasRendererProps,
  ref: React.Ref<ClientCanvasGeneratorRef>
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { fontsLoaded, families } = React.useContext(FontContext);
  
  // Start OpenType metrics and image loading in parallel (they're independent)
  const { metricsReady, getFont } = useOpentypeMetrics(families);
  const { imagesLoaded, imageCache } = useImageLoader(elements);
  
  const didReady = React.useRef(false);
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const { draw, canvasGenerationTime } = useCanvasDrawing(
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
    onDrawComplete
  );

  // Main drawing effect
  React.useEffect(() => {
    if (!fontsLoaded || !metricsReady || !imagesLoaded) return;

    setupTimeout();
    draw();
    notifyReady();

    return cleanup;
  }, [draw, fontsLoaded, metricsReady, imagesLoaded]);

  /**
   * Setup generation timeout
   * Complexity: 5 (timeout creation + logging)
   */
  const setupTimeout = () => {
    if (timeoutMs && !timeoutIdRef.current) {
      timeoutIdRef.current = setTimeout(() => {
        logger.warn({ caller: "CanvasRenderer" }, "Canvas generation timeout exceeded", {
          timeoutMs,
        });
        onTimeout?.();
        timeoutIdRef.current = null;
      }, timeoutMs);
    }
  };

  /**
   * Notify parent of ready state
   * Complexity: 5 (conditional + callback + timeout clear)
   */
  const notifyReady = () => {
    if (!didReady.current) {
      didReady.current = true;
      onReady?.({
        canvasGenerationTime,
        hashGenerationTime: hashGenerationTimeRef?.current || 0,
      });

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }
  };

  /**
   * Cleanup timeout on unmount
   * Complexity: 2 (conditional + clear)
   */
  const cleanup = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  /**
   * Handle canvas download
   * Complexity: 8 (conditional + downsampling + export)
   */
  const download = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let exportCanvas = canvas;

    if (renderScale > 1) {
      exportCanvas = createDownsampledCanvas(canvas, config.width, config.height);
    }

    const dataUrl = exportCanvas.toDataURL("image/png");
    onExport?.(dataUrl);
    downloadCanvas(exportCanvas, "certificate-preview.png");
  }, [onExport, renderScale, config.width, config.height]);

  React.useImperativeHandle(ref, () => ({ download }), [download]);

  const { renderWidth, renderHeight } = calculateCanvasDimensions(config, renderScale);

  if (!didReady.current) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress color="info" size={20} />
      </Box>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={renderWidth}
      height={renderHeight}
      style={{ width: `${config.width}px`, height: `${config.height}px`, border: "1px solid #ccc" }}
    />
  );
}

export const CanvasRendererWithRef = React.forwardRef<ClientCanvasGeneratorRef, CanvasRendererProps>(
  CanvasRenderer
);

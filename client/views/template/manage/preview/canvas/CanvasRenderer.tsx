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
import { useCanvasRenderStore } from "./stores/useCanvasRenderStore";

/**
 * Main canvas rendering component
 * Complexity: 14 (state + effects + timeout handling + imperative handle)
 * Optimized: Fonts, metrics, and images load in parallel
 * Canvas displays immediately, cache generation happens in background
 * Uses Zustand store for persistence across tab switches and remounts
 */
function CanvasRenderer(
  {
    templateId,
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
  
  // Use Zustand store for persistence across remounts
  const { isReady: isReadyInStore, setReady: setReadyInStore, setGenerationTime } = useCanvasRenderStore();
  const storeReady = isReadyInStore(templateId, renderScale, showDebugBorders);
  
  // Use local state to trigger re-renders, sync with store
  const [isReady, setIsReady] = React.useState(storeReady);
  
  const hasNotifiedReady = React.useRef(false);
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset ready state when key dependencies change
  React.useEffect(() => {
    logger.debug({ caller: "CanvasRenderer" }, "Resetting ready state", { 
      templateId, 
      renderScale, 
      showDebugBorders,
      elementCount: elements.length 
    });
    setIsReady(false);
    setReadyInStore(templateId, renderScale, showDebugBorders, false);
    hasNotifiedReady.current = false;
  }, [templateId, renderScale, showDebugBorders, setReadyInStore, elements, config]);

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

  // Main drawing effect - canvas displays immediately, cache happens in background
  React.useEffect(() => {
    logger.debug({ caller: "CanvasRenderer" }, "Drawing effect triggered", { 
      fontsLoaded, 
      metricsReady, 
      imagesLoaded,
      isReady,
      templateId 
    });
    
    if (!fontsLoaded || !metricsReady || !imagesLoaded) {
      logger.debug({ caller: "CanvasRenderer" }, "Resources not ready, waiting...", {
        fontsLoaded,
        metricsReady,
        imagesLoaded
      });
      setIsReady(false);
      setReadyInStore(templateId, renderScale, showDebugBorders, false);
      return;
    }

    // Always draw if dependencies change, even if store says it's ready
    // This ensures canvas content is up-to-date with new elements/config
    logger.debug({ caller: "CanvasRenderer" }, "Starting canvas draw", { templateId });
    setupTimeout();
    draw(); // Synchronous drawing
    logger.debug({ caller: "CanvasRenderer" }, "Canvas draw completed", { templateId });
    
    // Show canvas immediately after drawing and persist to store
    logger.debug({ caller: "CanvasRenderer" }, "Setting isReady to true", { templateId, wasReady: isReady });
    setIsReady(true);
    setReadyInStore(templateId, renderScale, showDebugBorders, true);
    
    // Store generation times
    setGenerationTime(
      templateId,
      renderScale,
      showDebugBorders,
      canvasGenerationTime,
      hashGenerationTimeRef?.current || 0
    );
    
    // Notify ready on next tick (after render)
    if (!hasNotifiedReady.current) {
      Promise.resolve().then(() => {
        notifyReady();
      });
    }

    return cleanup;
  }, [draw, fontsLoaded, metricsReady, imagesLoaded, templateId, renderScale, showDebugBorders, setReadyInStore, setGenerationTime, canvasGenerationTime]);

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
    if (!hasNotifiedReady.current) {
      hasNotifiedReady.current = true;
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

  logger.debug({ caller: "CanvasRenderer" }, "Render decision", { isReady, templateId, renderWidth, renderHeight });

  if (!isReady) {
    logger.debug({ caller: "CanvasRenderer" }, "Rendering loading spinner", { templateId });
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress color="info" size={20} />
      </Box>
    );
  }

  logger.debug({ caller: "CanvasRenderer" }, "Rendering canvas element", { templateId, renderWidth, renderHeight });
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

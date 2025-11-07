"use client";

import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import logger from "@/client/lib/logger";
import { FontProvider, FontContext } from "./FontContext";
import { useOpentypeMetrics } from "./useOpentypeMetrics";
import { layoutResizeDown, layoutTruncate, layoutWrap, drawLayout } from "./textLayout";
import { resolveTextContent } from "../editor/download/imageRenderer/textResolvers";
import { elementsByTemplateIdQueryDocument, templateConfigByTemplateIdQueryDocument } from "../editor/glqDocuments";
import { Box, CircularProgress } from "@mui/material";
import { useCanvasCacheStore } from "./canvasCacheStore";
import { createHash } from "crypto";

export interface ClientCanvasGeneratorProps {
  templateId: number;
  onExport?: (dataUrl: string) => void;
  onReady?: (timings: { canvasGenerationTime: number; hashGenerationTime: number }) => void;
  showDebugBorders?: boolean;
  renderScale?: number; // Multiplier for high-quality rendering (e.g., 2 = 2x resolution)
  timeoutMs?: number; // Maximum time allowed for generation in milliseconds
  onTimeout?: () => void; // Callback when generation exceeds timeout
}

export type ClientCanvasGeneratorRef = {
  download: () => void;
};

function collectFontFamilies(elements: GQL.CertificateElementUnion[]): string[] {
  const families = new Set<string>();
  for (const el of elements) {
    if (el.__typename === "TextElement") {
      const ref = el.textProps.fontRef;
      if (ref.__typename === "FontReferenceGoogle" && ref.identifier) {
        families.add(ref.identifier);
      } else {
        families.add("Roboto");
      }
    }
  }
  return Array.from(families);
}

/**
 * Load an image from URL and return as HTMLImageElement
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS for images
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Calculate image dimensions based on fit mode
 */
function calculateImageDimensions(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  fit: GQL.ElementImageFit
): { width: number; height: number; x: number; y: number } {
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  let finalWidth = containerWidth;
  let finalHeight = containerHeight;
  let offsetX = 0;
  let offsetY = 0;

  switch (fit) {
    case GQL.ElementImageFit.Fill:
      // Fill: stretch to container (no aspect ratio preservation)
      finalWidth = containerWidth;
      finalHeight = containerHeight;
      break;

    case GQL.ElementImageFit.Cover:
      // Cover: fill container, crop excess (preserve aspect ratio)
      if (imageAspect > containerAspect) {
        // Image is wider - fit height and crop width
        finalHeight = containerHeight;
        finalWidth = containerHeight * imageAspect;
        offsetX = -(finalWidth - containerWidth) / 2;
      } else {
        // Image is taller - fit width and crop height
        finalWidth = containerWidth;
        finalHeight = containerWidth / imageAspect;
        offsetY = -(finalHeight - containerHeight) / 2;
      }
      break;

    case GQL.ElementImageFit.Contain:
    default:
      // Contain: fit inside container, show all (preserve aspect ratio)
      if (imageAspect > containerAspect) {
        // Image is wider - fit width
        finalWidth = containerWidth;
        finalHeight = containerWidth / imageAspect;
        offsetY = (containerHeight - finalHeight) / 2;
      } else {
        // Image is taller - fit height
        finalHeight = containerHeight;
        finalWidth = containerHeight * imageAspect;
        offsetX = (containerWidth - finalWidth) / 2;
      }
      break;
  }

  return {
    width: finalWidth,
    height: finalHeight,
    x: offsetX,
    y: offsetY,
  };
}

/**
 * Draw debug border around element bounding box
 */
function drawDebugBorder(ctx: CanvasRenderingContext2D, element: GQL.CertificateElementBase, color = "red"): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(element.positionX, element.positionY, element.width, element.height);
  ctx.restore();
}

function CanvasInner(
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
  }: {
    elements: GQL.CertificateElementUnion[];
    config: GQL.TemplateConfig;
    onExport?: (d: string) => void;
    onReady?: (timings: { canvasGenerationTime: number; hashGenerationTime: number }) => void;
    showDebugBorders?: boolean;
    renderScale?: number;
    onDrawComplete?: (dataUrl: string) => void;
    timeoutMs?: number;
    onTimeout?: () => void;
    hashGenerationTimeRef?: React.MutableRefObject<number>;
  },
  ref: React.Ref<ClientCanvasGeneratorRef>
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { fontsLoaded, families } = React.useContext(FontContext);
  const { metricsReady, getFont } = useOpentypeMetrics(families);
  const didReady = React.useRef(false);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const imageCache = React.useRef<Map<string, HTMLImageElement>>(new Map());
  const timeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const canvasGenerationTimeRef = React.useRef<number>(0);

  // Load all images
  React.useEffect(() => {
    const imageElements = elements.filter((e): e is GQL.ImageElement => e.__typename === "ImageElement");

    if (imageElements.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const imageUrls = imageElements.map(el => el.imageDataSource?.imageUrl).filter((url): url is string => !!url);

    Promise.all(imageUrls.map(url => loadImage(url)))
      .then(images => {
        imageUrls.forEach((url, idx) => {
          imageCache.current.set(url, images[idx]);
        });
        setImagesLoaded(true);
      })
      .catch(error => {
        logger.error({ caller: "ClientCanvasGenerator" }, "Failed to load images", { error });
        setImagesLoaded(true); // Continue even if images fail to load
      });
  }, [elements]);

  const draw = React.useCallback(() => {
    const drawStartTime = performance.now();
    const canvas = canvasRef.current;
    if (!canvas || !fontsLoaded || !metricsReady || !imagesLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = config;
    const renderWidth = width * renderScale;
    const renderHeight = height * renderScale;

    // Clear and scale context for high-resolution rendering
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    ctx.save();
    ctx.scale(renderScale, renderScale);

    // Sort all elements by zIndex for proper layering
    const sortedElements = elements.slice().sort((a, b) => a.base.zIndex - b.base.zIndex);

    for (const el of sortedElements) {
      if (el.base.hidden) continue;

      if (el.__typename === "ImageElement") {
        // Render image element
        const imageUrl = el.imageDataSource?.imageUrl;
        if (!imageUrl) continue;

        const img = imageCache.current.get(imageUrl);
        if (!img) continue;

        const fit = el.imageProps?.fit || GQL.ElementImageFit.Contain;
        const {
          width: imgWidth,
          height: imgHeight,
          x: offsetX,
          y: offsetY,
        } = calculateImageDimensions(img.naturalWidth, img.naturalHeight, el.base.width, el.base.height, fit);

        // Save context for clipping
        ctx.save();

        // Clip to element bounds for COVER mode
        if (fit === GQL.ElementImageFit.Cover) {
          ctx.beginPath();
          ctx.rect(el.base.positionX, el.base.positionY, el.base.width, el.base.height);
          ctx.clip();
        }

        ctx.drawImage(img, el.base.positionX + offsetX, el.base.positionY + offsetY, imgWidth, imgHeight);

        ctx.restore();
      } else if (el.__typename === "TextElement") {
        // Render text element
        const text = resolveTextContent(el.textDataSource, config.language, "Text");
        const family =
          el.textProps.fontRef.__typename === "FontReferenceGoogle" && el.textProps.fontRef.identifier
            ? el.textProps.fontRef.identifier
            : "Roboto";
        const fontSize = el.textProps.fontSize;
        const color = el.textProps.color || "#000";
        const font = getFont(family);

        ctx.font = `${fontSize}px ${family}`;
        ctx.textBaseline = "alphabetic";

        let layout;
        if (el.textProps.overflow === GQL.ElementOverflow.Wrap) {
          layout = layoutWrap(ctx, text, el.base.width, font, fontSize);
        } else if (
          el.textProps.overflow === GQL.ElementOverflow.Ellipse ||
          el.textProps.overflow === GQL.ElementOverflow.Truncate
        ) {
          layout = layoutTruncate(ctx, text, el.base.width, fontSize, el.textProps.overflow, font);
        } else if (el.textProps.overflow === GQL.ElementOverflow.ResizeDown) {
          layout = layoutResizeDown(ctx, text, el.base.width, el.base.height, font, fontSize, family);
        } else {
          layout = layoutTruncate(ctx, text, el.base.width, fontSize, GQL.ElementOverflow.Truncate, font);
        }

        drawLayout(
          ctx,
          {
            x: el.base.positionX,
            y: el.base.positionY,
            width: el.base.width,
            height: el.base.height,
            color,
            alignment: el.base.alignment,
          },
          layout,
          font,
          family
        );
      }

      // Draw debug border if enabled
      if (showDebugBorders) {
        drawDebugBorder(ctx, el.base);
      }
    }

    ctx.restore();

    const drawEndTime = performance.now();
    const generationTime = drawEndTime - drawStartTime;
    canvasGenerationTimeRef.current = generationTime;

    if (onDrawComplete) {
      const dataUrl = canvas.toDataURL("image/png");
      onDrawComplete(dataUrl);
    }
  }, [
    elements,
    config,
    fontsLoaded,
    metricsReady,
    imagesLoaded,
    getFont,
    showDebugBorders,
    renderScale,
    onDrawComplete,
  ]);

  React.useEffect(() => {
    if (!fontsLoaded || !metricsReady || !imagesLoaded) return;

    // Set up timeout if timeoutMs is provided
    if (timeoutMs && !timeoutIdRef.current) {
      timeoutIdRef.current = setTimeout(() => {
        logger.warn({ caller: "ClientCanvasGenerator" }, "Canvas generation timeout exceeded", {
          timeoutMs,
        });
        onTimeout?.();
        timeoutIdRef.current = null;
      }, timeoutMs);
    }

    draw();

    if (!didReady.current) {
      didReady.current = true;
      onReady?.({
        canvasGenerationTime: canvasGenerationTimeRef.current,
        hashGenerationTime: hashGenerationTimeRef?.current || 0,
      });

      // Clear timeout on successful completion
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    }
  }, [draw, fontsLoaded, metricsReady, imagesLoaded, onReady, timeoutMs, onTimeout]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const download = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let exportCanvas = canvas;

    // If rendered at higher resolution, downsample for optimal quality
    if (renderScale > 1) {
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = config.width;
      outputCanvas.height = config.height;
      const outputCtx = outputCanvas.getContext("2d");

      if (outputCtx) {
        // Enable high-quality image smoothing for downsampling
        outputCtx.imageSmoothingEnabled = true;
        outputCtx.imageSmoothingQuality = "high";

        // Draw scaled-down version
        outputCtx.drawImage(canvas, 0, 0, config.width, config.height);
        exportCanvas = outputCanvas;
      }
    }

    const dataUrl = exportCanvas.toDataURL("image/png");
    onExport?.(dataUrl);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "certificate-preview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [onExport, renderScale, config.width, config.height]);

  React.useImperativeHandle(ref, () => ({ download }), [download]);

  const renderWidth = config.width * renderScale;
  const renderHeight = config.height * renderScale;

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

const CanvasInnerWithRef = React.forwardRef<
  ClientCanvasGeneratorRef,
  {
    elements: GQL.CertificateElementUnion[];
    config: GQL.TemplateConfig;
    onExport?: (d: string) => void;
    onReady?: (timings: { canvasGenerationTime: number; hashGenerationTime: number }) => void;
    showDebugBorders?: boolean;
    renderScale?: number;
    onDrawComplete?: (dataUrl: string) => void;
    timeoutMs?: number;
    onTimeout?: () => void;
    hashGenerationTimeRef?: React.MutableRefObject<number>;
  }
>(CanvasInner);

function generateDataHash(
  elements: GQL.CertificateElementUnion[],
  config: GQL.TemplateConfig,
  showDebugBorders: boolean,
  renderScale: number
): { hash: string; hashGenerationTime: number } {
  const startTime = performance.now();
  const dataString = JSON.stringify({ elements, config, showDebugBorders, renderScale });
  const hash = createHash("sha256").update(dataString).digest("hex");
  const hashGenerationTime = performance.now() - startTime;
  
  return { hash, hashGenerationTime };
}

export const ClientCanvasGenerator = React.forwardRef<ClientCanvasGeneratorRef, ClientCanvasGeneratorProps>(
  ({ templateId, onExport, onReady, showDebugBorders = true, renderScale = 1, timeoutMs, onTimeout }, ref) => {
    const { data: configData, error: configError } = useQuery(templateConfigByTemplateIdQueryDocument, {
      variables: { templateId },
      fetchPolicy: "cache-first",
    });
    const { data: elementsData, error: elementsError } = useQuery(elementsByTemplateIdQueryDocument, {
      variables: { templateId },
      fetchPolicy: "cache-first",
    });

    if (configError) {
      logger.error({ caller: "ClientCanvasGenerator" }, "config query error", { error: configError });
    }
    if (elementsError) {
      logger.error({ caller: "ClientCanvasGenerator" }, "elements query error", { error: elementsError });
    }

    const config = configData?.templateConfigByTemplateId;
    const elements = elementsData?.elementsByTemplateId;

    const { getCache, setCache } = useCanvasCacheStore();
    const hashGenerationTimeRef = React.useRef<number>(0);
    const dataHash = React.useMemo(() => {
      if (!config || !elements) return null;
      const result = generateDataHash(elements, config, showDebugBorders, renderScale);
      hashGenerationTimeRef.current = result.hashGenerationTime;
      return result.hash;
    }, [elements, config, showDebugBorders, renderScale]);

    const cachedCanvas = dataHash ? getCache(dataHash) : null;

    const handleDrawComplete = React.useCallback(
      (dataUrl: string) => {
        if (dataHash) {
          setCache(dataHash, dataUrl);
        }
      },
      [dataHash, setCache]
    );

    if (!config || !elements) return null;

    if (cachedCanvas) {
      return (
        <img
          src={cachedCanvas}
          alt="Certificate Preview"
          style={{ width: `${config.width}px`, height: `${config.height}px`, border: "1px solid #ccc" }}
        />
      );
    }

    const families = collectFontFamilies(elements);

    return (
      <FontProvider families={families}>
        <CanvasInnerWithRef
          ref={ref}
          elements={elements}
          config={config}
          onExport={onExport}
          onReady={onReady}
          showDebugBorders={showDebugBorders}
          renderScale={renderScale}
          onDrawComplete={handleDrawComplete}
          timeoutMs={timeoutMs}
          onTimeout={onTimeout}
          hashGenerationTimeRef={hashGenerationTimeRef}
        />
      </FontProvider>
    );
  }
);

ClientCanvasGenerator.displayName = "ClientCanvasGenerator";

export default ClientCanvasGenerator;

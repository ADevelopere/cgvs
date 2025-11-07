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

export interface ClientCanvasGeneratorProps {
  templateId: number;
  onExport?: (dataUrl: string) => void;
  onReady?: () => void;
  showDebugBorders?: boolean;
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
function drawDebugBorder(
  ctx: CanvasRenderingContext2D,
  element: GQL.CertificateElementBase,
  color = "red"
): void {
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
  }: {
    elements: GQL.CertificateElementUnion[];
    config: GQL.TemplateConfig;
    onExport?: (d: string) => void;
    onReady?: () => void;
    showDebugBorders?: boolean;
  },
  ref: React.Ref<ClientCanvasGeneratorRef>
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { fontsLoaded, families } = React.useContext(FontContext);
  const { metricsReady, getFont } = useOpentypeMetrics(families);
  const didReady = React.useRef(false);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const imageCache = React.useRef<Map<string, HTMLImageElement>>(new Map());

  // Load all images
  React.useEffect(() => {
    const imageElements = elements.filter((e): e is GQL.ImageElement => e.__typename === "ImageElement");
    
    if (imageElements.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const imageUrls = imageElements
      .map(el => el.imageDataSource?.imageUrl)
      .filter((url): url is string => !!url);

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
    const canvas = canvasRef.current;
    if (!canvas || !fontsLoaded || !metricsReady || !imagesLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = config;
    ctx.clearRect(0, 0, width, height);

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
        const { width: imgWidth, height: imgHeight, x: offsetX, y: offsetY } = calculateImageDimensions(
          img.naturalWidth,
          img.naturalHeight,
          el.base.width,
          el.base.height,
          fit
        );

        // Save context for clipping
        ctx.save();
        
        // Clip to element bounds for COVER mode
        if (fit === GQL.ElementImageFit.Cover) {
          ctx.beginPath();
          ctx.rect(el.base.positionX, el.base.positionY, el.base.width, el.base.height);
          ctx.clip();
        }

        ctx.drawImage(
          img,
          el.base.positionX + offsetX,
          el.base.positionY + offsetY,
          imgWidth,
          imgHeight
        );

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
        layout = layoutTruncate(ctx, text, el.base.width, fontSize);
      } else if (el.textProps.overflow === GQL.ElementOverflow.ResizeDown) {
        layout = layoutResizeDown(ctx, text, el.base.width, el.base.height, font, fontSize, family);
      } else {
        layout = layoutTruncate(ctx, text, el.base.width, fontSize);
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
  }, [elements, config, fontsLoaded, metricsReady, imagesLoaded, getFont, showDebugBorders]);

  React.useEffect(() => {
    if (!fontsLoaded || !metricsReady || !imagesLoaded) return;
    draw();
    if (!didReady.current) {
      didReady.current = true;
      onReady?.();
    }
  }, [draw, fontsLoaded, metricsReady, imagesLoaded, onReady]);

  const download = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onExport?.(dataUrl);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "certificate-preview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [onExport]);

  React.useImperativeHandle(ref, () => ({ download }), [download]);

  return (
    <canvas
      ref={canvasRef}
      width={config.width}
      height={config.height}
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
    onReady?: () => void;
    showDebugBorders?: boolean;
  }
>(CanvasInner);

export const ClientCanvasGenerator = React.forwardRef<ClientCanvasGeneratorRef, ClientCanvasGeneratorProps>(
  ({ templateId, onExport, onReady, showDebugBorders = true }, ref) => {
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

    if (!config || !elements) return null;

    const families = collectFontFamilies(elements);

    return (
      <FontProvider families={families}>
        <CanvasInnerWithRef ref={ref} elements={elements} config={config} onExport={onExport} onReady={onReady} showDebugBorders={showDebugBorders} />
      </FontProvider>
    );
  }
);

ClientCanvasGenerator.displayName = "ClientCanvasGenerator";

export default ClientCanvasGenerator;

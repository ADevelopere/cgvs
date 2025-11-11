import { Panel } from "@xyflow/react";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { useTheme } from "@mui/material/styles";
import React from "react";
import logger from "@/client/lib/logger";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "../../manage/editor/glqDocuments";
import { resolveTextContent } from "./textDemo";
import { getFontByFamily } from "@/lib/font/google";

// ============================================================================
// TYPES
// ============================================================================

interface DownloadPdfProps {
  templateId: number;
  showDebugBorders?: boolean;
}

interface TextMetrics {
  lines: string[];
  finalSize: number;
  lineHeight: number;
}

interface TextPosition {
  startY: number;
  getLineX: (lineIndex: number, lineWidth: number) => number;
}

// ============================================================================
// UTILITY FUNCTIONS - TEXT METRICS
// ============================================================================

/**
 * Measure the width of text at a given size
 */
function measureTextWidth(text: string, font: PDFFont, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

/**
 * Measure the line height for a font at a given size
 */
function measureLineHeight(font: PDFFont, size: number): number {
  return font.heightAtSize(size);
}

/**
 * Calculate total height of a text block
 */
function calculateTextBlockHeight(lineCount: number, lineHeight: number): number {
  return lineCount * lineHeight;
}

// ============================================================================
// OVERFLOW HANDLING ALGORITHMS
// ============================================================================

/**
 * TRUNCATE: Hard clip text to fit width (no ellipsis)
 */
function handleTruncate(text: string, maxWidth: number, font: PDFFont, size: number): string {
  let truncated = text;
  let textWidth = measureTextWidth(truncated, font, size);

  while (textWidth > maxWidth && truncated.length > 0) {
    truncated = truncated.substring(0, truncated.length - 1);
    textWidth = measureTextWidth(truncated, font, size);
  }

  return truncated;
}

/**
 * ELLIPSE: Truncate text and append "..." to fit width
 */
function handleEllipse(text: string, maxWidth: number, font: PDFFont, size: number): string {
  const ellipsis = "...";
  const ellipsisWidth = measureTextWidth(ellipsis, font, size);

  // Edge case: if ellipsis itself doesn't fit, return empty
  if (ellipsisWidth > maxWidth) {
    return "";
  }

  // If text already fits, return as-is
  const textWidth = measureTextWidth(text, font, size);
  if (textWidth <= maxWidth) {
    return text;
  }

  // Iteratively remove characters until text + ellipsis fits
  let truncated = text;
  let truncatedWidth = measureTextWidth(truncated, font, size);

  while (truncatedWidth + ellipsisWidth > maxWidth && truncated.length > 0) {
    truncated = truncated.substring(0, truncated.length - 1);
    truncatedWidth = measureTextWidth(truncated, font, size);
  }

  return truncated + ellipsis;
}

/**
 * WRAP: Break text into multiple lines that fit within maxWidth
 * Uses greedy word-wrap algorithm
 */
function handleWrap(text: string, maxWidth: number, font: PDFFont, size: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = measureTextWidth(testLine, font, size);

    if (testWidth > maxWidth) {
      // If current line has content, push it and start new line
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word is too long, truncate it
        const truncatedWord = handleTruncate(word, maxWidth, font, size);
        lines.push(truncatedWord);
        currentLine = "";
      }
    } else {
      currentLine = testLine;
    }
  }

  // Push remaining line
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}

/**
 * Process text based on overflow mode
 * Returns lines array and final font size
 */
function processTextOverflow(
  text: string,
  overflow: GQL.ElementOverflow,
  maxWidth: number,
  maxHeight: number,
  font: PDFFont,
  initialSize: number
): TextMetrics {
  const lineHeight = measureLineHeight(font, initialSize);

  switch (overflow) {
    case GQL.ElementOverflow.Truncate: {
      const truncated = handleTruncate(text, maxWidth, font, initialSize);
      return {
        lines: [truncated],
        finalSize: initialSize,
        lineHeight,
      };
    }

    case GQL.ElementOverflow.Ellipse: {
      const ellipsed = handleEllipse(text, maxWidth, font, initialSize);
      return {
        lines: [ellipsed],
        finalSize: initialSize,
        lineHeight,
      };
    }

    case GQL.ElementOverflow.Wrap: {
      const lines = handleWrap(text, maxWidth, font, initialSize);
      return {
        lines,
        finalSize: initialSize,
        lineHeight,
      };
    }

    case GQL.ElementOverflow.ResizeDown: {
      // For now, fallback to truncate
      // TODO: Implement binary search for font size reduction
      const truncated = handleTruncate(text, maxWidth, font, initialSize);
      return {
        lines: [truncated],
        finalSize: initialSize,
        lineHeight,
      };
    }

    default: {
      // Fallback to truncate
      const truncated = handleTruncate(text, maxWidth, font, initialSize);
      return {
        lines: [truncated],
        finalSize: initialSize,
        lineHeight,
      };
    }
  }
}

// ============================================================================
// ALIGNMENT CALCULATION
// ============================================================================

/**
 * Calculate text position based on alignment
 * Excludes BASELINE_* alignments (deferred)
 */
function calculateTextPosition(
  element: GQL.CertificateElementBase,
  lineCount: number,
  font: PDFFont,
  finalSize: number,
  lineHeight: number,
  pageHeight: number
): TextPosition {
  const alignment = element.alignment;

  // Convert element coordinates to PDF space
  const elX = element.positionX * 0.75; // pixels to points
  const elY = element.positionY * 0.75;
  const elWidth = element.width * 0.75;
  const elHeight = element.height * 0.75;

  // PDF coordinate system: origin at bottom-left
  const yTop = pageHeight - elY;
  const yBottom = yTop - elHeight;

  // Calculate text block metrics
  const fontHeight = measureLineHeight(font, finalSize);
  const blockHeight = calculateTextBlockHeight(lineCount, lineHeight);

  // Calculate starting Y position (baseline of first line)
  let startY: number;

  // Vertical alignment
  if (
    alignment === GQL.ElementAlignment.TopStart ||
    alignment === GQL.ElementAlignment.TopCenter ||
    alignment === GQL.ElementAlignment.TopEnd
  ) {
    // Top-aligned: first line baseline is fontHeight below top edge
    startY = yTop - fontHeight;
  } else if (
    alignment === GQL.ElementAlignment.CenterStart ||
    alignment === GQL.ElementAlignment.Center ||
    alignment === GQL.ElementAlignment.CenterEnd
  ) {
    // Center-aligned: center the text block vertically
    const verticalOffset = (elHeight - blockHeight) / 2;
    startY = yTop - verticalOffset - fontHeight;
  } else if (
    alignment === GQL.ElementAlignment.BottomStart ||
    alignment === GQL.ElementAlignment.BottomCenter ||
    alignment === GQL.ElementAlignment.BottomEnd
  ) {
    // Bottom-aligned: last line baseline is at bottom + blockHeight - fontHeight
    startY = yBottom + blockHeight - fontHeight;
  } else {
    // Baseline alignments - deferred, fallback to top
    startY = yTop - fontHeight;
  }

  // Horizontal alignment function (per-line)
  const getLineX = (lineIndex: number, lineWidth: number): number => {
    if (
      alignment === GQL.ElementAlignment.TopStart ||
      alignment === GQL.ElementAlignment.CenterStart ||
      alignment === GQL.ElementAlignment.BottomStart
    ) {
      // Start-aligned
      return elX;
    } else if (
      alignment === GQL.ElementAlignment.TopCenter ||
      alignment === GQL.ElementAlignment.Center ||
      alignment === GQL.ElementAlignment.BottomCenter
    ) {
      // Center-aligned
      return elX + (elWidth - lineWidth) / 2;
    } else if (
      alignment === GQL.ElementAlignment.TopEnd ||
      alignment === GQL.ElementAlignment.CenterEnd ||
      alignment === GQL.ElementAlignment.BottomEnd
    ) {
      // End-aligned
      return elX + elWidth - lineWidth;
    } else {
      // Baseline alignments - deferred, fallback to start
      return elX;
    }
  };

  return { startY, getLineX };
}

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Draw debug border around element bounding box
 */
function drawDebugBorder(
  page: PDFPage,
  element: GQL.CertificateElementBase,
  pageHeight: number,
  color = rgb(1, 0, 0) // Red by default
): void {
  const elX = element.positionX * 0.75; // pixels to points
  const elY = element.positionY * 0.75;
  const elWidth = element.width * 0.75;
  const elHeight = element.height * 0.75;

  // PDF coordinate system: origin at bottom-left
  const yTop = pageHeight - elY;

  page.drawRectangle({
    x: elX,
    y: yTop - elHeight,
    width: elWidth,
    height: elHeight,
    borderColor: color,
    borderWidth: 1,
  });
}

// ============================================================================
// IMAGE UTILITIES
// ============================================================================

/**
 * Fetch image from URL and return as Uint8Array
 */
async function fetchImageBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
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

// ============================================================================
// RENDERING
// ============================================================================

/**
 * Render image element with proper fit mode and alignment
 */
async function renderImageElement(
  element: GQL.ImageElement,
  page: PDFPage,
  pdfDoc: PDFDocument,
  pageHeight: number
): Promise<void> {
  if (element.base.hidden) return;

  const imageUrl = element.imageDataSource?.imageUrl;
  if (!imageUrl) {
    logger.error({ caller: "DownloadPdf" }, `Image element ${element.base.id} has no imageUrl`);
    return;
  }

  const fit = element.imageProps?.fit || GQL.ElementImageFit.Contain;

  try {
    // Fetch image bytes
    const imageBytes = await fetchImageBytes(imageUrl);

    // Embed image in PDF (supports PNG and JPEG)
    let image;
    try {
      // Try PNG first
      image = await pdfDoc.embedPng(imageBytes);
    } catch {
      try {
        // Fall back to JPEG
        image = await pdfDoc.embedJpg(imageBytes);
      } catch (error) {
        logger.error({ caller: "DownloadPdf" }, `Unsupported image format for element ${element.base.id}:`, error);
        return;
      }
    }

    // Get intrinsic image dimensions
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Convert element dimensions to PDF points
    const containerWidth = element.base.width * 0.75;
    const containerHeight = element.base.height * 0.75;
    const elX = element.base.positionX * 0.75;
    const elY = element.base.positionY * 0.75;

    // PDF coordinate system: origin at bottom-left
    const yTop = pageHeight - elY;

    // Calculate image dimensions based on fit mode
    const {
      width,
      height,
      x: offsetX,
      y: offsetY,
    } = calculateImageDimensions(imageWidth, imageHeight, containerWidth, containerHeight, fit);

    // Draw image
    // Note: For COVER mode, we may need to clip the image
    // pdf-lib doesn't have native clipping, so we adjust positioning
    page.drawImage(image, {
      x: elX + offsetX,
      y: yTop - containerHeight + offsetY,
      width,
      height,
    });
  } catch (error) {
    logger.error({ caller: "DownloadPdf" }, `Error rendering image element ${element.base.id}:`, error);
  }
}

/**
 * Render text element with proper overflow and alignment handling
 */
function renderTextElement(element: GQL.TextElement, page: PDFPage, font: PDFFont, config: GQL.TemplateConfig): void {
  if (element.base.hidden) return;

  const text = resolveTextContent(element.textDataSource, config.language, "Text");

  const fontSize = element.textProps.fontSize;
  const color = element.textProps.color || "#000000";
  const overflow = element.textProps.overflow;

  // Convert hex color to RGB
  const { r, g, b } = hexToRgb(color);

  // Convert element dimensions to PDF points
  const maxWidth = element.base.width * 0.75;
  const maxHeight = element.base.height * 0.75;

  // Process text based on overflow mode
  const { lines, finalSize, lineHeight } = processTextOverflow(text, overflow, maxWidth, maxHeight, font, fontSize);

  // Calculate text position based on alignment
  const { height: pageHeight } = page.getSize();
  const { startY, getLineX } = calculateTextPosition(
    element.base,
    lines.length,
    font,
    finalSize,
    lineHeight,
    pageHeight
  );

  // Render each line
  lines.forEach((line, index) => {
    const yLine = startY - index * lineHeight;
    const lineWidth = measureTextWidth(line, font, finalSize);
    const xLine = getLineX(index, lineWidth);

    page.drawText(line, {
      x: xLine,
      y: yLine,
      size: finalSize,
      font,
      color: rgb(r, g, b),
      lineHeight,
    });
  });
}

// ============================================================================
// FONT MANAGEMENT
// ============================================================================

/**
 * Collect unique font families from text elements
 */
function collectFontFamilies(elements: GQL.CertificateElementUnion[]): GQL.FontFamilyName[] {
  const families = new Set<GQL.FontFamilyName>();
  for (const el of elements) {
    if (el.__typename === "TextElement") {
      const ref = el.textProps.fontRef;
      if (ref.__typename === "FontReferenceGoogle" && ref.family) {
        families.add(ref.family);
      } else {
        families.add(GQL.FontFamilyName.Roboto);
      }
    }
  }
  return Array.from(families);
}

/**
 * Fetch font file and return as Uint8Array
 */
async function fetchFontBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Embed fonts in PDF document
 */
async function embedFontsForPdf(
  pdfDoc: PDFDocument,
  fontFamilies: GQL.FontFamilyName[]
): Promise<Map<GQL.FontFamilyName, PDFFont>> {
  const fontMap = new Map<GQL.FontFamilyName, PDFFont>();
  const fallbackFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Always add Roboto as fallback
  if (!fontFamilies.includes(GQL.FontFamilyName.Roboto)) {
    fontFamilies.push(GQL.FontFamilyName.Roboto);
  }

  for (const family of fontFamilies) {
    try {
      const fontItem = getFontByFamily(family);
      if (!fontItem) {
        logger.error({ caller: "DownloadPdf" }, `Font family "${family}" not found, using fallback`);
        fontMap.set(family, fallbackFont);
        continue;
      }

      // Get font URL (prioritize "regular" variant)
      const fontUrl = fontItem.files.regular || Object.values(fontItem.files)[0];
      if (!fontUrl) {
        logger.error({ caller: "DownloadPdf" }, `No font file found for family "${family}", using fallback`);
        fontMap.set(family, fallbackFont);
        continue;
      }

      // Fetch and embed font
      const fontBytes = await fetchFontBytes(fontUrl);
      const embeddedFont = await pdfDoc.embedFont(fontBytes);
      fontMap.set(family, embeddedFont);
    } catch (error) {
      logger.error({ caller: "DownloadPdf" }, `Error embedding font "${family}":`, error);
      fontMap.set(family, fallbackFont);
    }
  }

  return fontMap;
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  // Handle 3-character hex codes
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    const g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    const b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    return { r, g, b };
  }

  // Handle 6-character hex codes
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  return { r, g, b };
}

// ============================================================================
// PDF DOWNLOAD
// ============================================================================

/**
 * Trigger PDF download
 */
async function downloadPdf(pdfBytes: Uint8Array, filename: string = "certificate.pdf") {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ============================================================================
// COMPONENT
// ============================================================================

export const DownloadPdf: React.FC<DownloadPdfProps> = ({ templateId, showDebugBorders = true }) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const {
    data: configData,
    error: configError,
    loading: configLoading,
  } = useQuery(templateConfigByTemplateIdQueryDocument, {
    variables: { templateId: templateId! },
    skip: !templateId,
    fetchPolicy: "cache-first",
  });

  const {
    data: elementsData,
    error: elementsError,
    loading: elementsLoading,
  } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: templateId! },
    skip: !templateId,
    fetchPolicy: "cache-first",
  });

  const isDataReady =
    !configLoading &&
    !elementsLoading &&
    !!configData?.templateConfigByTemplateId &&
    !!elementsData?.elementsByTemplateId;

  const onClick = React.useCallback(async () => {
    if (!templateId) {
      logger.error({ caller: "DownloadPdf" }, "Template ID not found");
      return;
    }

    if (isGenerating || !isDataReady) return;

    if (configError) {
      logger.error({ caller: "DownloadPdf" }, "DownloadPdf: config query error", {
        error: configError,
      });
      return;
    }

    if (elementsError) {
      logger.error({ caller: "DownloadPdf" }, "DownloadPdf: elements query error", {
        error: elementsError,
      });
      return;
    }

    const config = configData?.templateConfigByTemplateId;
    const elements = elementsData?.elementsByTemplateId;

    if (!config || !elements) {
      logger.error({ caller: "DownloadPdf" }, "DownloadPdf: Missing config or elements");
      return;
    }

    const password = "123";
    // prompt("Enter a password to protect the PDF:");
    // if (!password) {
    //   logger.error({caller: "DownloadPdf"}, "PDF generation cancelled: No password provided.");
    //   return;
    // }

    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      // Register fontkit for custom font embedding
      pdfDoc.registerFontkit(fontkit);

      // Collect font families
      const fontFamilies = collectFontFamilies(elements);
      const fontMap = await embedFontsForPdf(pdfDoc, fontFamilies);

      // Convert pixels to points (1 point = 0.75 pixels)
      const pageWidth = config.width * 0.75;
      const pageHeight = config.height * 0.75;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const { height: pageHeightPdf } = page.getSize();

      // Sort all elements by zIndex to maintain proper layering
      const sortedElements = elements.slice().sort((a, b) => a.base.zIndex - b.base.zIndex);

      // Render elements in order
      for (const element of sortedElements) {
        if (element.__typename === "TextElement") {
          const family =
            element.textProps.fontRef.__typename === "FontReferenceGoogle" && element.textProps.fontRef.family
              ? element.textProps.fontRef.family
              : GQL.FontFamilyName.Roboto;

          const font = fontMap.get(family) || fontMap.get(GQL.FontFamilyName.Roboto)!;

          renderTextElement(element, page, font, config);
        } else if (element.__typename === "ImageElement") {
          await renderImageElement(element, page, pdfDoc, pageHeightPdf);
        }
        // TODO: Add support for other element types (DateElement, CountryElement, etc.)

        // Draw debug border if enabled
        if (showDebugBorders) {
          drawDebugBorder(page, element.base, pageHeightPdf);
        }
      }

      // Save PDF (with password protection if supported)
      const saveOptions: Parameters<typeof pdfDoc.save>[0] = {
        useObjectStreams: false,
      };

      // Try to add password protection (pdf-lib v1.17+ supports this)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saveOptionsWithPassword = saveOptions as any;
      if (password) {
        saveOptionsWithPassword.userPassword = password;
        saveOptionsWithPassword.ownerPassword = password;
      }

      const pdfBytes = await pdfDoc.save(saveOptionsWithPassword);

      await downloadPdf(pdfBytes, `certificate-${templateId}_experimental.pdf`);

      logger.info({ caller: "DownloadPdf" }, "PDF generated successfully (experimental)");
    } catch (error) {
      logger.error({ caller: "DownloadPdf" }, "Error generating PDF (experimental):", error);
    } finally {
      setIsGenerating(false);
    }
  }, [templateId, isGenerating, isDataReady, configData, elementsData, configError, elementsError]);

  return (
    <Panel position="top-center">
      <button
        className="download-btn xy-theme__button"
        onClick={onClick}
        disabled={isGenerating || !isDataReady}
        style={{
          padding: "8px 16px",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: "none",
          borderRadius: theme.shape.borderRadius,
          cursor: isGenerating || !isDataReady ? "not-allowed" : "pointer",
          opacity: isGenerating || !isDataReady ? 0.6 : 1,
          marginLeft: "8px",
        }}
      >
        {isGenerating ? <CircularProgress size={16} color="inherit" /> : "Download PDF (Experimental)"}
      </button>
    </Panel>
  );
};

export default DownloadPdf;

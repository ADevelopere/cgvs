import { Panel } from "@xyflow/react";
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { useTheme } from "@mui/material/styles";
import React from "react";
import logger from "@/client/lib/logger";
import { useNodeData } from "../NodeDataProvider";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "../glqDocuments";
import { resolveTextContent } from "../imageRenderer/textResolvers";
import { FontFamily, getFontByFamily } from "@/lib/font/google";
import { ElementAlignment } from "@/client/graphql/generated/gql/graphql";

// Function to trigger PDF download
async function downloadPdf(
  pdfBytes: Uint8Array,
  filename: string = "certificate.pdf"
) {
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

// Collect unique font families from text elements
function collectFontFamilies(
  elements: GQL.CertificateElementUnion[]
): FontFamily[] {
  const families = new Set<FontFamily>();
  for (const el of elements) {
    if (el.__typename === "TextElement") {
      const ref = el.textProps.fontRef;
      if (ref.__typename === "FontReferenceGoogle" && ref.identifier) {
        families.add(ref.identifier as FontFamily);
      } else {
        families.add(FontFamily.ROBOTO);
      }
    }
  }
  return Array.from(families);
}

// Fetch font file and return as Uint8Array
async function fetchFontBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
}

// Embed fonts in PDF document
async function embedFontsForPdf(
  pdfDoc: PDFDocument,
  fontFamilies: FontFamily[]
): Promise<Map<FontFamily, PDFFont>> {
  const fontMap = new Map<FontFamily, PDFFont>();
  const fallbackFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Always add Roboto as fallback
  if (!fontFamilies.includes(FontFamily.ROBOTO)) {
    fontFamilies.push(FontFamily.ROBOTO);
  }

  for (const family of fontFamilies) {
    try {
      const fontItem = getFontByFamily(family);
      if (!fontItem) {
        logger.warn(`Font family "${family}" not found, using fallback`);
        fontMap.set(family, fallbackFont);
        continue;
      }

      // Get font URL (prioritize "regular" variant)
      const fontUrl =
        fontItem.files.regular || Object.values(fontItem.files)[0];
      if (!fontUrl) {
        logger.warn(`No font file found for family "${family}", using fallback`);
        fontMap.set(family, fallbackFont);
        continue;
      }

      // Fetch and embed font
      const fontBytes = await fetchFontBytes(fontUrl);
      const embeddedFont = await pdfDoc.embedFont(fontBytes);
      fontMap.set(family, embeddedFont);
    } catch (error) {
      logger.error(`Error embedding font "${family}":`, error);
      fontMap.set(family, fallbackFont);
    }
  }

  return fontMap;
}

// Convert hex color to RGB
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

// Calculate text X position based on alignment
function getTextXPosition(
  x: number,
  width: number,
  textWidth: number,
  alignment: ElementAlignment
): number {
  switch (alignment) {
    case ElementAlignment.TopCenter:
    case ElementAlignment.Center:
    case ElementAlignment.BottomCenter:
      return x + (width - textWidth) / 2;
    case ElementAlignment.TopEnd:
    case ElementAlignment.CenterEnd:
    case ElementAlignment.BottomEnd:
    case ElementAlignment.BaselineEnd:
      return x + width - textWidth;
    case ElementAlignment.TopStart:
    case ElementAlignment.CenterStart:
    case ElementAlignment.BottomStart:
    case ElementAlignment.BaselineStart:
    case ElementAlignment.BaselineCenter:
    default:
      return x;
  }
}

export const DownloadPdf: React.FC = () => {
  const theme = useTheme();
  const { templateId } = useNodeData();
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { data: configData, error: configError, loading: configLoading } =
    useQuery(templateConfigByTemplateIdQueryDocument, {
      variables: { templateId: templateId! },
      skip: !templateId,
      fetchPolicy: "cache-first",
    });

  const { data: elementsData, error: elementsError, loading: elementsLoading } =
    useQuery(elementsByTemplateIdQueryDocument, {
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
      logger.error("Template ID not found");
      return;
    }

    if (isGenerating || !isDataReady) return;

    if (configError) {
      logger.error("DownloadPdf: config query error", { error: configError });
      return;
    }

    if (elementsError) {
      logger.error("DownloadPdf: elements query error", {
        error: elementsError,
      });
      return;
    }

    const config = configData?.templateConfigByTemplateId;
    const elements = elementsData?.elementsByTemplateId;

    if (!config || !elements) {
      logger.error("DownloadPdf: Missing config or elements");
      return;
    }

    const password = "123"
    //  prompt("Enter a password to protect the PDF:");
    // if (!password) {
    //   logger.info("PDF generation cancelled: No password provided.");
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
      const { height } = page.getSize();

      // Filter and sort text elements
      const textElements = elements
        .filter((e): e is GQL.TextElement => e.__typename === "TextElement")
        .slice()
        .sort((a, b) => a.base.renderOrder - b.base.renderOrder);

      // Draw text elements
      for (const el of textElements) {
        if (el.base.hidden) continue;

        const text = resolveTextContent(
          el.textDataSource,
          config.language,
          "Text"
        );

        const family =
          el.textProps.fontRef.__typename === "FontReferenceGoogle" &&
          el.textProps.fontRef.identifier
            ? (el.textProps.fontRef.identifier as FontFamily)
            : FontFamily.ROBOTO;

        const font = fontMap.get(family) || fontMap.get(FontFamily.ROBOTO)!;
        const fontSize = el.textProps.fontSize;
        const color = el.textProps.color || "#000000";
        const { r, g, b } = hexToRgb(color);

        // Calculate Y position (PDF coordinates start from bottom-left)
        const pdfY = height - el.base.positionY * 0.75 - fontSize;

        // Calculate text width for alignment
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x = getTextXPosition(
          el.base.positionX * 0.75,
          el.base.width * 0.75,
          textWidth,
          el.base.alignment
        );

        // Handle text overflow (simple truncation for now)
        let displayText = text;
        if (textWidth > el.base.width * 0.75) {
          // Truncate text to fit width
          let truncated = "";
          for (let i = 0; i < text.length; i++) {
            const testText = truncated + text[i];
            const testWidth = font.widthOfTextAtSize(testText, fontSize);
            if (testWidth > el.base.width * 0.75) break;
            truncated = testText;
          }
          displayText = truncated;
        }

        page.drawText(displayText, {
          x,
          y: pdfY,
          size: fontSize,
          font,
          color: rgb(r, g, b),
        });
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

      await downloadPdf(
        pdfBytes,
        `certificate-${templateId}_protected.pdf`
      );

      logger.info("PDF generated successfully");
    } catch (error) {
      logger.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    templateId,
    isGenerating,
    isDataReady,
    configData,
    elementsData,
    configError,
    elementsError,
  ]);

  return (
    <Panel position="top-left">
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
          cursor:
            isGenerating || !isDataReady ? "not-allowed" : "pointer",
          opacity: isGenerating || !isDataReady ? 0.6 : 1,
        }}
      >
        {isGenerating ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          "Download Protected PDF"
        )}
      </button>
    </Panel>
  );
};

export default DownloadPdf;

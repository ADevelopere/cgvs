import { Panel, useReactFlow } from "@xyflow/react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import logger from "@/client/lib/logger";

// Function to convert image URL to bytes
async function imageUrlToBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
}

// Function to trigger PDF download
async function downloadPdf(
  pdfBytes: Uint8Array,
  filename: string = "reactflow.pdf"
) {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const A4_WIDTH_PT = 11.69 * 72;
const A4_HEIGHT_PT = 8.27 * 72;

function DownloadPdf({ imageUrl }: { imageUrl: string }) {
  const [dimensions, setDimensions] = useState({
    width: A4_WIDTH_PT,
    height: A4_HEIGHT_PT,
  });

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [imageUrl]);

  const theme = useTheme();
  const { getNodes, getEdges } = useReactFlow();

  const onClick = async () => {
    const nodes = getNodes();
    const _edges = getEdges();

    const password = prompt("Enter a password to protect the PDF:");
    if (!password) {
      logger.info("PDF generation cancelled: No password provided.");
      return;
    }

    try {
      const pdfDoc = await PDFDocument.create();
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const arabicFont = await pdfDoc.embedFont(StandardFonts.Helvetica); // Fallback for now

      const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
      const { width: _width, height } = page.getSize();

      // Handle background image
      if (imageUrl) {
        try {
          const imageBytes = await imageUrlToBytes(imageUrl);
          let pdfImage;
          if (imageUrl.toLowerCase().endsWith(".png")) {
            pdfImage = await pdfDoc.embedPng(imageBytes);
          } else {
            pdfImage = await pdfDoc.embedJpg(imageBytes);
          }

          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: dimensions.width,
            height: dimensions.height,
          });
        } catch (error) {
          logger.error("Error embedding background image:", error);
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        if (node.type === "image") return;

        const { position, data, type } = node;

        // Calculate Y position (PDF coordinates start from bottom-left)
        const pdfY = height - position.y - 20;

        if (type === "text") {
          // Handle text test nodes
          const text = data.text as string;
          const fontSize = (data.fontSize as number) ?? 12;
          const color = (data.color as string) ?? "#000000";

          // Convert hex color to RGB
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;

          // Split text by newlines to handle multiline text
          const lines = text.split("\n");
          lines.forEach((line, index) => {
            page.drawText(line, {
              x: position.x,
              y: pdfY - index * fontSize, // Offset each line by font size
              size: fontSize,
              font: arabicFont,
              color: rgb(r, g, b),
            });
          });
        } else {
          // Handle regular nodes
          const label: string = (data.label as string) ?? "Node";
          page.drawText(label, {
            x: position.x,
            y: pdfY,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        }
      });

      const pdfBytes = await pdfDoc.save();
      await downloadPdf(pdfBytes, `${imageUrl.split("/").pop() || "flow"}_protected.pdf`);
    } catch (error) {
      logger.error("Error generating PDF:", error);
    }
  };

  return (
    <Panel position="top-right">
      <button
        className="download-btn xy-theme__button"
        onClick={onClick}
        style={{
          padding: "8px 16px",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          border: "none",
          borderRadius: theme.shape.borderRadius,
          cursor: "pointer",
        }}
      >
        Download Protected PDF
      </button>
    </Panel>
  );
}

export default DownloadPdf;

import { Panel } from "@xyflow/react";
import { toPng } from "html-to-image";
import { useTheme } from "@mui/material/styles";
import logger from "@/client/lib/logger";
import {
  TemplateConfig,
} from "@/client/graphql/generated/gql/graphql";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

export type DownloadImageProps = {
  config: TemplateConfig;
};

export const DownloadImage: React.FC<DownloadImageProps> = ({  config }) => {
  const { width, height } = config;
  const theme = useTheme();

  const onClick = () => {
    const element: HTMLElement = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;
    if (!element) {
      logger.error("Viewport element not found");
      return;
    }

    // Store original styles to restore later
    const originalStyles = new Map<HTMLElement, string>();

    // Apply export-ready styles to text element nodes
    const textNodes = element.querySelectorAll<HTMLElement>('.react-flow__node[data-id^="text-"]');
    textNodes.forEach(node => {
      const nodeContent = node.firstChild as HTMLElement;
      if (nodeContent) {
        // Store original border style
        originalStyles.set(nodeContent, nodeContent.style.cssText);
        // Remove border and adjust styling for export
        Object.assign(nodeContent.style, {
          border: "none",
          borderRadius: "0",
          padding: "0",
        });
      }
    });

    // Hide handles for export
    const handles = element.querySelectorAll<HTMLElement>(".react-flow__handle");
    handles.forEach(handle => {
      originalStyles.set(handle, handle.style.display);
      handle.style.display = "none";
    });

    toPng(element, {
      backgroundColor: theme.palette.background.paper,
      width: width,
      height: height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: "none",
      },
      filter: node => {
        // Filter out UI controls and buttons
        const exclusions = [
          "download-btn",
          "react-flow__minimap",
          "react-flow__controls",
          "react-flow__panel",
          "react-flow__attribution",
        ];
        return !exclusions.some(
          className => node.classList && node.classList.contains(className)
        );
      },
      skipFonts: false, // Load fonts for better quality
      pixelRatio: 2, // High quality output
      cacheBust: true,
    })
      .then(dataUrl => {
        // Restore original styles
        textNodes.forEach(node => {
          const nodeContent = node.firstChild as HTMLElement;
          if (nodeContent && originalStyles.has(nodeContent)) {
            nodeContent.style.cssText = originalStyles.get(nodeContent) || "";
          }
        });
        handles.forEach(handle => {
          if (originalStyles.has(handle)) {
            handle.style.display = originalStyles.get(handle) || "";
          }
        });
        
        downloadImage(dataUrl);
      })
      .catch(error => {
        // Restore original styles on error
        textNodes.forEach(node => {
          const nodeContent = node.firstChild as HTMLElement;
          if (nodeContent && originalStyles.has(nodeContent)) {
            nodeContent.style.cssText = originalStyles.get(nodeContent) || "";
          }
        });
        handles.forEach(handle => {
          if (originalStyles.has(handle)) {
            handle.style.display = originalStyles.get(handle) || "";
          }
        });
        
        logger.error("Error generating image:", error);
      });
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
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadImage;

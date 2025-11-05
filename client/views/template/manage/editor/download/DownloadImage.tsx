import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react"; // Simplified imports
import { toPng } from "html-to-image";
import { useTheme } from "@mui/material/styles";
import logger from "@/client/lib/logger";
import { TemplateConfig } from "@/server/types";

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
  const { width, height } = config

  const { getNodes } = useReactFlow(); // Use getNodes from the hook
  const theme = useTheme();

  const onClick = () => {
    const allNodes = getNodes(); // Get the array of Node objects

    // Pass the Node array directly to getNodesBounds
    // Remove the second argument (params object)
    const nodesBounds = getNodesBounds(allNodes);
    const _viewport = getViewportForBounds(
      nodesBounds,
      width,
      height,
      0.5,
      2,
      0
    );

    const element: HTMLElement = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;
    if (!element) {
      logger.error("Viewport element not found");
      return;
    }

    // Apply inline styles to nodes before capture
    const nodes = element.querySelectorAll<HTMLElement>(".react-flow__node");
    nodes.forEach(node => {
      // Type inference works here
      Object.assign(node.style, {
        position: "absolute",
        userSelect: "none",
        pointerEvents: "all",
        transformOrigin: "0 0",
        boxSizing: "border-box",
        minWidth: "150px",
      });
    });

    toPng(element, {
      backgroundColor: theme.palette.background.paper,
      width: width,
      height: height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
      },
      filter: node => {
        // Filter out any problematic elements
        const exclusions = [
          "download-btn",
          "react-flow__minimap",
          "react-flow__controls",
        ];
        return !exclusions.some(
          className => node.classList && node.classList.contains(className)
        );
      },
      skipFonts: true, // Skip font loading to avoid CORS issues
      pixelRatio: 2, // Increase quality
      cacheBust: true, // Avoid caching issues
    })
      .then(downloadImage)
      .catch(error => {
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

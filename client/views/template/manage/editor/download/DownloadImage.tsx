import { Panel } from "@xyflow/react";
import { useTheme } from "@mui/material/styles";
import logger from "@/client/lib/logger";
import React from "react";
import { useNodeData } from "../NodeDataProvider";
import { CircularProgress } from "@mui/material";
import { ClientCanvasGenerator } from "@/client/views/template/manage/preview";
import type { ClientCanvasGeneratorRef } from "@/client/views/template/manage/preview";


export const DownloadImage: React.FC = () => {
  const theme = useTheme();
  const { templateId } = useNodeData();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showGenerator, setShowGenerator] = React.useState(false);
  const generatorRef = React.useRef<ClientCanvasGeneratorRef>(null);

  const handleReady = React.useCallback(() => {
    try {
      generatorRef.current?.download();
    } catch (e) {
      logger.error("DownloadImage: export failed", { error: e });
    } finally {
      setIsGenerating(false);
      setShowGenerator(false);
    }
  }, []);

  const onClick = () => {
    if (!templateId) {
      logger.error("Template ID not found");
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);
    setShowGenerator(true);
  };

  return (
    <>
      <Panel position="top-right">
        <button
          className="download-btn xy-theme__button"
          onClick={onClick}
          disabled={isGenerating}
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            border: "none",
            borderRadius: theme.shape.borderRadius,
            cursor: isGenerating ? "not-allowed" : "pointer",
            opacity: isGenerating ? 0.6 : 1,
          }}
        >
          {isGenerating ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Download Image"
          )}
        </button>
      </Panel>

      {showGenerator && templateId && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            visibility: "hidden",
          }}
        >
          <ClientCanvasGenerator
            ref={generatorRef}
            templateId={templateId}
            onReady={handleReady}
            onExport={(dataUrl: string) => {
              // Keep existing behavior: trigger a download immediately as a fallback
              const a = document.createElement("a");
              a.setAttribute("download", "certificate.png");
              a.setAttribute("href", dataUrl);
              a.click();
            }}
          />
        </div>
      )}
    </>
  );
}

export default DownloadImage;

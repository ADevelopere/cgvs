import { Panel } from "@xyflow/react";
import { useTheme } from "@mui/material/styles";
import logger from "@/client/lib/logger";
import React from "react";
import { CircularProgress } from "@mui/material";
import { ClientCanvasGeneratorRef } from "../canvas";
import ClientCanvasGenerator from "../canvas/ClientCanvasGenerator";

type DownloadImageProps = {
  templateId: number;
  showDebugBorders?: boolean;
  inReactFlowEditor?: boolean;
  label?: React.ReactNode;
};

export const DownloadImage: React.FC<DownloadImageProps> = ({
  templateId,
  showDebugBorders = true,
  inReactFlowEditor = true,
  label = "Download",
}) => {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showGenerator, setShowGenerator] = React.useState(false);
  const generatorRef = React.useRef<ClientCanvasGeneratorRef>(null);

  const handleReady = React.useCallback(() => {
    try {
      generatorRef.current?.download();
    } catch (e) {
      logger.error({ caller: "DownloadImage" }, "DownloadImage: export failed", { error: e });
    } finally {
      setIsGenerating(false);
      setShowGenerator(false);
    }
  }, []);

  const onClick = React.useCallback(() => {
    if (!templateId) {
      logger.error({ caller: "DownloadImage" }, "Template ID not found");
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);
    setShowGenerator(true);
  }, [templateId, isGenerating]);

  const content = React.useMemo(() => {
    return (
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
        {isGenerating ? <CircularProgress size={16} color="inherit" /> : label}
      </button>
    );
  }, [isGenerating, onClick, theme]);

  return (
    <>
      {inReactFlowEditor ? <Panel position="top-right">{content}</Panel> : content}

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
            showDebugBorders={showDebugBorders}
            onReady={handleReady}
          />
        </div>
      )}
    </>
  );
};

export default DownloadImage;

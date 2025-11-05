import { Panel } from "@xyflow/react";
import { toPng } from "html-to-image";
import { useTheme } from "@mui/material/styles";
import logger from "@/client/lib/logger";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useLazyQuery } from "@apollo/client/react";
import { elementsByTemplateIdQueryDocument } from "../glqDocuments/element/element.documents";
import React from "react";
import { CertificateRenderer } from "../renderer/CertificateRenderer";
import { useNodeData } from "../NodeDataProvider";
import { CircularProgress } from "@mui/material";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "certificate.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

export type DownloadImageProps = {
  config: GQL.TemplateConfig;
};

export const DownloadImage: React.FC<DownloadImageProps> = ({ config }) => {
  const { width, height } = config;
  const theme = useTheme();
  const { templateId } = useNodeData();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showRenderer, setShowRenderer] = React.useState(false);
  const rendererRef = React.useRef<HTMLDivElement>(null);

  const [fetchElements, { data, loading }] = useLazyQuery(
    elementsByTemplateIdQueryDocument,
    {
      fetchPolicy: "network-only", // Always fetch fresh data
    }
  );

  const handleRendererReady = React.useCallback(() => {
    // Called when fonts are loaded and renderer is ready
    if (!rendererRef.current) {
      logger.error("Renderer container not found");
      setIsGenerating(false);
      setShowRenderer(false);
      return;
    }

    // Small delay to ensure rendering is complete
    setTimeout(() => {
      if (!rendererRef.current) return;

      toPng(rendererRef.current, {
        backgroundColor: "white",
        width: width,
        height: height,
        pixelRatio: 2, // High quality output
        cacheBust: true,
      })
        .then(dataUrl => {
          downloadImage(dataUrl);
          setIsGenerating(false);
          setShowRenderer(false);
        })
        .catch(error => {
          logger.error("Error generating image:", error);
          setIsGenerating(false);
          setShowRenderer(false);
        });
    }, 100);
  }, [width, height]);

  const onClick = () => {
    if (!templateId) {
      logger.error("Template ID not found");
      return;
    }

    if (isGenerating) {
      return; // Prevent multiple clicks
    }

    setIsGenerating(true);
    setShowRenderer(true);

    // Fetch fresh data from GraphQL
    fetchElements({
      variables: { templateId },
    });
  };

  return (
    <>
      <Panel position="top-right">
        <button
          className="download-btn xy-theme__button"
          onClick={onClick}
          disabled={isGenerating || loading}
          style={{
            padding: "8px 16px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            border: "none",
            borderRadius: theme.shape.borderRadius,
            cursor: isGenerating || loading ? "not-allowed" : "pointer",
            opacity: isGenerating || loading ? 0.6 : 1,
          }}
        >
          {isGenerating || loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Download Image"
          )}
        </button>
      </Panel>

      {/* Hidden renderer - only shown during image generation */}
      {showRenderer && data?.elementsByTemplateId && (
        <div
          ref={rendererRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            visibility: "hidden",
          }}
        >
          <CertificateRenderer
            elements={data.elementsByTemplateId}
            config={config}
            onReady={handleRendererReady}
          />
        </div>
      )}
    </>
  );
}

export default DownloadImage;

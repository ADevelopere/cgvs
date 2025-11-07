import React from "react";
import { Box, IconButton, Tooltip, TextField, Paper } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DownloadImage from "../editor/download/DownloadImage";
import ClientCanvasGenerator from "./ClientCanvasGenerator";
import { usePreviewStore } from "./usePreviewStore";

type PreviewProps = {
  templateId: number;
};

export const Preview: React.FC<PreviewProps> = ({ templateId }) => {
  const showDebugBorders = usePreviewStore(state => state.showDebugBorders);
  const renderScale = usePreviewStore(state => state.renderScale);
  const setShowDebugBorders = usePreviewStore(state => state.setShowDebugBorders);
  const setRenderScale = usePreviewStore(state => state.setRenderScale);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            {/* Canvas to render template */}
            <TransformComponent>
              <Box sx={{overflow: "auto", width: "fit-content", height: "fit-content" }}>
                <ClientCanvasGenerator
                  templateId={templateId}
                  showDebugBorders={showDebugBorders}
                  renderScale={renderScale}
                />
              </Box>
            </TransformComponent>

            {/* Floating toolbar */}
            <Paper
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: 2,
                padding: 2,
                minHeight: 300,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <TextField
                variant="outlined"
                type="number"
                size="small"
                value={renderScale ?? "1"}
                onChange={e => setRenderScale(Number(e.target.value))}
                slotProps={{
                  htmlInput: {
                    min: 0.5,
                    max: 10,
                    step: 0.1,
                  },
                }}
                sx={{
                  width: 50,
                  // Hide spin buttons on number input
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                }}
              >
                <Tooltip title="Zoom In" placement="left">
                  <IconButton onClick={() => zoomIn()} size="small">
                    <MuiIcons.ZoomIn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out" placement="left">
                  <IconButton onClick={() => zoomOut()} size="small">
                    <MuiIcons.ZoomOut />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset" placement="left">
                  <IconButton onClick={() => resetTransform()} size="small" color="primary">
                    <MuiIcons.RestartAlt />
                  </IconButton>
                </Tooltip>
              </Box>
              <Tooltip title={showDebugBorders ? "Hide Debug Borders" : "Show Debug Borders"} placement="left">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setShowDebugBorders(!showDebugBorders);
                  }}
                  size="small"
                  sx={{ minWidth: "auto", px: 1 }}
                >
                  <MuiIcons.BugReport color={showDebugBorders ? "warning" : "action"} />
                </IconButton>
              </Tooltip>
              <DownloadImage
                templateId={templateId}
                showDebugBorders={showDebugBorders}
                inReactFlowEditor={false}
                label={<MuiIcons.Download />}
              />
            </Paper>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
};

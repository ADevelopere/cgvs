import React from "react";
import { Box, Typography, IconButton, Tooltip, Button, TextField } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DownloadImage from "../editor/download/DownloadImage";
import ClientCanvasGenerator from "./ClientCanvasGenerator";

type PreviewProps = {
  templateId: number;
};

export const Preview: React.FC<PreviewProps> = ({ templateId }) => {
  const [showDebugBorders, setShowDebugBorders] = React.useState(false);
  const [renderScale, setRenderScale] = React.useState(5);

  const handleScaleChange = (scale: number) => {
    if (scale < 0.5 || scale > 10) return;
    setRenderScale(scale);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            {/* header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                padding: "1rem",
                width: { xs: "100%", md: "50%" },
              }}
            >
              {/* title */}
              <Typography variant="h4">Preview</Typography>
              {/* Canvas to render template */}

              <Box>
                <TextField
                  variant="standard"
                  label="Scale"
                  type="number"
                  value={renderScale ?? "1"}
                  onChange={e => handleScaleChange(Number(e.target.value))}
                  slotProps={{
                    htmlInput: {
                      min: 0.5,
                      max: 10,
                      step: 0.1,
                    },
                  }}
                />
                <Tooltip title="Zoom In">
                  <IconButton onClick={() => zoomIn()} sx={{ color: "white" }}>
                    <ZoomIn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton onClick={() => zoomOut()} sx={{ color: "white" }}>
                    <ZoomOut />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset">
                  <IconButton onClick={() => resetTransform()} sx={{ color: "white" }}>
                    <RestartAlt />
                  </IconButton>
                </Tooltip>
                {/* Button to download the preview */}
                <Button
                  color="primary"
                  onClick={() => {
                    setShowDebugBorders(prev => !prev);
                  }}
                  variant="contained"
                >
                  {showDebugBorders ? "Hide Debug Borders" : "Show Debug Borders"}
                </Button>

                <DownloadImage templateId={templateId} showDebugBorders={showDebugBorders} />
              </Box>
            </Box>

            {/* Canvas to render template */}
            <TransformComponent>
              <ClientCanvasGenerator
                templateId={templateId}
                showDebugBorders={showDebugBorders}
                renderScale={renderScale}
              />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
};

import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { PanelRight, PanelLeft } from "lucide-react";

interface DrawerToggleButtonProps {
  open: boolean;
  onClick: () => void;
  title: string;
  zIndex: number;
  isRtl: boolean;
}

const DrawerToggleButton: React.FC<DrawerToggleButtonProps> = ({
  open,
  onClick,
  title,
  zIndex,
  isRtl,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        ...(isRtl ? { left: 16 } : { right: 16 }),
        zIndex: zIndex,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Tooltip title={title}>
        <IconButton
          onClick={onClick}
          edge="start"
          color="inherit"
          aria-label="toggle drawer"
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 2,
            border: "1px solid",
            borderColor: "divider",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            "&:hover": {
              boxShadow: 4,
              backgroundColor: "background.paper",
            },
          }}
        >
          {isRtl ? (
            open ? (
              <PanelLeft />
            ) : (
              <PanelRight />
            )
          ) : open ? (
            <PanelRight />
          ) : (
            <PanelLeft />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default DrawerToggleButton;

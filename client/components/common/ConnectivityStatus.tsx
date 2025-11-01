"use client";

import React from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Wifi, WifiOff, Sync } from "@mui/icons-material";
import { useNetworkConnectivity } from "@/client/contexts";
import { useAppTranslation } from "@/client/locale";

export const ConnectivityStatus: React.FC = () => {
  const { isConnected, isChecking, checkConnectivity, lastChecked } =
    useNetworkConnectivity();
  const theme = useTheme();
  const { connectivityTranslations: strings } = useAppTranslation();

  const getColor = () => {
    if (isChecking) return theme.palette.warning.main;
    return isConnected ? theme.palette.success.main : theme.palette.error.main;
  };

  const getTooltipText = () => {
    if (isChecking) return strings.checkingConnection;
    if (isConnected) {
      const baseText = strings.connected;
      return lastChecked
        ? `${baseText} (${strings.lastChecked}: ${lastChecked.toLocaleTimeString()})`
        : baseText;
    }
    return `${strings.disconnected} - ${strings.clickToRetry}`;
  };

  const getIcon = () => {
    if (isChecking) return <Sync />;
    return isConnected ? <Wifi /> : <WifiOff />;
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton
        onClick={checkConnectivity}
        disabled={isChecking}
        sx={{
          color: getColor(),
          animation: isChecking ? "spin 1s linear infinite" : "none",
          transition: "color 0.3s ease",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
          "&:hover": {
            backgroundColor: `${getColor()}15`, // 15% opacity
          },
        }}
        size="medium"
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};

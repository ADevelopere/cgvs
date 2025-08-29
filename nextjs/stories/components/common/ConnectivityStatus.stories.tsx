import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";
import withGlobalStyles from "@/stories/Decorators";
import { Box, Toolbar, IconButton, Tooltip, useTheme } from "@mui/material";
import { Wifi, WifiOff, Sync } from "@mui/icons-material";
import {
  commonStoryArgTypes,
  CommonStoryArgTypesProps,
  defaultStoryArgs,
} from "@/stories/argTypes";
import AppRouterCacheProvider from "@/components/appRouter/AppRouterCacheProvider";
import useStoryTheme from "@/stories/useStoryTheme";
import useAppTranslation from "@/locale/useAppTranslation";
import ConnectivityTranslations from "@/locale/components/Connectivity";

type ConnectivityStatusStoryProps = CommonStoryArgTypesProps & {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked?: string;
};

// Mock ConnectivityStatus component that uses args directly
const MockConnectivityStatus: React.FC<{ 
  isConnected: boolean; 
  isChecking: boolean; 
  lastChecked?: string;
}> = ({ isConnected, isChecking, lastChecked }) => {
  const theme = useTheme();
  const strings: ConnectivityTranslations = useAppTranslation("connectivityTranslations");

  const getColor = () => {
    if (isChecking) return theme.palette.warning.main;
    return isConnected ? theme.palette.success.main : theme.palette.error.main;
  };

  const getTooltipText = () => {
    if (isChecking) return strings.checkingConnection;
    if (isConnected) {
      const baseText = strings.connected;
      return lastChecked
        ? `${baseText} (${strings.lastChecked}: ${new Date(lastChecked).toLocaleTimeString()})`
        : baseText;
    }
    return `${strings.disconnected} - ${strings.clickToRetry}`;
  };

  const getIcon = () => {
    if (isChecking) return <Sync />;
    return isConnected ? <Wifi /> : <WifiOff />;
  };

  const handleClick = () => {
    // Mock connectivity check - in a real scenario this would trigger actual connectivity check
    // eslint-disable-next-line no-console
    console.log("Connectivity check triggered");
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton
        onClick={handleClick}
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

export default {
  title: "Components/Common/ConnectivityStatus",
  component: MockConnectivityStatus,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes,
    isConnected: {
      control: { type: "boolean" },
      description: "Whether the app is connected to the server",
      table: {
        category: "Connectivity",
        order: 1,
      },
    },
    isChecking: {
      control: { type: "boolean" },
      description: "Whether a connectivity check is in progress",
      table: {
        category: "Connectivity", 
        order: 2,
      },
    },
    lastChecked: {
      control: { type: "text" },
      description: "ISO string of when connectivity was last checked (optional)",
      table: {
        category: "Connectivity",
        order: 3,
      },
    },
  },
} as Meta;

const Template: StoryFn<ConnectivityStatusStoryProps> = (args) => {
  useStoryTheme(args);

  return (
    <AppRouterCacheProvider>
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "background.default",
          color: "onBackground",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
            gap: 2,
          }}
        >
          <Box>Connectivity Status:</Box>
          <MockConnectivityStatus 
            isConnected={args.isConnected}
            isChecking={args.isChecking}
            lastChecked={args.lastChecked}
          />
        </Toolbar>
      </Box>
    </AppRouterCacheProvider>
  );
};

export const Connected = Template.bind({});
Connected.args = {
  ...defaultStoryArgs,
  isConnected: true,
  isChecking: false,
  lastChecked: new Date().toISOString(),
};

export const Disconnected = Template.bind({});
Disconnected.args = {
  ...defaultStoryArgs,
  isConnected: false,
  isChecking: false,
};

export const Checking = Template.bind({});
Checking.args = {
  ...defaultStoryArgs,
  isConnected: false,
  isChecking: true,
};
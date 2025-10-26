"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import EditorPane from "./EditorPane";

type EditorPaneViewControllerProps = {
  /**
   * Top header title content
   */
  topTitle?: React.ReactNode;
  /**
   * First pane header title content
   */
  firstPaneTitle: React.ReactNode;
  /**
   * Third pane header title content
   */
  thirdPaneTitle: React.ReactNode;
  /**
   * Show the visibility buttons in the top header (first pane and third pane)
   */
  showVisibilityButtonsInTopTitle?: boolean;
  /**
   * Show the collapse button in the first pane header
   */
  showFirstPaneCollapseButtonInHeader?: boolean;
  /**
   * Show the collapse button in the third pane header
   */
  showThirdPaneCollapseButtonInHeader?: boolean;
  /**
   * Disable the first pane button
   */
  firstPaneButtonDisabled: boolean;
  /**
   * Disable the third pane button
   */
  thirdPaneButtonDisabled: boolean;
  /**
   * Tooltip for the first pane button
   */
  firstPaneButtonTooltip: string;
  /**
   * Tooltip for the third pane button
   */
  thirdPaneButtonTooltip: string;
  /**
   * First pane content
   */
  firstPane: React.ReactNode;
  /**
   * Middle pane content
   */
  middlePane: React.ReactNode;
  /**
   * Third pane content
   */
  thirdPane: React.ReactNode;
  storageKey?: string;
};

const EditorPaneViewController: React.FC<EditorPaneViewControllerProps> = ({
  topTitle,
  firstPaneTitle,
  thirdPaneTitle,
  showVisibilityButtonsInTopTitle,
  showFirstPaneCollapseButtonInHeader,
  showThirdPaneCollapseButtonInHeader,
  firstPaneButtonDisabled,
  thirdPaneButtonDisabled,
  firstPaneButtonTooltip,
  thirdPaneButtonTooltip,
  firstPane,
  middlePane,
  thirdPane,
  storageKey,
}) => {
  const { theme } = useAppTheme();
  const [firstPaneVisible, setFirstPaneVisible] = useState<boolean>(true);
  const [thirdPaneVisible, setThirdPaneVisible] = useState<boolean>(true);
  const [firstPaneCollapsed, setFirstPaneCollapsed] = useState<boolean>(false);
  const [thirdPaneCollapsed, setThirdPaneCollapsed] = useState<boolean>(false);

  // Header button handlers - toggle collapse state
  const handleFirstPaneCollapse = useCallback(() => {
    setFirstPaneCollapsed(!firstPaneCollapsed);
  }, [firstPaneCollapsed]);

  const handleThirdPaneCollapse = useCallback(() => {
    setThirdPaneCollapsed(!thirdPaneCollapsed);
  }, [thirdPaneCollapsed]);

  // Uncollapse handlers - called when pane is resized while collapsed
  const handleFirstPaneUncollapse = useCallback(() => {
    setFirstPaneCollapsed(false);
  }, []);

  const handleThirdPaneUncollapse = useCallback(() => {
    setThirdPaneCollapsed(false);
  }, []);

  // Top title button handlers - toggle visibility (hide/show)
  const handleFirstPaneVisibility = useCallback(() => {
    setFirstPaneVisible(!firstPaneVisible);
  }, [firstPaneVisible]);

  const handleThirdPaneVisibility = useCallback(() => {
    setThirdPaneVisible(!thirdPaneVisible);
  }, [thirdPaneVisible]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 1,
      }}
    >
      {/* Optional Top Title Section */}
      {topTitle && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: theme.palette.divider,
            pb: 1,
          }}
        >
          {topTitle}
          {showVisibilityButtonsInTopTitle && (
            <Box>
              {/* First pane visibility button */}
              <Tooltip title={firstPaneButtonTooltip}>
                <span>
                  <IconButton
                    onClick={handleFirstPaneVisibility}
                    disabled={firstPaneButtonDisabled}
                  >
                    <PanelLeft />
                  </IconButton>
                </span>
              </Tooltip>
              {/* Third pane visibility button */}
              <Tooltip title={thirdPaneButtonTooltip}>
                <span>
                  <IconButton
                    onClick={handleThirdPaneVisibility}
                    disabled={thirdPaneButtonDisabled}
                  >
                    <PanelRight />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}

      {/* Main Flex Row Container */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          minHeight: `calc(100vh - 203px)`,
        }}
      >
        <EditorPane
          orientation="vertical"
          firstPane={{
            visible: firstPaneVisible,
            collapsed: firstPaneCollapsed,
            minRatio: 0.2,
          }}
          middlePane={{
            visible: true,
            minRatio: 0.4,
          }}
          thirdPane={{
            visible: thirdPaneVisible,
            collapsed: thirdPaneCollapsed,
            minRatio: 0.2,
          }}
          onFirstPaneUncollapse={handleFirstPaneUncollapse}
          onThirdPaneUncollapse={handleThirdPaneUncollapse}
          storageKey={storageKey}
        >
          {/* First Pane with Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            {/* First pane header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
                pb: 1,
                mb: 1,
                backgroundColor: "blue",
              }}
            >
              {/* First pane title */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  opacity: firstPaneCollapsed ? 0 : 1,
                  maxWidth: firstPaneCollapsed ? 0 : "100%",
                  transition:
                    "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {firstPaneTitle}
              </Box>
              {/* First pane collapse button */}
              {showFirstPaneCollapseButtonInHeader && (
                <Box sx={{ flexShrink: 0 }}>
                  <Tooltip title={firstPaneButtonTooltip}>
                    <IconButton
                      onClick={handleFirstPaneCollapse}
                      disabled={firstPaneButtonDisabled}
                    >
                      <PanelLeft />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            {/* First pane content */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                opacity: firstPaneCollapsed ? 0 : 1,
                maxHeight: firstPaneCollapsed ? 0 : "100%",
                transition:
                  "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {firstPane}
            </Box>
          </Box>

          {/* Middle Pane - No Header */}
          {middlePane}

          {/* Third Pane with Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            {/* Third pane header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
                pb: 1,
                mb: 1,
                backgroundColor: "red",
              }}
            >
              {/* Third pane title */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  opacity: thirdPaneCollapsed ? 0 : 1,
                  maxWidth: thirdPaneCollapsed ? 0 : "100%",
                  transition:
                    "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {thirdPaneTitle}
              </Box>
              {/* Third pane collapse button */}
              {showThirdPaneCollapseButtonInHeader && (
                <Box sx={{ flexShrink: 0 }}>
                  <Tooltip title={thirdPaneButtonTooltip}>
                    <IconButton
                      onClick={handleThirdPaneCollapse}
                      disabled={thirdPaneButtonDisabled}
                    >
                      <PanelRight />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            {/* Third pane content */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                opacity: thirdPaneCollapsed ? 0 : 1,
                maxHeight: thirdPaneCollapsed ? 0 : "100%",
                transition:
                  "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {thirdPane}
            </Box>
          </Box>
        </EditorPane>
      </Box>
    </Box>
  );
};

export default EditorPaneViewController;

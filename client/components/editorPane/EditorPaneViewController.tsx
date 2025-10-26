"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useMemo, useEffect } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import EditorPane from "./EditorPane";
import { getEditorPaneStore } from "./editorPaneStoreManager";
import { useEditorPaneLayout } from "./useEditorPaneLayout";

export type PaneConfig = {
  /**
   * Pane header title content
   */
  title: React.ReactNode;
  /**
   * Pane content
   */
  content: React.ReactNode;
  /**
   * Disable the pane button
   */
  buttonDisabled: boolean;
  /**
   * Tooltip for the pane button
   */
  buttonTooltip: string;
  /**
   * Show the collapse button in the pane header
   */
  showCollapseButtonInHeader?: boolean;
};

type EditorPaneViewControllerProps = {
  /**
   * Top header title content
   */
  topTitle?: React.ReactNode;
  /**
   * Show the visibility buttons in the top header (first pane and third pane)
   */
  showVisibilityButtonsInTopTitle?: boolean;
  /**
   * First pane configuration
   */
  firstPane: PaneConfig;
  /**
   * Middle pane content
   */
  middlePane: React.ReactNode;
  /**
   * Third pane configuration
   */
  thirdPane: PaneConfig;
  /**
   * Storage key for persisting pane states (required)
   */
  storageKey: string;
};

const EditorPaneViewController: React.FC<EditorPaneViewControllerProps> = ({
  topTitle,
  showVisibilityButtonsInTopTitle,
  firstPane,
  middlePane,
  thirdPane,
  storageKey,
}) => {
  const { theme } = useAppTheme();

  // Get store and subscribe to changes
  const store = useMemo(
    () => getEditorPaneStore(storageKey),
    [storageKey]
  );

  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate();
    });
    return unsubscribe;
  }, [store]);

  // Get calculator functions
  const calculator = useEditorPaneLayout(storageKey);

  // Read current state from store
  const paneState = store.getState();

  // Header button handlers - toggle collapse state
  const handleFirstPaneCollapse = useCallback(() => {
    calculator.handleCollapseToggle("first");
  }, [calculator]);

  const handleThirdPaneCollapse = useCallback(() => {
    calculator.handleCollapseToggle("third");
  }, [calculator]);

  // Uncollapse handlers - called when pane is resized while collapsed
  const handleFirstPaneUncollapse = useCallback(() => {
    calculator.handleCollapseToggle("first");
  }, [calculator]);

  const handleThirdPaneUncollapse = useCallback(() => {
    calculator.handleCollapseToggle("third");
  }, [calculator]);

  // Top title button handlers - toggle visibility (hide/show)
  const handleFirstPaneVisibility = useCallback(() => {
    calculator.handleVisibilityChange("first", !paneState.visibility.first);
  }, [calculator, paneState.visibility.first]);

  const handleThirdPaneVisibility = useCallback(() => {
    calculator.handleVisibilityChange("third", !paneState.visibility.third);
  }, [calculator, paneState.visibility.third]);

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
              <Tooltip title={firstPane.buttonTooltip}>
                <span>
                  <IconButton
                    onClick={handleFirstPaneVisibility}
                    disabled={firstPane.buttonDisabled}
                  >
                    <PanelLeft />
                  </IconButton>
                </span>
              </Tooltip>
              {/* Third pane visibility button */}
              <Tooltip title={thirdPane.buttonTooltip}>
                <span>
                  <IconButton
                    onClick={handleThirdPaneVisibility}
                    disabled={thirdPane.buttonDisabled}
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
            visible: paneState.visibility.first,
            collapsed: paneState.collapsed.first,
            minRatio: 0.2,
          }}
          middlePane={{
            visible: true,
            minRatio: 0.4,
          }}
          thirdPane={{
            visible: paneState.visibility.third,
            collapsed: paneState.collapsed.third,
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
              }}
            >
              {/* First pane collapse button */}
              {firstPane.showCollapseButtonInHeader && (
                <Box sx={{ flexShrink: 0 }}>
                  <Tooltip title={firstPane.buttonTooltip}>
                    <IconButton
                      onClick={handleFirstPaneCollapse}
                      disabled={firstPane.buttonDisabled}
                    >
                      <PanelLeft />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {/* First pane title */}
              <Box
                sx={{
                  flex: 1,
                  textAlign: "end",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  opacity: paneState.collapsed.first ? 0 : 1,
                  maxWidth: paneState.collapsed.first ? 0 : "100%",
                  transition:
                    "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {firstPane.title}
              </Box>
            </Box>
            {/* First pane content */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                opacity: paneState.collapsed.first ? 0 : 1,
                maxHeight: paneState.collapsed.first ? 0 : "100%",
                transition:
                  "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {firstPane.content}
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
                  opacity: paneState.collapsed.third ? 0 : 1,
                  maxWidth: paneState.collapsed.third ? 0 : "100%",
                  transition:
                    "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {thirdPane.title}
              </Box>
              {/* Third pane collapse button */}
              {thirdPane.showCollapseButtonInHeader && (
                <Box sx={{ flexShrink: 0 }}>
                  <Tooltip title={thirdPane.buttonTooltip}>
                    <IconButton
                      onClick={handleThirdPaneCollapse}
                      disabled={thirdPane.buttonDisabled}
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
                opacity: paneState.collapsed.third ? 0 : 1,
                maxHeight: paneState.collapsed.third ? 0 : "100%",
                transition:
                  "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {thirdPane.content}
            </Box>
          </Box>
        </EditorPane>
      </Box>
    </Box>
  );
};

export default EditorPaneViewController;

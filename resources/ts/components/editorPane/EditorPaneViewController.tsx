"use client";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/contexts/ThemeContext";
import EditorPane from "./EditorPane";

type EditorPaneViewControllerProps = {
    title: string;
    firstPaneButtonDisabled: boolean;
    thirdPaneButtonDisabled: boolean;
    firstPaneButtonTooltip: string;
    thirdPaneButtonTooltip: string;
    firstPane: React.ReactNode;
    middlePane: React.ReactNode;
    thirdPane: React.ReactNode;
    storageKey?: string;
};

const EditorPaneViewController: React.FC<EditorPaneViewControllerProps> = ({
    title,
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

    const handleFirstPaneVisibility = () => {
        setFirstPaneVisible(!firstPaneVisible);
    };

    const handleThirdPaneVisibility = () => {
        setThirdPaneVisible(!thirdPaneVisible);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                gap: 1,
                direction: theme.direction,
            }}
        >
            {/* Header with controls */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "start",
                    borderBottom: "1px solid",
                    borderColor: theme.palette.divider,
                }}
            >
                <Typography variant="h6">{title}</Typography>
                <Box sx={{ flex: 1 }} />
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
            </Box>

            {/* Editor Pane Layout */}
            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    minHeight: `calc(100vh - 203px)`,
                }}
            >
                <EditorPane
                    orientation="vertical"
                    direction={theme.direction}
                    firstPane={{
                        visible: firstPaneVisible,
                        minRatio: 0.2,
                    }}
                    middlePane={{
                        visible: true,
                        minRatio: 0.4,
                    }}
                    thirdPane={{
                        visible: thirdPaneVisible,
                        minRatio: 0.2,
                    }}
                    storageKey={storageKey}
                >
                    {firstPane}
                    {middlePane}
                    {thirdPane}
                </EditorPane>
            </Box>
        </Box>
    );
};

export default EditorPaneViewController;

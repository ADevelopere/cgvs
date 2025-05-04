"use client";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/contexts/ThemeContext";
import SplitPane from "./SplitPane";

type SplitPaneViewControllerProps = {
    title: string;
    firstPaneButtonDisabled: boolean;
    secondPaneButtonDisabled: boolean;
    firstPaneButtonTooltip: string;
    secondPaneButtonTooltip: string;
    firstPane: React.ReactNode;
    secondPane: React.ReactNode;
};

const SplitPaneViewController: React.FC<SplitPaneViewControllerProps> = ({
    title,
    firstPaneButtonDisabled,
    secondPaneButtonDisabled,
    firstPaneButtonTooltip,
    secondPaneButtonTooltip,
    firstPane,
    secondPane,
}) => {
    const { theme } = useAppTheme();
    const direction = "ltr";
    const [firstPaneVisible, setFirstPaneVisible] = useState<boolean>(true);
    const [secondPaneVisible, setSecondPaneVisible] = useState<boolean>(true);

    const handleFirstPaneVisibility = () => {
        setFirstPaneVisible(!firstPaneVisible);
    };

    const handleSecondPaneVisibility = () => {
        setSecondPaneVisible(!secondPaneVisible);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
            }}
        >
            {/* controllers */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px solid",
                    borderColor: theme.palette.divider,
                    mb: 2,
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: "16px" }}>
                    {title}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Box>
                    {/* first pane visibility button*/}
                    <Tooltip title={firstPaneButtonTooltip}>
                        <span>
                            <IconButton
                                onClick={handleFirstPaneVisibility}
                                disabled={
                                    firstPaneButtonDisabled ||
                                    !secondPaneVisible
                                }
                            >
                                <PanelRight />
                            </IconButton>
                        </span>
                    </Tooltip>
                    {/* second pane visibility button */}
                    <Tooltip title={secondPaneButtonTooltip}>
                        <span>
                            <IconButton
                                onClick={handleSecondPaneVisibility}
                                disabled={
                                    secondPaneButtonDisabled ||
                                    !firstPaneVisible
                                }
                            >
                                <PanelLeft />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    position: "relative",
                    minHeight: `calc(100vh -256px)`,
                }}
            >
                <SplitPane
                    orientation="vertical"
                    direction={direction}
                    firstPane={{
                        visible: firstPaneVisible,
                        minRatio: 0.3,
                    }}
                    secondPane={{
                        visible: secondPaneVisible,
                        minRatio: 0.3,
                    }}
                    resizerProps={{
                        style: {
                            cursor: "col-resize",
                        },
                    }}
                >
                    {firstPane}
                    {secondPane}
                </SplitPane>
            </Box>
        </Box>
    );
};

export default SplitPaneViewController;

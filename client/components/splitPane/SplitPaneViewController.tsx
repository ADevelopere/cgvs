"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import { PanelRight, PanelLeft } from "lucide-react";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import SplitPane from "./SplitPane";

type SplitPaneViewControllerProps = {
    title: React.ReactNode;
    firstPaneButtonDisabled: boolean;
    secondPaneButtonDisabled: boolean;
    firstPaneButtonTooltip: string;
    secondPaneButtonTooltip: string;
    firstPane: React.ReactNode;
    secondPane: React.ReactNode;
    style?: React.CSSProperties;
    storageKey?: string;
};

const SplitPaneViewController: React.FC<SplitPaneViewControllerProps> = ({
    title,
    firstPaneButtonDisabled,
    secondPaneButtonDisabled,
    firstPaneButtonTooltip,
    secondPaneButtonTooltip,
    firstPane,
    secondPane,
    style,
    storageKey,
}) => {
    const { theme } = useAppTheme();
    const [firstPaneVisible, setFirstPaneVisible] = useState<boolean>(true);
    const [secondPaneVisible, setSecondPaneVisible] = useState<boolean>(true);

    const handleFirstPaneVisibility = useCallback(() => {
        setFirstPaneVisible(!firstPaneVisible);
    }, [firstPaneVisible]);

    const handleSecondPaneVisibility = useCallback(() => {
        setSecondPaneVisible(!secondPaneVisible);
    }, [secondPaneVisible]);

    return (
        <Box
            sx={{
                height: "100%",

                ...style,
                display: "flex",
                flexDirection: "column",
            }}
            className="split-pane-view-controller"
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
                {title}
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

            <SplitPane
                orientation="vertical"
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
                style={{
                    flex: 1,
                    minHeight: `calc(100vh -256px)`,
                }}
                storageKey={storageKey}
            >
                {firstPane}
                {secondPane}
            </SplitPane>
        </Box>
    );
};

export default SplitPaneViewController;

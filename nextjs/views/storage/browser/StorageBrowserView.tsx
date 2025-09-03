"use client";
import React from "react";
import Box from "@mui/material/Box";
import SplitPaneViewController from "@/components/splitPane/SplitPaneViewController";
import StorageDirectoryTree from "./StorageDirectoryTree";
import StorageMainView from "./StorageMainView";
import StorageSearch from "./StorageSearch";
import useAppTranslation from "@/locale/useAppTranslation";
import SplitPane from "@/components/splitPane/SplitPane";

const StorageBrowserView: React.FC = () => {
    const { ui: translations } = useAppTranslation("storageTranslations");

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* <SplitPaneViewController
                title={<StorageSearch />}
                firstPaneButtonDisabled={true}
                secondPaneButtonDisabled={true}
                firstPaneButtonTooltip={translations.collapseFolder}
                secondPaneButtonTooltip={translations.expandFolder}
                firstPane={}
                secondPane={<StorageMainView />}
                storageKey="storage-browser-split-pane"
                style={{
                    height: "100%",
                    width: "100%",
                }}
            /> */}
            <StorageSearch />
            <SplitPane
                orientation="vertical"
                firstPane={{
                    visible: true,
                    minRatio: 0.1,
                }}
                secondPane={{
                    visible: true,
                    minRatio: 0.7,
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
                storageKey={"storage-browser-split-pane"}
            >
                <StorageDirectoryTree />
                <StorageMainView />
            </SplitPane>
        </Box>
    );
};

export default StorageBrowserView;

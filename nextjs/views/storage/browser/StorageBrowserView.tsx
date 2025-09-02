"use client";
import React from "react";
import Box from "@mui/material/Box";
import SplitPaneViewController from "@/components/splitPane/SplitPaneViewController";
import { StorageManagementCoreProvider } from "@/contexts/storage/StorageManagementCoreContext";
import { StorageManagementUIProvider } from "@/contexts/storage/StorageManagementUIContext";
import StorageDirectoryTree from "./StorageDirectoryTree";
import StorageMainView from "./StorageMainView";
import StorageSearch from "./StorageSearch";
import useAppTranslation from "@/locale/useAppTranslation";

const StorageBrowserViewContent: React.FC = () => {
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
            <SplitPaneViewController
                title={<StorageSearch />}
                firstPaneButtonDisabled={false}
                secondPaneButtonDisabled={false}
                firstPaneButtonTooltip={translations.collapseFolder}
                secondPaneButtonTooltip={translations.expandFolder}
                firstPane={<StorageDirectoryTree />}
                secondPane={<StorageMainView />}
                storageKey="storage-browser-split-pane"
                style={{
                    height: "100%",
                    width: "100%",
                }}
            />
        </Box>
    );
};

const StorageBrowserView: React.FC = () => {
    return (
        <StorageManagementCoreProvider>
            <StorageManagementUIProvider>
                <StorageBrowserViewContent />
            </StorageManagementUIProvider>
        </StorageManagementCoreProvider>
    );
};

export default StorageBrowserView;

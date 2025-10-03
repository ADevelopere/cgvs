import React from "react";
import { Box, Fade } from "@mui/material";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import StorageFilters from "./StorageFilters";
import StorageSelectionActions from "./StorageSelectionActions";

/**
 * Conditional toolbar container for the storage browser.
 * Switches between StorageFilters and StorageSelectionActions based on selection state.
 * Provides smooth transitions between the two states.
 */
const StorageToolbar: React.FC = () => {
    const { selectedItems } = useStorageManagementUI();

    const hasSelection = selectedItems.length > 0;

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: 64, // Ensure consistent height to prevent layout shift
                overflow: "hidden",
            }}
        >
            {/* Filters Component - Visible when no items are selected */}
            <Fade in={!hasSelection} timeout={200}>
                <Box
                    sx={{
                        position: hasSelection ? "absolute" : "relative",
                        top: 0,
                        left: 0,
                        right: 0,
                        visibility: hasSelection ? "hidden" : "visible",
                    }}
                >
                    <StorageFilters />
                </Box>
            </Fade>

            {/* Selection Actions Component - Visible when items are selected */}
            <Fade in={hasSelection} timeout={200}>
                <Box
                    sx={{
                        position: !hasSelection ? "absolute" : "relative",
                        top: 0,
                        left: 0,
                        right: 0,
                        visibility: !hasSelection ? "hidden" : "visible",
                    }}
                >
                    <StorageSelectionActions />
                </Box>
            </Fade>
        </Box>
    );
};

export default StorageToolbar;

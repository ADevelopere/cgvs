import React from "react";
import {
    Breadcrumbs,
    Typography,
    Link,
    Box,
    Tooltip,
    Chip,
} from "@mui/material";
import {
    Home as HomeIcon,
    ChevronRight as ChevronRightIcon,
    MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { useStorageManagementUI } from "@/client/contexts/storage/StorageManagementUIContext";
import { useAppTranslation } from "@/client/locale";
interface StorageBreadcrumbProps {
    /**
     * Optional custom path override. If not provided, uses current path from context.
     */
    path?: string;
    /**
     * Optional custom navigation handler. If not provided, uses navigateTo from context.
     */
    onNavigateToPath?: (path: string) => void;
}

/**
 * Breadcrumb navigation component for the storage browser.
 * Shows the current directory path with clickable navigation.
 * Implements intelligent truncation for long paths.
 */
const StorageBreadcrumb: React.FC<StorageBreadcrumbProps> = ({
    path: customPath,
    onNavigateToPath,
}) => {
    const { params, navigateTo } = useStorageManagementUI();
    const { ui: translations } = useAppTranslation("storageTranslations");

    // Use custom path if provided, otherwise use current path from context
    const currentPath = customPath || params.path;
    const handleNavigate = onNavigateToPath || navigateTo;

    // Split path into segments, filtering out empty strings
    const pathSegments = currentPath.split("/").filter(Boolean);

    // Always include root as first segment
    const allSegments = ["", ...pathSegments];

    // Determine if we need to truncate for long paths
    const maxSegments = 5; // Show up to 5 segments before truncating
    const shouldTruncate = allSegments.length > maxSegments;

    let displaySegments: Array<{
        name: string;
        path: string;
        isTruncated?: boolean;
    }>;

    if (shouldTruncate) {
        // Show first segment (root), ellipsis, and last 3 segments
        const firstSegment = allSegments[0];
        const lastThreeSegments = allSegments.slice(-3);

        displaySegments = [
            { name: firstSegment, path: "" }, // Always empty string for root
            { name: "...", path: "", isTruncated: true },
            ...lastThreeSegments.map((segment, index) => {
                const segmentIndex = allSegments.length - 3 + index;
                const pathSegments = allSegments.slice(1, segmentIndex + 1); // Skip the empty root segment
                return {
                    name: segment,
                    path: pathSegments.join("/"), // Join without leading slash
                };
            }),
        ];
    } else {
        displaySegments = allSegments.map((segment, index) => {
            if (index === 0) {
                // Root segment always has empty path
                return { name: segment, path: "" };
            } else {
                // For non-root segments, construct path without leading slash
                const pathSegments = allSegments.slice(1, index + 1); // Skip the empty root segment
                return {
                    name: segment,
                    path: pathSegments.join("/"),
                };
            }
        });
    }

    const handleBreadcrumbClick = (
        targetPath: string,
        isTruncated?: boolean,
    ) => {
        if (isTruncated) {
            // Don't navigate for truncated segments
            return;
        }
        handleNavigate(targetPath);
    };

    const getSegmentDisplay = (
        segment: { name: string; path: string; isTruncated?: boolean },
        isLast: boolean,
    ) => {
        // Root segment - show home icon
        if (segment.name === "" && segment.path === "") {
            return isLast ? (
                <Typography
                    variant="body1"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "medium",
                        color: "text.primary",
                    }}
                >
                    <HomeIcon sx={{ mr: 0.5, fontSize: "1.1rem" }} />
                    {translations.myDrive || "My Drive"}
                </Typography>
            ) : (
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => handleBreadcrumbClick(segment.path)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "text.secondary",
                        "&:hover": {
                            color: "primary.main",
                            textDecoration: "underline",
                        },
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        p: 0,
                    }}
                >
                    <HomeIcon sx={{ mr: 0.5, fontSize: "1.1rem" }} />
                    {translations.myDrive || "My Drive"}
                </Link>
            );
        }

        // Truncated segment - show ellipsis
        if (segment.isTruncated) {
            const fullPath = currentPath;
            return (
                <Tooltip title={fullPath} arrow>
                    <Chip
                        icon={<MoreHorizIcon />}
                        label="..."
                        variant="outlined"
                        size="small"
                        sx={{
                            height: 24,
                            "& .MuiChip-icon": {
                                fontSize: "1rem",
                            },
                            cursor: "default",
                        }}
                    />
                </Tooltip>
            );
        }

        // Regular segment
        const displayName = segment.name || translations.myDrive || "My Drive";

        return isLast ? (
            <Typography
                variant="body1"
                sx={{
                    fontWeight: "medium",
                    color: "text.primary",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {displayName}
            </Typography>
        ) : (
            <Tooltip title={displayName} arrow enterDelay={500}>
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => handleBreadcrumbClick(segment.path)}
                    sx={{
                        textDecoration: "none",
                        color: "text.secondary",
                        "&:hover": {
                            color: "primary.main",
                            textDecoration: "underline",
                        },
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        p: 0,
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {displayName}
                </Link>
            </Tooltip>
        );
    };

    return (
        <Box
            sx={{
                py: 1,
                px: 2,
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
            }}
        >
            <Breadcrumbs
                separator={<ChevronRightIcon fontSize="small" />}
                aria-label={
                    translations.breadcrumbNavigation || "breadcrumb navigation"
                }
                maxItems={shouldTruncate ? maxSegments : undefined}
                sx={{
                    "& .MuiBreadcrumbs-separator": {
                        color: "text.disabled",
                    },
                }}
            >
                {displaySegments.map((segment, index) => (
                    <Box key={`${segment.path}-${index}`}>
                        {getSegmentDisplay(
                            segment,
                            index === displaySegments.length - 1,
                        )}
                    </Box>
                ))}
            </Breadcrumbs>
        </Box>
    );
};

export default StorageBreadcrumb;

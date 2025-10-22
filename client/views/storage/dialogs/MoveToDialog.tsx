"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as MUI from "@mui/material";
import {
  Folder as FolderIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useStorageDataOperations } from "@/client/views/storage/hooks/useStorageDataOperations";
import {
  DirectoryTreeNode,
  StorageItem,
} from "@/client/views/storage/core/storage.type";
import { useAppTranslation } from "@/client/locale";
export interface MoveToDialogProps {
  open: boolean;
  onClose: () => void;
  items: StorageItem[];
}

const MoveToDialog: React.FC<MoveToDialogProps> = ({
  open,
  onClose,
  items,
}) => {
  const theme = MUI.useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");
  const { fetchDirectoryChildren, move } = useStorageDataOperations();

  // State
  const [currentPath, setCurrentPath] = useState<string>("");
  const [directories, setDirectories] = useState<DirectoryTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredItemPath, setHoveredItemPath] = useState<string | null>(null);

  // Load directories for the current path
  const loadDirectories = useCallback(
    async (path: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchDirectoryChildren(path || undefined);
        if (result) {
          setDirectories(result);
        } else {
          setError(
            translations.moveDialogFailedToLoad || "Failed to load directories"
          );
          setDirectories([]);
        }
      } catch {
        setError(
          translations.moveDialogUnexpectedError ||
            "An unexpected error occurred"
        );
        setDirectories([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      fetchDirectoryChildren,
      translations.moveDialogFailedToLoad,
      translations.moveDialogUnexpectedError,
    ]
  );

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCurrentPath("");
      setDirectories([]);
      setError(null);
      setIsLoading(false);
      setIsMoving(false);
      setHoveredItemPath(null);
      // Load root directories
      loadDirectories("");
    }
  }, [open, loadDirectories]);

  // Navigate to a directory
  const navigateToDirectory = useCallback(
    (path: string) => {
      setCurrentPath(path);
      loadDirectories(path);
    },
    [loadDirectories]
  );

  // Get breadcrumb segments
  const breadcrumbSegments = useMemo(() => {
    if (!currentPath) {
      return [{ name: translations.moveDialogRoot || "Root", path: "" }];
    }

    const segments = currentPath.split("/").filter(Boolean);
    const result = [{ name: translations.moveDialogRoot || "Root", path: "" }];

    let accumulatedPath = "";
    for (const segment of segments) {
      accumulatedPath += (accumulatedPath ? "/" : "") + segment;
      result.push({ name: segment, path: accumulatedPath });
    }

    return result;
  }, [currentPath, translations.moveDialogRoot]);

  // Check if a path is invalid for moving (would create cycles)
  const isPathInvalid = useCallback(
    (destinationPath: string) => {
      // Can't move to same location
      if (
        items.some(item => {
          const itemParentPath = item.path.substring(
            0,
            item.path.lastIndexOf("/")
          );
          return itemParentPath === destinationPath;
        })
      ) {
        return true;
      }

      // Can't move folder into itself or its children
      return items.some(item => {
        if ("contentType" in item) return false; // Files can't create cycles

        // Check if destination is the item itself or a child of the item
        return (
          destinationPath === item.path ||
          destinationPath.startsWith(item.path + "/")
        );
      });
    },
    [items]
  );

  // Handle move operation
  const handleMove = useCallback(async () => {
    if (isPathInvalid(currentPath)) {
      setError(
        translations.moveDialogInvalidDestination || "Invalid destination"
      );
      return;
    }

    setIsMoving(true);
    setError(null);

    try {
      const sourcePaths = items.map(item => item.path);
      const success = await move(sourcePaths, currentPath);

      if (success) {
        onClose();
      } else {
        setError(translations.moveDialogFailedToMove || "Failed to move items");
      }
    } catch {
      setError(
        translations.moveDialogUnexpectedError || "An unexpected error occurred"
      );
    } finally {
      setIsMoving(false);
    }
  }, [
    items,
    currentPath,
    isPathInvalid,
    move,
    onClose,
    translations.moveDialogInvalidDestination,
    translations.moveDialogFailedToMove,
    translations.moveDialogUnexpectedError,
  ]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    if (!isLoading && !isMoving) {
      onClose();
    }
  }, [isLoading, isMoving, onClose]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading && !isMoving) {
        event.preventDefault();
        handleClose();
      }
    },
    [handleClose, isLoading, isMoving]
  );

  // Navigate up one level
  const navigateUp = useCallback(() => {
    if (currentPath) {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      navigateToDirectory(parentPath);
    }
  }, [currentPath, navigateToDirectory]);

  // Refresh current directory
  const refreshDirectory = useCallback(() => {
    loadDirectories(currentPath);
  }, [loadDirectories, currentPath]);

  if (!items.length) {
    return null;
  }

  const canMove = !isLoading && !isMoving && !isPathInvalid(currentPath);
  const isCurrentLocationInvalid = isPathInvalid(currentPath);

  return (
    <MUI.Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      onKeyDown={handleKeyDown}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            height: "70vh",
            maxHeight: 600,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <MUI.DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          pb: 1,
          flexShrink: 0,
        }}
      >
        {translations.moveDialogTitle ||
          `Move ${items.length} item${items.length === 1 ? "" : "s"}`}
      </MUI.DialogTitle>

      <MUI.DialogContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
      >
        {/* Breadcrumb Navigation */}
        <MUI.Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <MUI.Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <MUI.Typography variant="subtitle2" color="text.secondary">
              {translations.moveDialogSelectDestination ||
                "Select destination folder"}
            </MUI.Typography>
            <MUI.Box sx={{ display: "flex", gap: 1 }}>
              <MUI.Tooltip title={translations.moveDialogGoUp || "Go up"}>
                <span>
                  <MUI.IconButton
                    size="small"
                    onClick={navigateUp}
                    disabled={!currentPath || isLoading}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </MUI.IconButton>
                </span>
              </MUI.Tooltip>
              <MUI.Tooltip title={translations.moveDialogRefresh || "Refresh"}>
                <MUI.IconButton
                  size="small"
                  onClick={refreshDirectory}
                  disabled={isLoading}
                >
                  <RefreshIcon fontSize="small" />
                </MUI.IconButton>
              </MUI.Tooltip>
            </MUI.Box>
          </MUI.Box>

          <MUI.Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ fontSize: "0.875rem" }}
          >
            {breadcrumbSegments.map((segment, index) => (
              <MUI.Link
                key={segment.path}
                component="button"
                variant="body2"
                onClick={() => navigateToDirectory(segment.path)}
                sx={{
                  color:
                    index === breadcrumbSegments.length - 1
                      ? theme.palette.text.primary
                      : theme.palette.primary.main,
                  textDecoration: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                disabled={isLoading}
              >
                {index === 0 && <HomeIcon fontSize="small" />}
                {segment.name}
              </MUI.Link>
            ))}
          </MUI.Breadcrumbs>
        </MUI.Box>

        {/* Directory List */}
        <MUI.Box sx={{ flex: 1, overflow: "auto" }}>
          {isLoading ? (
            <MUI.Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <MUI.CircularProgress size={40} />
            </MUI.Box>
          ) : error ? (
            <MUI.Box sx={{ p: 3 }}>
              <MUI.Alert severity="error" sx={{ borderRadius: 1 }}>
                {error}
              </MUI.Alert>
            </MUI.Box>
          ) : directories.length === 0 ? (
            <MUI.Box sx={{ p: 3, textAlign: "center" }}>
              <MUI.Typography color="text.secondary">
                {translations.moveDialogNoFolders || "No folders found"}
              </MUI.Typography>
            </MUI.Box>
          ) : (
            <MUI.List sx={{ p: 0 }}>
              {directories.map((directory, index) => {
                const isHovered = hoveredItemPath === directory.path;
                const isInvalid = isPathInvalid(directory.path);

                return (
                  <React.Fragment key={directory.path}>
                    <MUI.ListItem
                      disablePadding
                      onMouseEnter={() => setHoveredItemPath(directory.path)}
                      onMouseLeave={() => setHoveredItemPath(null)}
                    >
                      <MUI.ListItemButton
                        onClick={() => navigateToDirectory(directory.path)}
                        disabled={isLoading || isInvalid}
                        sx={{
                          py: 1.5,
                          px: 3,
                          opacity: isInvalid ? 0.5 : 1,
                          backgroundColor:
                            isHovered && !isInvalid
                              ? theme.palette.action.hover
                              : "transparent",
                        }}
                      >
                        <MUI.ListItemIcon sx={{ minWidth: 40 }}>
                          <FolderIcon
                            sx={{
                              color: isInvalid
                                ? theme.palette.text.disabled
                                : theme.palette.warning.main,
                            }}
                          />
                        </MUI.ListItemIcon>
                        <MUI.ListItemText
                          primary={directory.name}
                          sx={{
                            "& .MuiListItemText-primary": {
                              color: isInvalid
                                ? theme.palette.text.disabled
                                : theme.palette.text.primary,
                            },
                          }}
                        />
                        {isInvalid && (
                          <MUI.Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1 }}
                          >
                            {translations.moveDialogInvalid || "Invalid"}
                          </MUI.Typography>
                        )}
                      </MUI.ListItemButton>
                    </MUI.ListItem>
                    {index < directories.length - 1 && <MUI.Divider />}
                  </React.Fragment>
                );
              })}
            </MUI.List>
          )}
        </MUI.Box>

        {/* Current Selection Info */}
        {isCurrentLocationInvalid && (
          <MUI.Box
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <MUI.Alert severity="warning" sx={{ borderRadius: 1 }}>
              {translations.moveDialogCannotMoveHere ||
                "Cannot move items to this location"}
            </MUI.Alert>
          </MUI.Box>
        )}
      </MUI.DialogContent>

      <MUI.DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          gap: 1,
          flexShrink: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <MUI.Button
          onClick={handleClose}
          disabled={isLoading || isMoving}
          variant="outlined"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {translations.moveDialogCancel || "Cancel"}
        </MUI.Button>
        <MUI.Button
          onClick={handleMove}
          disabled={!canMove}
          variant="contained"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {isMoving ? (
            <>
              <MUI.CircularProgress size={16} sx={{ mr: 1 }} />
              {translations.moving || "Moving..."}
            </>
          ) : (
            translations.moveDialogMove || "Move Here"
          )}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

export default MoveToDialog;

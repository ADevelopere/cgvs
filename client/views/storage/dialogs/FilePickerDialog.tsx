"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useTheme } from "@mui/material";
import * as MUI from "@mui/material";
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ArrowUpward as ArrowUpwardIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import FileTypeIcon from "@/client/views/storage/browser/FileTypeIcon";
import FilePreview from "@/client/views/storage/browser/FilePreview";
import { useAppTranslation } from "@/client/locale";
import { StorageItemUnion as StorageItemType } from "@/client/views/storage/core/storage.type";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";
import { listFilesQueryDocument } from "../core/storage.documents";

export interface FilePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onFileSelect: (file: Graphql.FileInfo) => void;
  allowedFileTypes?: string[]; // Optional array of allowed content types (e.g., ['image/*', 'application/pdf'])
  title?: string; // Optional custom title
}

function isFile(item: StorageItemType): item is Graphql.FileInfo {
  return item.__typename === "FileInfo";
}

const FilePickerDialogContent: React.FC<FilePickerDialogProps> = ({
  open,
  onClose,
  onFileSelect,
  allowedFileTypes,
  title,
}) => {
  const theme = useTheme();
  const { ui: translations } = useAppTranslation("storageTranslations");

  // Query variables state
  const [queryVariables, setQueryVariables] = useState<Graphql.ListFilesQueryVariables>({
    input: {
      path: "",
      limit: 1000,
      offset: 0,
    }
  });

  // Use Apollo Client hook to fetch files list
  const { data, loading, error: queryError } = useQuery(
    listFilesQueryDocument,
    {
      variables: queryVariables,
      skip: !open, // Only run query when dialog is open
    }
  );

  // UI State
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Graphql.FileInfo | null>(
    null
  );

  // Derive data from query
  const items = useMemo(() => {
    if (!data?.listFiles?.items) return [];
    return data.listFiles.items as StorageItemType[];
  }, [data]);

  const error = useMemo(() => {
    if (queryError) {
      return translations.filePickerDialogUnexpectedError || "An unexpected error occurred";
    }
    if (data && !data.listFiles) {
      return translations.filePickerDialogFailedToLoad || "Failed to load files";
    }
    return null;
  }, [queryError, data, translations]);

  // Use refs to access latest values without causing re-renders
  const allowedFileTypesRef = useRef(allowedFileTypes);
  useEffect(() => {
    allowedFileTypesRef.current = allowedFileTypes;
  }, [allowedFileTypes]);

  // Filter items to show only folders and allowed files
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Always show folders (DirectoryInfo)
      if (item.__typename === "DirectoryInfo") {
        return true;
      }

      // For files (FileInfo), check file type restrictions
      if (isFile(item)) {
        // If no file type restrictions, show all files
        if (!allowedFileTypes || allowedFileTypes.length === 0) {
          return true;
        }

        // Check if file matches allowed types
        return allowedFileTypes.some(allowedType => {
          if (allowedType.endsWith("/*")) {
            const baseType = allowedType.slice(0, -2);
            return item.contentType?.startsWith(baseType);
          }
          return item.contentType === allowedType;
        });
      }

      return false;
    });
  }, [items, allowedFileTypes]);

  // Separate folders and files for better organization
  const folders = useMemo(
    () => filteredItems.filter(item => item.__typename === "DirectoryInfo"),
    [filteredItems]
  );

  const files = useMemo(
    () => filteredItems.filter(item => item.__typename === "FileInfo"),
    [filteredItems]
  );

  // Handle dialog open/close
  useEffect(() => {
    if (open) {
      logger.info("FilePickerDialog opened", { allowedFileTypes, title });
      setCurrentPath("");
      setSelectedFile(null);
      setIsSelecting(false);
      setQueryVariables({
        input: { path: "", limit: 1000, offset: 0 }
      });
    }
  }, [open, allowedFileTypes, title]);

  // Navigate to a directory
  const navigateToDirectory = useCallback(
    (path: string) => {
      logger.info("Navigating to directory", {
        fromPath: currentPath,
        toPath: path,
      });
      setCurrentPath(path);
      setSelectedFile(null);
      setQueryVariables({
        input: {
          path: path,
          limit: 1000,
          offset: 0,
        }
      });
    },
    [currentPath]
  );

  // Get breadcrumb segments
  const breadcrumbSegments = useMemo(() => {
    if (!currentPath) {
      return [{ name: translations.myDrive || "My Drive", path: "" }];
    }

    const segments = currentPath.split("/").filter(Boolean);
    const result = [{ name: translations.myDrive || "My Drive", path: "" }];

    let accumulatedPath = "";
    for (const segment of segments) {
      accumulatedPath += (accumulatedPath ? "/" : "") + segment;
      result.push({ name: segment, path: accumulatedPath });
    }

    return result;
  }, [currentPath, translations.myDrive]);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: Graphql.FileInfo) => {
      logger.info("File selection initiated", {
        fileName: file.name,
        filePath: file.path,
        fileSize: file.size,
        contentType: file.contentType,
        currentPath,
      });

      setIsSelecting(true);

      try {
        logger.info("Calling onFileSelect callback", { fileName: file.name });
        onFileSelect(file);
        logger.info("Calling onClose callback after file selection");
        onClose();
        logger.info("File selection completed successfully", {
          fileName: file.name,
        });
      } catch (error) {
        logger.error("Error during file selection", {
          fileName: file.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsSelecting(false);
        logger.info("File selection process finished", { fileName: file.name });
      }
    },
    [
      onFileSelect,
      onClose,
      currentPath,
    ]
  );

  // Handle dialog close
  const handleClose = useCallback(() => {
    logger.info("FilePickerDialog close requested", {
      loading,
      isSelecting,
      currentPath,
      selectedFile: selectedFile?.name,
    });

    if (!loading && !isSelecting) {
      logger.info("FilePickerDialog closing");
      onClose();
    } else {
      logger.warn("FilePickerDialog close blocked", {
        reason: loading ? "loading" : "selecting",
      });
    }
  }, [loading, isSelecting, onClose, currentPath, selectedFile?.name]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && !loading && !isSelecting) {
        event.preventDefault();
        handleClose();
      }
    },
    [handleClose, loading, isSelecting]
  );

  // Navigate up one level
  const navigateUp = useCallback(() => {
    if (currentPath) {
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      logger.info("Navigating up one level", {
        fromPath: currentPath,
        toPath: parentPath,
      });
      setCurrentPath(parentPath);
      setSelectedFile(null);
      setQueryVariables({
        input: {
          path: parentPath,
          limit: 1000,
          offset: 0,
        }
      });
    } else {
      logger.warn("Cannot navigate up - already at root", { currentPath });
    }
  }, [currentPath]);

  // Refresh current directory
  const refreshDirectory = useCallback(() => {
    logger.info("Refreshing current directory", { currentPath });
    // Just re-set the same variables to trigger a refetch
    setQueryVariables(prev => ({ ...prev }));
  }, [currentPath]);

  const dialogTitle =
    title || translations.filePickerDialogTitle || "Select a file";
  const canSelect = selectedFile && !loading && !isSelecting;

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
        {dialogTitle}
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
              {translations.filePickerDialogSelectFile || "Select a file"}
            </MUI.Typography>
            <MUI.Box sx={{ display: "flex", gap: 1 }}>
              <MUI.Tooltip title={translations.moveDialogGoUp || "Go up"}>
                <span>
                  <MUI.IconButton
                    size="small"
                    onClick={navigateUp}
                    disabled={!currentPath || loading}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </MUI.IconButton>
                </span>
              </MUI.Tooltip>
              <MUI.Tooltip title={translations.moveDialogRefresh || "Refresh"}>
                <MUI.IconButton
                  size="small"
                  onClick={refreshDirectory}
                  disabled={loading}
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
                onClick={() => {
                  logger.info("Breadcrumb clicked for navigation", {
                    segmentName: segment.name,
                    segmentPath: segment.path,
                    currentPath,
                  });
                  navigateToDirectory(segment.path);
                }}
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
                disabled={loading}
              >
                {index === 0 && <HomeIcon fontSize="small" />}
                {segment.name}
              </MUI.Link>
            ))}
          </MUI.Breadcrumbs>
        </MUI.Box>

        {/* Items List */}
        <MUI.Box sx={{ flex: 1, overflow: "auto" }}>
          {loading ? (
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
          ) : filteredItems.length === 0 ? (
            <MUI.Box sx={{ p: 3, textAlign: "center" }}>
              <MUI.Typography color="text.secondary">
                {translations.filePickerDialogNoFiles ||
                  "No files found in this folder"}
              </MUI.Typography>
            </MUI.Box>
          ) : (
            <MUI.Box>
              {/* Folders - Table format for navigation */}
              {folders.length > 0 && (
                <MUI.Box sx={{ mb: 2 }}>
                  <MUI.Typography
                    variant="subtitle2"
                    sx={{ mb: 1, px: 2, color: "text.secondary" }}
                  >
                    Folders
                  </MUI.Typography>
                  <MUI.Table size="small">
                    <MUI.TableBody>
                      {folders.map(folder => (
                        <MUI.TableRow
                          key={folder.path}
                          hover
                          onClick={() => {
                            logger.info("Folder clicked for navigation", {
                              folderName: folder.name,
                              folderPath: folder.path,
                              currentPath,
                            });
                            navigateToDirectory(folder.path);
                          }}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <MUI.TableCell>
                            <MUI.Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <FileTypeIcon
                                item={folder}
                                sx={{
                                  fontSize: "1.5rem",
                                  color: theme.palette.warning.main,
                                }}
                              />
                              <MUI.Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {folder.name}
                              </MUI.Typography>
                            </MUI.Box>
                          </MUI.TableCell>
                          <MUI.TableCell align="right">
                            <MUI.Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Folder
                            </MUI.Typography>
                          </MUI.TableCell>
                        </MUI.TableRow>
                      ))}
                    </MUI.TableBody>
                  </MUI.Table>
                </MUI.Box>
              )}

              {/* Files - Grid format with previews */}
              {files.length > 0 && (
                <MUI.Box>
                  <MUI.Typography
                    variant="subtitle2"
                    sx={{ mb: 1, px: 2, color: "text.secondary" }}
                  >
                    Files
                  </MUI.Typography>
                  <MUI.Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    {files.map(file => {
                      // Since we filtered by __typename === "FileInfo", this is guaranteed to be FileInfo
                      if (file.__typename !== "FileInfo") return null;

                      const isSelected = selectedFile?.path === file.path;

                      return (
                        <MUI.Box
                          key={file.path}
                          onClick={() => {
                            logger.info("File clicked for selection", {
                              fileName: file.name,
                              filePath: file.path,
                              currentPath,
                            });
                            setSelectedFile(file);
                          }}
                          onDoubleClick={() => {
                            logger.info(
                              "File double-clicked for immediate selection",
                              {
                                fileName: file.name,
                                filePath: file.path,
                                currentPath,
                              }
                            );
                            setSelectedFile(file);
                            handleFileSelect(file);
                          }}
                          sx={{
                            border: 1,
                            borderColor: isSelected
                              ? "primary.main"
                              : "divider",
                            borderRadius: 1,
                            p: 1,
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? "action.selected"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isSelected
                                ? "action.selected"
                                : "action.hover",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* File Preview */}
                          <FilePreview item={file} height={100} />

                          {/* File Info */}
                          <MUI.Box sx={{ mt: 1 }}>
                            <MUI.Typography
                              variant="caption"
                              sx={{
                                fontWeight: 500,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.2,
                              }}
                            >
                              {file.name}
                            </MUI.Typography>
                            <MUI.Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {file.size
                                ? `${Math.round(file.size / 1024)} KB`
                                : ""}
                            </MUI.Typography>
                          </MUI.Box>
                        </MUI.Box>
                      );
                    })}
                  </MUI.Box>
                </MUI.Box>
              )}
            </MUI.Box>
          )}
        </MUI.Box>

        {/* Show message when there are only folders but no files */}
        {filteredItems.length > 0 &&
          files.length === 0 &&
          folders.length > 0 && (
            <MUI.Box sx={{ p: 3, textAlign: "center" }}>
              <MUI.Typography variant="body2" color="text.secondary">
                No files found in this folder. Navigate to a folder to browse
                for files.
              </MUI.Typography>
            </MUI.Box>
          )}

        {/* Selected File Info */}
        {selectedFile && (
          <MUI.Box
            sx={{
              px: 3,
              py: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <MUI.Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
            >
              {translations.filePickerDialogSelectFile || "Selected file:"}
            </MUI.Typography>
            <MUI.Typography variant="body2" color="text.primary">
              {selectedFile.name}
            </MUI.Typography>
            <MUI.Typography variant="caption" color="text.secondary">
              {selectedFile.contentType}
            </MUI.Typography>
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
          disabled={loading || isSelecting}
          variant="outlined"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {translations.filePickerDialogCancel || "Cancel"}
        </MUI.Button>
        <MUI.Button
          onClick={() => {
            if (selectedFile) {
              logger.info("Select button clicked", {
                fileName: selectedFile.name,
                filePath: selectedFile.path,
                currentPath,
              });
              handleFileSelect(selectedFile);
            } else {
              logger.warn("Select button clicked but no file selected");
            }
          }}
          disabled={!canSelect}
          variant="contained"
          sx={{
            minWidth: 80,
            borderRadius: 1,
          }}
        >
          {isSelecting ? (
            <>
              <MUI.CircularProgress size={16} sx={{ mr: 1 }} />
              {translations.selecting || "Selecting..."}
            </>
          ) : (
            translations.filePickerDialogSelect || "Select"
          )}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

const FilePickerDialog: React.FC<FilePickerDialogProps> = props => {
  return <FilePickerDialogContent {...props} />;
};

export default FilePickerDialog;

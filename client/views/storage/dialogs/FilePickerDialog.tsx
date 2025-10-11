"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Button,
 Alert,
 Box,
 Typography,
 Table,
 TableBody,
 TableRow,
 TableCell,
 Breadcrumbs,
 Link,
 CircularProgress,
 useTheme,
 IconButton,
 Tooltip,
} from "@mui/material";
import {
 Home as HomeIcon,
 NavigateNext as NavigateNextIcon,
 ArrowUpward as ArrowUpwardIcon,
 Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
 StorageManagementCoreProvider,
 useStorageManagementCore,
} from "@/client/contexts/storage/StorageManagementCoreContext";
import FileTypeIcon from "@/client/views/storage/browser/FileTypeIcon";
import FilePreview from "@/client/views/storage/browser/FilePreview";
import { useAppTranslation } from "@/client/locale";
import { StorageItem as StorageItemType } from "@/client/contexts/storage/storage.type";
import { StorageGraphQLProvider } from "@/client/graphql/apollo/storage.apollo";
import { FileInfo } from "@/client/graphql/generated/gql/graphql";

export interface FilePickerDialogProps {
 open: boolean;
 onClose: () => void;
 onFileSelect: (file: FileInfo) => void;
 allowedFileTypes?: string[]; // Optional array of allowed content types (e.g., ['image/*', 'application/pdf'])
 title?: string; // Optional custom title
}

function isFile(item: StorageItemType): item is FileInfo {
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
 const { fetchList } = useStorageManagementCore();

 // State
 const [currentPath, setCurrentPath] = useState<string>("");
 const [items, setItems] = useState<StorageItemType[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const [isSelecting, setIsSelecting] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

 // Filter items to show only folders and allowed files
 const filteredItems = useMemo(() => {
  return items.filter((item) => {
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
    return allowedFileTypes.some((allowedType) => {
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
  () => filteredItems.filter((item) => item.__typename === "DirectoryInfo"),
  [filteredItems],
 );

 const files = useMemo(
  () => filteredItems.filter((item) => item.__typename === "FileInfo"),
  [filteredItems],
 );

 // Load items for the current path
 const loadItems = useCallback(
  async (path: string) => {
   setIsLoading(true);
   setError(null);
   setSelectedFile(null);

   try {
    const result = await fetchList({
     path: path,
     limit: 1000,
     offset: 0,
    });

    if (result) {
     setItems(result.items);
    } else {
     setError(
      translations.filePickerDialogFailedToLoad || "Failed to load files",
     );
     setItems([]);
    }
   } catch {
    setError(
     translations.filePickerDialogUnexpectedError ||
      "An unexpected error occurred",
    );
    setItems([]);
   } finally {
    setIsLoading(false);
   }
  },
  [
   fetchList,
   translations.filePickerDialogFailedToLoad,
   translations.filePickerDialogUnexpectedError,
  ],
 );

 // Reset state when dialog opens/closes
 useEffect(() => {
  if (open) {
   setCurrentPath("");
   setItems([]);
   setError(null);
   setIsLoading(false);
   setIsSelecting(false);
   setSelectedFile(null);
   // Load root directory
   loadItems("");
  }
 }, [open, loadItems]);

 // Navigate to a directory
 const navigateToDirectory = useCallback(
  (path: string) => {
   setCurrentPath(path);
   loadItems(path);
  },
  [loadItems],
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
  async (file: FileInfo) => {
   setIsSelecting(true);
   setError(null);

   try {
    onFileSelect(file);
    onClose();
   } catch {
    setError(
     translations.filePickerDialogUnexpectedError ||
      "An unexpected error occurred",
    );
   } finally {
    setIsSelecting(false);
   }
  },
  [onFileSelect, onClose, translations.filePickerDialogUnexpectedError],
 );

 // Handle dialog close
 const handleClose = useCallback(() => {
  if (!isLoading && !isSelecting) {
   onClose();
  }
 }, [isLoading, isSelecting, onClose]);

 // Handle keyboard events
 const handleKeyDown = useCallback(
  (event: React.KeyboardEvent) => {
   if (event.key === "Escape" && !isLoading && !isSelecting) {
    event.preventDefault();
    handleClose();
   }
  },
  [handleClose, isLoading, isSelecting],
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
  loadItems(currentPath);
 }, [loadItems, currentPath]);

 const dialogTitle =
  title || translations.filePickerDialogTitle || "Select a file";
 const canSelect = selectedFile && !isLoading && !isSelecting;

 return (
  <Dialog
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
   <DialogTitle
    sx={{
     fontSize: "1.25rem",
     fontWeight: 600,
     pb: 1,
     flexShrink: 0,
    }}
   >
    {dialogTitle}
   </DialogTitle>

   <DialogContent
    sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}
   >
    {/* Breadcrumb Navigation */}
    <Box
     sx={{
      px: 3,
      py: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
     }}
    >
     <Box
      sx={{
       display: "flex",
       alignItems: "center",
       justifyContent: "space-between",
       mb: 1,
      }}
     >
      <Typography variant="subtitle2" color="text.secondary">
       {translations.filePickerDialogSelectFile || "Select a file"}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
       <Tooltip title={translations.moveDialogGoUp || "Go up"}>
        <span>
         <IconButton
          size="small"
          onClick={navigateUp}
          disabled={!currentPath || isLoading}
         >
          <ArrowUpwardIcon fontSize="small" />
         </IconButton>
        </span>
       </Tooltip>
       <Tooltip title={translations.moveDialogRefresh || "Refresh"}>
        <IconButton
         size="small"
         onClick={refreshDirectory}
         disabled={isLoading}
        >
         <RefreshIcon fontSize="small" />
        </IconButton>
       </Tooltip>
      </Box>
     </Box>

     <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ fontSize: "0.875rem" }}
     >
      {breadcrumbSegments.map((segment, index) => (
       <Link
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
       </Link>
      ))}
     </Breadcrumbs>
    </Box>

    {/* Items List */}
    <Box sx={{ flex: 1, overflow: "auto" }}>
     {isLoading ? (
      <Box
       sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
       }}
      >
       <CircularProgress size={40} />
      </Box>
     ) : error ? (
      <Box sx={{ p: 3 }}>
       <Alert severity="error" sx={{ borderRadius: 1 }}>
        {error}
       </Alert>
      </Box>
     ) : filteredItems.length === 0 ? (
      <Box sx={{ p: 3, textAlign: "center" }}>
       <Typography color="text.secondary">
        {translations.filePickerDialogNoFiles ||
         "No files found in this folder"}
       </Typography>
      </Box>
     ) : (
      <Box>
       {/* Folders - Table format for navigation */}
       {folders.length > 0 && (
        <Box sx={{ mb: 2 }}>
         <Typography
          variant="subtitle2"
          sx={{ mb: 1, px: 2, color: "text.secondary" }}
         >
          Folders
         </Typography>
         <Table size="small">
          <TableBody>
           {folders.map((folder) => (
            <TableRow
             key={folder.path}
             hover
             onClick={() => navigateToDirectory(folder.path)}
             sx={{
              cursor: "pointer",
              "&:hover": {
               backgroundColor: "action.hover",
              },
             }}
            >
             <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <FileTypeIcon
                item={folder}
                sx={{
                 fontSize: "1.5rem",
                 color: theme.palette.warning.main,
                }}
               />
               <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {folder.name}
               </Typography>
              </Box>
             </TableCell>
             <TableCell align="right">
              <Typography variant="body2" color="text.secondary">
               Folder
              </Typography>
             </TableCell>
            </TableRow>
           ))}
          </TableBody>
         </Table>
        </Box>
       )}

       {/* Files - Grid format with previews */}
       {files.length > 0 && (
        <Box>
         <Typography
          variant="subtitle2"
          sx={{ mb: 1, px: 2, color: "text.secondary" }}
         >
          Files
         </Typography>
         <Box
          sx={{
           display: "grid",
           gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
           gap: 2,
           p: 2,
          }}
         >
          {files.map((file) => {
           // Since we filtered by __typename === "FileInfo", this is guaranteed to be FileInfo
           if (file.__typename !== "FileInfo") return null;

           const isSelected = selectedFile?.path === file.path;

           return (
            <Box
             key={file.path}
             onClick={() => setSelectedFile(file)}
             onDoubleClick={() => {
              setSelectedFile(file);
              handleFileSelect(file);
             }}
             sx={{
              border: 1,
              borderColor: isSelected ? "primary.main" : "divider",
              borderRadius: 1,
              p: 1,
              cursor: "pointer",
              backgroundColor: isSelected ? "action.selected" : "transparent",
              "&:hover": {
               backgroundColor: isSelected ? "action.selected" : "action.hover",
              },
              transition: "all 0.2s ease",
             }}
            >
             {/* File Preview */}
             <FilePreview item={file} height={100} />

             {/* File Info */}
             <Box sx={{ mt: 1 }}>
              <Typography
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
              </Typography>
              <Typography
               variant="caption"
               color="text.secondary"
               sx={{ display: "block", mt: 0.5 }}
              >
               {file.size ? `${Math.round(file.size / 1024)} KB` : ""}
              </Typography>
             </Box>
            </Box>
           );
          })}
         </Box>
        </Box>
       )}
      </Box>
     )}
    </Box>

    {/* Show message when there are only folders but no files */}
    {filteredItems.length > 0 && files.length === 0 && folders.length > 0 && (
     <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
       No files found in this folder. Navigate to a folder to browse for files.
      </Typography>
     </Box>
    )}

    {/* Selected File Info */}
    {selectedFile && (
     <Box
      sx={{
       px: 3,
       py: 2,
       borderTop: `1px solid ${theme.palette.divider}`,
      }}
     >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
       {translations.filePickerDialogSelectFile || "Selected file:"}
      </Typography>
      <Typography variant="body2" color="text.primary">
       {selectedFile.name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
       {selectedFile.contentType}
      </Typography>
     </Box>
    )}
   </DialogContent>

   <DialogActions
    sx={{
     px: 3,
     pb: 3,
     pt: 2,
     gap: 1,
     flexShrink: 0,
     borderTop: `1px solid ${theme.palette.divider}`,
    }}
   >
    <Button
     onClick={handleClose}
     disabled={isLoading || isSelecting}
     variant="outlined"
     sx={{
      minWidth: 80,
      borderRadius: 1,
     }}
    >
     {translations.filePickerDialogCancel || "Cancel"}
    </Button>
    <Button
     onClick={() => selectedFile && handleFileSelect(selectedFile)}
     disabled={!canSelect}
     variant="contained"
     sx={{
      minWidth: 80,
      borderRadius: 1,
     }}
    >
     {isSelecting ? (
      <>
       <CircularProgress size={16} sx={{ mr: 1 }} />
       {translations.selecting || "Selecting..."}
      </>
     ) : (
      translations.filePickerDialogSelect || "Select"
     )}
    </Button>
   </DialogActions>
  </Dialog>
 );
};

const FilePickerDialog: React.FC<FilePickerDialogProps> = (props) => {
 return (
  <StorageGraphQLProvider>
   <StorageManagementCoreProvider>
    <FilePickerDialogContent {...props} />
   </StorageManagementCoreProvider>
  </StorageGraphQLProvider>
 );
};

export default FilePickerDialog;

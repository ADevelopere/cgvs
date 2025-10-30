"use client";

import React, { useState } from "react";
import * as MUI from "@mui/material";
import {
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import FilePickerDialog from "@/client/views/storage/dialogs/FilePickerDialog";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import type { FileType } from "@/client/graphql/generated/gql/graphql";
import { ImageDataSourceInput, DataSourceFormErrors } from "./types";

export interface ImageDataSourceFormProps {
  dataSource: ImageDataSourceInput;
  errors: DataSourceFormErrors;
  updateDataSource: (dataSource: ImageDataSourceInput) => void;
  disabled?: boolean;
}

export const ImageDataSourceForm: React.FC<ImageDataSourceFormProps> = ({
  dataSource,
  errors,
  updateDataSource,
  disabled = false,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    id: number;
    name: string;
    path: string;
    url: string;
  } | null>(null);

  // Determine if a file is currently selected
  const hasFile =
    dataSource.storageFile && dataSource.storageFile.storageFileId > 0;

  const handleFileSelect = (file: Graphql.FileInfo) => {
    // TODO: Use file.dbId once GraphQL types are updated
    // For now, we'll use a placeholder approach
    const fileId = (file as unknown as { dbId?: number }).dbId || -1;
    
    if (fileId === -1) {
      // File doesn't have a database ID - this shouldn't happen for stored files
      return;
    }

    setSelectedFile({
      id: fileId,
      name: file.name ?? file.path.split("/").pop() ?? "",
      path: file.path,
      url: file.url,
    });

    updateDataSource({
      storageFile: {
        storageFileId: fileId,
      },
    });
    setIsPickerOpen(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    updateDataSource({
      storageFile: {
        storageFileId: -1,
      },
    });
  };

  return (
    <MUI.Box>
      <MUI.FormLabel required>{strings.imageElement.dataSourceLabel}</MUI.FormLabel>
      <MUI.Box sx={{ mt: 1 }}>
        {hasFile && selectedFile ? (
          // Show selected file
          <MUI.Card variant="outlined">
            <MUI.CardContent>
              <MUI.Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <MUI.Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 32, color: "primary.main" }} />
                  <MUI.Box sx={{ flex: 1, minWidth: 0 }}>
                    <MUI.Typography variant="body2" fontWeight="medium" noWrap>
                      {selectedFile.name}
                    </MUI.Typography>
                    <MUI.Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                    >
                      {selectedFile.path}
                    </MUI.Typography>
                  </MUI.Box>
                </MUI.Box>
                <MUI.Box sx={{ display: "flex", gap: 1 }}>
                  <MUI.Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsPickerOpen(true)}
                    disabled={disabled}
                  >
                    {strings.imageElement.changeFile}
                  </MUI.Button>
                  <MUI.IconButton
                    size="small"
                    onClick={handleClear}
                    disabled={disabled}
                    color="error"
                  >
                    <CloseIcon />
                  </MUI.IconButton>
                </MUI.Box>
              </MUI.Box>
            </MUI.CardContent>
          </MUI.Card>
        ) : (
          // Show file picker button
          <MUI.Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setIsPickerOpen(true)}
            disabled={disabled}
            fullWidth
            sx={{
              py: 2,
              borderStyle: "dashed",
              borderWidth: 2,
            }}
          >
            {strings.imageElement.selectImageFile}
          </MUI.Button>
        )}

        {errors.storageFile && (
          <MUI.FormHelperText error>{errors.storageFile}</MUI.FormHelperText>
        )}
      </MUI.Box>

      {/* File Picker Dialog */}
      <FilePickerDialog
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleFileSelect}
        allowedFileTypes={["IMAGE" as FileType]}
        title={strings.imageElement.selectImageFile}
      />
    </MUI.Box>
  );
};


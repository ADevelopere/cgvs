import React, { useState } from "react";
import * as MUI from "@mui/material";
import {
  Description as FileIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import FilePickerDialog from "@/client/views/storage/dialogs/FilePickerDialog";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface FontFilePickerProps {
  value: {
    filePath: string;
    fileName: string;
    fileUrl?: string;
  } | null;
  onChange: (file: {
    filePath: string;
    fileName: string;
    fileUrl: string;
  } | null) => void;
  disabled?: boolean;
}

export const FontFilePicker: React.FC<FontFilePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleFileSelect = (file: Graphql.FileInfo) => {
    onChange({
      filePath: file.path,
      fileName: file.name,
      fileUrl: file.url,
    });
    setIsPickerOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <>
      <MUI.Box>
        {value ? (
          <MUI.Card>
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
                  <FileIcon sx={{ fontSize: 32, color: "text.secondary" }} />
                  <MUI.Box sx={{ flex: 1, minWidth: 0 }}>
                    <MUI.Typography
                      variant="body2"
                      fontWeight="medium"
                      noWrap
                    >
                      {value.fileName}
                    </MUI.Typography>
                    <MUI.Typography variant="caption" color="text.secondary">
                      {strings.fontFileSelected}
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
                    {strings.change}
                  </MUI.Button>
                  <MUI.IconButton
                    size="small"
                    onClick={handleClear}
                    disabled={disabled}
                  >
                    <CloseIcon fontSize="small" />
                  </MUI.IconButton>
                </MUI.Box>
              </MUI.Box>
            </MUI.CardContent>
          </MUI.Card>
        ) : (
          <MUI.Button
            variant="outlined"
            fullWidth
            onClick={() => setIsPickerOpen(true)}
            disabled={disabled}
            sx={{
              height: 120,
              borderStyle: "dashed",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <UploadIcon sx={{ fontSize: 32, color: "text.secondary" }} />
            <MUI.Typography variant="body2">{strings.selectFontFile}</MUI.Typography>
            <MUI.Typography variant="caption" color="text.secondary">
              {strings.fontFileFormats}
            </MUI.Typography>
          </MUI.Button>
        )}
      </MUI.Box>

      <FilePickerDialog
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleFileSelect}
        title="Select Font File"
        allowedFileTypes={["FONT"]}
      />
    </>
  );
};


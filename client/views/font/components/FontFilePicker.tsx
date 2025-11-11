import React, { useState } from "react";
import * as MUI from "@mui/material";
import { Description as FileIcon, CloudUpload as UploadIcon, Close as CloseIcon } from "@mui/icons-material";
import FilePickerDialog from "@/client/views/storage/dialogs/FilePickerDialog";
import { useAppTranslation } from "@/client/locale";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import opentype from "opentype.js";

export interface FontMetadata {
  fontFamily: string;
  fontSubfamily: string;
  fullName: string;
  postScriptName: string;
}

interface FontFilePickerProps {
  value: {
    filePath: string;
    fileName: string;
    fileUrl?: string;
    metadata?: FontMetadata;
  } | null;
  onChange: (
    file: {
      filePath: string;
      fileName: string;
      fileUrl: string;
      metadata: FontMetadata;
    } | null
  ) => void;
  disabled?: boolean;
}

export const FontFilePicker: React.FC<FontFilePickerProps> = ({ value, onChange, disabled = false }) => {
  const { fontManagementTranslations: strings } = useAppTranslation();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractFontMetadata = async (fontUrl: string): Promise<FontMetadata> => {
    return new Promise((resolve, reject) => {
      opentype.load(fontUrl, (err, font) => {
        if (err || !font) {
          reject(new Error("Failed to load font file"));
          return;
        }

        const names = font.names;
        resolve({
          fontFamily: names.fontFamily?.en || "Unknown",
          fontSubfamily: names.fontSubfamily?.en || "Regular",
          fullName: names.fullName?.en || "Unknown",
          postScriptName: names.postScriptName?.en || "Unknown",
        });
      });
    });
  };

  const handleFileSelect = async (file: GQL.FileInfo) => {
    setIsProcessing(true);
    try {
      const metadata = await extractFontMetadata(file.url);
      onChange({
        filePath: file.path,
        fileName: file.name ?? file.path.split("/").pop() ?? "",
        fileUrl: file.url,
        metadata,
      });
      setIsPickerOpen(false);
    } catch (error) {
      console.error("Error extracting font metadata:", error);
      alert("Failed to extract font metadata. Please ensure the file is a valid font.");
    } finally {
      setIsProcessing(false);
    }
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
                    <MUI.Typography variant="body2" fontWeight="medium" noWrap>
                      {value.fileName}
                    </MUI.Typography>
                    {value.metadata && (
                      <MUI.Typography variant="caption" color="text.secondary" display="block">
                        {value.metadata.fontFamily} - {value.metadata.fontSubfamily}
                      </MUI.Typography>
                    )}
                    <MUI.Typography variant="caption" color="text.secondary">
                      {strings.fontFileSelected}
                    </MUI.Typography>
                  </MUI.Box>
                </MUI.Box>
                <MUI.Box sx={{ display: "flex", gap: 1 }}>
                  <MUI.Button variant="outlined" size="small" onClick={() => setIsPickerOpen(true)} disabled={disabled}>
                    {strings.change}
                  </MUI.Button>
                  <MUI.IconButton size="small" onClick={handleClear} disabled={disabled}>
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
            disabled={disabled || isProcessing}
            sx={{
              height: 120,
              borderStyle: "dashed",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {isProcessing ? (
              <>
                <MUI.CircularProgress size={32} />
                <MUI.Typography variant="body2">Processing font...</MUI.Typography>
              </>
            ) : (
              <>
                <UploadIcon sx={{ fontSize: 32, color: "text.secondary" }} />
                <MUI.Typography variant="body2">{strings.selectFontFile}</MUI.Typography>
                <MUI.Typography variant="caption" color="text.secondary">
                  {strings.fontFileFormats}
                </MUI.Typography>
              </>
            )}
          </MUI.Button>
        )}
      </MUI.Box>

      <FilePickerDialog
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleFileSelect}
        title="Select Font File"
        allowedFileTypes={[GQL.FileType.Font]}
      />
    </>
  );
};

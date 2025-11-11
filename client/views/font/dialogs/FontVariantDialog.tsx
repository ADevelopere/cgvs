import React, { useState } from "react";
import * as MUI from "@mui/material";
import { FontFilePicker, FontMetadata } from "../components/FontFilePicker";
import { FontPreview } from "../components/FontPreview";
import { useAppTranslation } from "@/client/locale";

interface FontVariantDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { variant: string; storageFilePath: string }) => Promise<void>;
  familyName: string;
  title: string;
}

export const FontVariantDialog: React.FC<FontVariantDialogProps> = ({ open, onClose, onSubmit, familyName, title }) => {
  const { fontManagementTranslations: t } = useAppTranslation();
  const [selectedFile, setSelectedFile] = useState<{
    filePath: string;
    fileName: string;
    fileUrl: string;
    metadata: FontMetadata;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedFile) newErrors.file = t.fontFileRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedFile) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        variant: selectedFile.metadata.fontSubfamily,
        storageFilePath: selectedFile.filePath,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MUI.Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MUI.DialogTitle>{title}</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <MUI.TextField label={t.familyName} value={familyName} disabled fullWidth />
          {selectedFile?.metadata && (
            <MUI.TextField
              label={t.variant}
              value={selectedFile.metadata.fontSubfamily}
              disabled
              fullWidth
              helperText={t.autoExtractedFromFile}
            />
          )}
          <MUI.Box>
            <MUI.FormLabel>{t.fontFileLabel}</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <FontFilePicker value={selectedFile} onChange={setSelectedFile} disabled={isSubmitting} />
            </MUI.Box>
            {errors.file && <MUI.FormHelperText error>{errors.file}</MUI.FormHelperText>}
          </MUI.Box>
          {selectedFile?.fileUrl && (
            <MUI.Box>
              <MUI.FormLabel>{t.preview}</MUI.FormLabel>
              <MUI.Box sx={{ mt: 1 }}>
                <FontPreview
                  fontName={familyName}
                  fontUrl={selectedFile.fileUrl}
                  variant={selectedFile.metadata.fontSubfamily}
                />
              </MUI.Box>
            </MUI.Box>
          )}
        </MUI.Box>
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button onClick={onClose} disabled={isSubmitting}>
          {t.cancel}
        </MUI.Button>
        <MUI.Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t.saving : t.save}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

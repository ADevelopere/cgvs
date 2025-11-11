import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { LocaleSelector } from "../components/LocaleSelector";
import { FontFilePicker, FontMetadata } from "../components/FontFilePicker";
import { FontPreview } from "../components/FontPreview";
import { useAppTranslation } from "@/client/locale";

interface CreateFontWithFamilyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    familyName: string;
    category?: string;
    locale: string[];
    variant: string;
    storageFilePath: string;
  }) => Promise<void>;
}

export const CreateFontWithFamilyDialog: React.FC<CreateFontWithFamilyDialogProps> = ({ open, onClose, onSubmit }) => {
  const { fontManagementTranslations: t } = useAppTranslation();
  const [familyName, setFamilyName] = useState("");
  const [category, setCategory] = useState("");
  const [locale, setLocale] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<{
    filePath: string;
    fileName: string;
    fileUrl: string;
    metadata: FontMetadata;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedFile?.metadata) {
      setFamilyName(selectedFile.metadata.fontFamily);
    }
  }, [selectedFile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!familyName.trim()) newErrors.familyName = t.familyNameRequired;
    if (locale.length === 0) newErrors.locale = t.localeRequired;
    if (!selectedFile) newErrors.file = t.fontFileRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !selectedFile) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        familyName: familyName.trim(),
        category: category.trim() || undefined,
        locale,
        variant: selectedFile.metadata.fontSubfamily,
        storageFilePath: selectedFile.filePath,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MUI.Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <MUI.DialogTitle>{t.createNewFontFamily}</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <MUI.TextField
            label={t.familyName}
            value={familyName}
            onChange={e => setFamilyName(e.target.value)}
            error={Boolean(errors.familyName)}
            helperText={errors.familyName || t.autoExtractedFromFile}
            fullWidth
            disabled
          />
          <MUI.TextField
            label={t.categoryOptional}
            value={category}
            onChange={e => setCategory(e.target.value)}
            fullWidth
            placeholder={t.categoryPlaceholder}
          />
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
            <MUI.FormLabel>{t.supportedLocales}</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <LocaleSelector value={locale} onChange={setLocale} disabled={isSubmitting} />
            </MUI.Box>
            {errors.locale && <MUI.FormHelperText error>{errors.locale}</MUI.FormHelperText>}
          </MUI.Box>
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
                  fontName={familyName || t.preview}
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
          {isSubmitting ? t.creating : t.createFont}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

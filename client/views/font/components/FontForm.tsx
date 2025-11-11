import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { LocaleSelector } from "./LocaleSelector";
import { FontFilePicker, FontMetadata } from "./FontFilePicker";
import { FontPreview } from "./FontPreview";
import { FontFormData } from "../types";
import { useAppTranslation } from "@/client/locale";
import { FontFamilyCreateInput, FontVariantCreateInput } from "@/client/graphql/generated/gql/graphql";

interface FontFormProps {
  initialData?: {
    name: string;
    variant?: string;
    metadata?: FontMetadata;
    locale: string[];
    filePath?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
  };

  onSubmit: (familyInput: FontFamilyCreateInput, variantInput: FontVariantCreateInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

export const FontForm: React.FC<FontFormProps> = ({ initialData, onSubmit, onCancel, disabled = false }) => {
  const { fontManagementTranslations: strings } = useAppTranslation();

  const [formData, setFormData] = useState<FontFormData>({
    name: initialData?.name || "",
    locale: initialData?.locale || [],
    storageFilePath: initialData?.filePath || null,
  });

  const [selectedFile, setSelectedFile] = useState<{
    filePath: string;
    fileName: string;
    fileUrl: string;
    metadata: FontMetadata;
  } | null>(
    initialData?.filePath && initialData?.metadata
      ? {
          filePath: initialData.filePath,
          fileName: initialData.fileName || "Font file",
          fileUrl: initialData.fileUrl || "",
          metadata: initialData.metadata,
        }
      : null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedFile?.metadata) {
      setFormData(prev => ({
        ...prev,
        name: selectedFile.metadata.fontFamily,
      }));
    }
  }, [selectedFile]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = strings.fontNameRequired;
    }

    if (formData.locale.length === 0) {
      newErrors.locale = strings.localeRequired;
    }

    if (formData.storageFilePath === null || !selectedFile?.metadata) {
      newErrors.file = strings.fontFileRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || formData.storageFilePath === null || !selectedFile?.metadata) {
      return;
    }
    const familyInput: FontFamilyCreateInput = {
      name: formData.name,
      category: "custom",
      locale: formData.locale,
    };

    const variantInput: FontVariantCreateInput = {
      familyId: 0, // Will be set by the parent component
      variant: selectedFile.metadata.fontSubfamily,
      storageFilePath: formData.storageFilePath,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(familyInput, variantInput);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Font Name (Auto-extracted) */}
        <MUI.Box>
          <MUI.FormLabel htmlFor="name">{strings.fontNameLabel}</MUI.FormLabel>
          <MUI.TextField
            id="name"
            fullWidth
            size="small"
            value={formData.name}
            placeholder={strings.fontNamePlaceholder}
            disabled
            error={Boolean(errors.name)}
            helperText={errors.name || "Auto-extracted from font file"}
            sx={{ mt: 1 }}
          />
        </MUI.Box>

        {/* Font Variant (Auto-extracted) */}
        {selectedFile?.metadata && (
          <MUI.Box>
            <MUI.FormLabel>Font Variant</MUI.FormLabel>
            <MUI.TextField
              fullWidth
              size="small"
              value={selectedFile.metadata.fontSubfamily}
              disabled
              helperText="Auto-extracted from font file"
              sx={{ mt: 1 }}
            />
          </MUI.Box>
        )}

        {/* Locales */}
        <MUI.Box>
          <MUI.FormLabel>{strings.supportedLocalesLabel}</MUI.FormLabel>
          <MUI.Box sx={{ mt: 1 }}>
            <LocaleSelector
              value={formData.locale}
              onChange={locale => setFormData(prev => ({ ...prev, locale }))}
              disabled={disabled || isSubmitting}
            />
          </MUI.Box>
          {errors.locale && <MUI.FormHelperText error>{errors.locale}</MUI.FormHelperText>}
          <MUI.FormHelperText>{strings.supportedLocalesHelper}</MUI.FormHelperText>
        </MUI.Box>

        {/* Font File */}
        <MUI.Box>
          <MUI.FormLabel>{strings.fontFileLabel}</MUI.FormLabel>
          <MUI.Box sx={{ mt: 1 }}>
            <FontFilePicker
              value={selectedFile}
              onChange={file => {
                setSelectedFile(file);
                if (file) {
                  setFormData(prev => ({
                    ...prev,
                    storageFilePath: file.filePath,
                  }));
                }
              }}
              disabled={disabled || isSubmitting}
            />
          </MUI.Box>
          {errors.file && <MUI.FormHelperText error>{errors.file}</MUI.FormHelperText>}
        </MUI.Box>

        {/* Font Preview */}
        {selectedFile?.fileUrl && (
          <MUI.Box>
            <MUI.FormLabel>{strings.preview}</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <FontPreview
                fontName={formData.name || strings.preview}
                fontUrl={selectedFile.fileUrl}
                variant={selectedFile.metadata.fontSubfamily}
              />
            </MUI.Box>
          </MUI.Box>
        )}

        {/* Actions */}
        <MUI.Divider />
        <MUI.Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <MUI.Button type="button" variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            {strings.cancel}
          </MUI.Button>
          <MUI.Button type="submit" variant="contained" disabled={disabled || isSubmitting}>
            {isSubmitting ? strings.saving : strings.createFont}
          </MUI.Button>
        </MUI.Box>
      </MUI.Box>
    </form>
  );
};

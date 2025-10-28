import React, { useState } from "react";
import * as MUI from "@mui/material";
import { LocaleSelector } from "./LocaleSelector";
import { FontFilePicker } from "./FontFilePicker";
import { FontPreview } from "./FontPreview";
import { FontFormData } from "../types";
import { useAppTranslation } from "@/client/locale";
import { FontCreateInput } from "@/client/graphql/generated/gql/graphql";

interface FontFormProps {
  initialData?: {
    name: string;
    locale: string[];
    filePath?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
  };

  onSubmit: (input: FontCreateInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

export const FontForm: React.FC<FontFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  disabled = false,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");

  const [formData, setFormData] = useState<FontFormData>({
    name: initialData?.name || "",
    locale: initialData?.locale || [],
    storageFilePath: initialData?.filePath || null,
  });

  const [selectedFile, setSelectedFile] = useState<{
    filePath: string;
    fileName: string;
    fileUrl: string;
  } | null>(
    initialData?.filePath
      ? {
          filePath: initialData.filePath,
          fileName: initialData.fileName || "Font file",
          fileUrl: initialData.fileUrl || "",
        }
      : null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = strings.fontNameRequired;
    }

    if (formData.locale.length === 0) {
      newErrors.locale = strings.localeRequired;
    }

    if (formData.storageFilePath === null) {
      newErrors.file = strings.fontFileRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || formData.storageFilePath === null) {
      return;
    }
    const input: FontCreateInput = {
      name: formData.name,
      locale: formData.locale,
      storageFilePath: formData.storageFilePath,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(input);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Font Name */}
        <MUI.Box>
          <MUI.FormLabel htmlFor="name">{strings.fontNameLabel}</MUI.FormLabel>
          <MUI.TextField
            id="name"
            fullWidth
            size="small"
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder={strings.fontNamePlaceholder}
            disabled={disabled || isSubmitting}
            error={Boolean(errors.name)}
            helperText={errors.name}
            sx={{ mt: 1 }}
          />
        </MUI.Box>

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
          {errors.locale && (
            <MUI.FormHelperText error>{errors.locale}</MUI.FormHelperText>
          )}
          <MUI.FormHelperText>
            {strings.supportedLocalesHelper}
          </MUI.FormHelperText>
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
          {errors.file && (
            <MUI.FormHelperText error>{errors.file}</MUI.FormHelperText>
          )}
        </MUI.Box>

        {/* Font Preview */}
        {selectedFile?.fileUrl && (
          <MUI.Box>
            <MUI.FormLabel>{strings.preview}</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <FontPreview
                fontName={formData.name || strings.preview}
                fontUrl={selectedFile.fileUrl}
              />
            </MUI.Box>
          </MUI.Box>
        )}

        {/* Actions */}
        <MUI.Divider />
        <MUI.Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <MUI.Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {strings.cancel}
          </MUI.Button>
          <MUI.Button
            type="submit"
            variant="contained"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? strings.saving : strings.createFont}
          </MUI.Button>
        </MUI.Box>
      </MUI.Box>
    </form>
  );
};

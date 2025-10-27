import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { LocaleSelector } from "./LocaleSelector";
import { FontFilePicker } from "./FontFilePicker";
import { FontPreview } from "./FontPreview";
import { FontFormData } from "../types";

interface FontFormProps {
  initialData?: {
    name: string;
    locale: string[];
    storageFileId: number;
    fileName?: string;
    fileUrl?: string;
  };
  onSubmit: (data: FontFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

export const FontForm: React.FC<FontFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  disabled = false,
}) => {
  const [formData, setFormData] = useState<FontFormData>({
    name: initialData?.name || "",
    locale: initialData?.locale || [],
    storageFileId: initialData?.storageFileId || null,
  });

  const [selectedFile, setSelectedFile] = useState<{
    fileId: number;
    fileName: string;
    fileUrl: string;
  } | null>(
    initialData?.storageFileId
      ? {
          fileId: initialData.storageFileId,
          fileName: initialData.fileName || "Font file",
          fileUrl: initialData.fileUrl || "",
        }
      : null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedFile) {
      setFormData(prev => ({ ...prev, storageFileId: selectedFile.fileId }));
    } else {
      setFormData(prev => ({ ...prev, storageFileId: null }));
    }
  }, [selectedFile]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Font name is required";
    }

    if (formData.locale.length === 0) {
      newErrors.locale = "At least one locale must be selected";
    }

    if (!formData.storageFileId) {
      newErrors.file = "Font file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Font Name */}
        <MUI.Box>
          <MUI.FormLabel htmlFor="name">Font Name</MUI.FormLabel>
          <MUI.TextField
            id="name"
            fullWidth
            size="small"
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Roboto, Cairo, Noto Sans"
            disabled={disabled || isSubmitting}
            error={Boolean(errors.name)}
            helperText={errors.name}
            sx={{ mt: 1 }}
          />
        </MUI.Box>

        {/* Locales */}
        <MUI.Box>
          <MUI.FormLabel>Supported Locales</MUI.FormLabel>
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
            Select &quot;All Languages&quot; for universal fonts, or choose specific locales
          </MUI.FormHelperText>
        </MUI.Box>

        {/* Font File */}
        <MUI.Box>
          <MUI.FormLabel>Font File</MUI.FormLabel>
          <MUI.Box sx={{ mt: 1 }}>
            <FontFilePicker
              value={selectedFile}
              onChange={setSelectedFile}
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
            <MUI.FormLabel>Preview</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <FontPreview
                fontName={formData.name || "Preview"}
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
            Cancel
          </MUI.Button>
          <MUI.Button
            type="submit"
            variant="contained"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </MUI.Button>
        </MUI.Box>
      </MUI.Box>
    </form>
  );
};


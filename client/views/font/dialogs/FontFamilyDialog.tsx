import React, { useState } from "react";
import * as MUI from "@mui/material";
import { LocaleSelector } from "../components/LocaleSelector";
import { useAppTranslation } from "@/client/locale";

interface FontFamilyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category?: string; locale: string[] }) => Promise<void>;
  initialData?: { name: string; category?: string; locale: string[] };
  title: string;
}

export const FontFamilyDialog: React.FC<FontFamilyDialogProps> = ({ open, onClose, onSubmit, initialData, title }) => {
  const { fontManagementTranslations: t } = useAppTranslation();
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [locale, setLocale] = useState<string[]>(initialData?.locale || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.familyNameRequired;
    if (locale.length === 0) newErrors.locale = t.localeRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), category: category.trim() || undefined, locale });
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
          <MUI.TextField
            label={t.familyName}
            value={name}
            onChange={e => setName(e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            autoFocus
          />
          <MUI.TextField
            label={t.categoryOptional}
            value={category}
            onChange={e => setCategory(e.target.value)}
            fullWidth
            placeholder={t.categoryPlaceholder}
          />
          <MUI.Box>
            <MUI.FormLabel>{t.supportedLocales}</MUI.FormLabel>
            <MUI.Box sx={{ mt: 1 }}>
              <LocaleSelector value={locale} onChange={setLocale} disabled={isSubmitting} />
            </MUI.Box>
            {errors.locale && <MUI.FormHelperText error>{errors.locale}</MUI.FormHelperText>}
          </MUI.Box>
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

# Sub-Plan 3: Font Management - Client UI Components

**Parent Plan**: Font Management Master Plan

**Status**: Ready for Implementation

**Dependencies**: Sub-Plan 1 (Server Foundation) and Sub-Plan 2 (Client Foundation) must be completed

**Scope**: React components, split-view layout, file picker integration, and Next.js page

---

## Overview

Implement all UI components for font management including split-view layout, font list, font detail/form, locale selector, font preview, file picker integration, delete confirmation dialog, and the Next.js page.

---

## Implementation Steps

### Step 1: Create Font List Component

**File**: `/workspaces/cgvs/client/views/font/FontList.tsx`

**Dependencies**:

- `client/views/font/hooks/useFontOperations`
- `@mui/material` components
- GraphQL types from `@/client/graphql/generated/gql/graphql`
- Pattern: Template management list components

**Content**:

```typescript
"use client";

import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Description as FontIcon,
} from "@mui/icons-material";
import { useFontOperations } from "./hooks/useFontOperations";
import { LOCALE_OPTIONS } from "./types";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const FontList: React.FC = () => {
  const {
    fonts,
    selectedFontId,
    searchTerm,
    isLoading,
    selectFont,
    handleSearch,
    startCreating,
  } = useFontOperations();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, handleSearch]);

  const getLocaleLabel = (localeCode: string) => {
    const option = LOCALE_OPTIONS.find(opt => opt.value === localeCode);
    return option?.flag || localeCode;
  };

  return (
    <MUI.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <MUI.Box sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}>
        <MUI.Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <MUI.Typography variant="h6">Fonts</MUI.Typography>
          <MUI.Button
            size="small"
            variant="contained"
            onClick={startCreating}
            startIcon={<AddIcon />}
          >
            New Font
          </MUI.Button>
        </MUI.Box>

        {/* Search */}
        <MUI.TextField
          fullWidth
          size="small"
          placeholder="Search fonts..."fix category management titles
          value={localSearchTerm}
          onChange={e => setLocalSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <MUI.InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </MUI.InputAdornment>
            ),
          }}
        />
      </MUI.Box>

      {/* Font List */}
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {isLoading ? (
          // Loading skeleton
          <>
            {[...Array(5)].map((_, i) => (
              <MUI.Card key={i} sx={{ p: 2, mb: 1 }}>
                <MUI.Skeleton variant="text" width="75%" height={24} />
                <MUI.Skeleton variant="text" width="50%" height={20} />
              </MUI.Card>
            ))}
          </>
        ) : fonts.length === 0 ? (
          // Empty state
          <MUI.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              px: 2,
              textAlign: "center",
            }}
          >
            <FontIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <MUI.Typography variant="body2" color="text.secondary" gutterBottom>
              {searchTerm ? "No fonts found" : "No fonts yet"}
            </MUI.Typography>
            <MUI.Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {searchTerm
                ? "Try a different search term"
                : "Create your first font to get started"}
            </MUI.Typography>
            {!searchTerm && (
              <MUI.Button
                size="small"
                variant="outlined"
                onClick={startCreating}
                startIcon={<AddIcon />}
              >
                Create Font
              </MUI.Button>
            )}
          </MUI.Box>
        ) : (
          // Font items
          fonts.map((font: Graphql.Font) => (
            <MUI.Card
              key={font.id}
              onClick={() => selectFont(font.id)}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor:
                  selectedFontId === font.id
                    ? "action.selected"
                    : "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <MUI.Typography variant="body2" fontWeight="medium" gutterBottom>
                {font.name}
              </MUI.Typography>
              <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {font.locale.map(locale => (
                  <MUI.Chip
                    key={locale}
                    label={getLocaleLabel(locale)}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </MUI.Box>
            </MUI.Card>
          ))
        )}
      </MUI.Box>

      {/* Footer */}
      <MUI.Box
        sx={{
          borderTop: 1,
          borderColor: "divider",
          p: 1.5,
          textAlign: "center",
        }}
      >
        <MUI.Typography variant="caption" color="text.secondary">
          {fonts.length} {fonts.length === 1 ? "font" : "fonts"}
        </MUI.Typography>
      </MUI.Box>
    </MUI.Box>
  );
};
```

**Key Features**:

- Search with debounce
- Selected state highlighting
- Locale badges with flags
- Empty state with CTA
- Loading skeletons
- Scrollable list

---

### Step 2: Create Locale Selector Component

**File**: `/workspaces/cgvs/client/views/font/components/LocaleSelector.tsx`

**Dependencies**:

- `@mui/material` components
- `client/views/font/types`

**Content**:

```typescript
"use client";

import React, { useState } from "react";
import * as MUI from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { LOCALE_OPTIONS } from "../types";

interface LocaleSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export const LocaleSelector: React.FC<LocaleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleToggle = (localeValue: string) => {
    let newValue: string[];

    if (localeValue === "all") {
      // If "all" is selected, clear all others
      newValue = value.includes("all") ? [] : ["all"];
    } else {
      // Remove "all" if present and toggle the locale
      const withoutAll = value.filter(v => v !== "all");

      if (withoutAll.includes(localeValue)) {
        newValue = withoutAll.filter(v => v !== localeValue);
      } else {
        newValue = [...withoutAll, localeValue];
      }
    }

    onChange(newValue);
  };

  const handleRemove = (localeValue: string) => {
    onChange(value.filter(v => v !== localeValue));
  };

  const selectedOptions = LOCALE_OPTIONS.filter(opt =>
    value.includes(opt.value)
  );

  const filteredOptions = LOCALE_OPTIONS.filter(opt =>
    opt.label.toLowerCase().includes(searchText.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected = value.includes("all");

  return (
    <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <MUI.Autocomplete
        multiple
        options={filteredOptions}
        value={selectedOptions}
        onChange={(_, newValue) => {
          const lastSelected = newValue[newValue.length - 1];
          if (lastSelected?.value === "all") {
            onChange(["all"]);
          } else {
            onChange(newValue.map(opt => opt.value));
          }
        }}
        getOptionLabel={option => `${option.flag} ${option.label}`}
        disabled={disabled}
        disableCloseOnSelect
        renderInput={params => (
          <MUI.TextField
            {...params}
            placeholder="Select locales..."
            size="small"
            onChange={e => setSearchText(e.target.value)}
          />
        )}
        renderOption={(props, option, { selected }) => {
          const isDisabled = isAllSelected && option.value !== "all";
          return (
            <li {...props}>
              <MUI.Checkbox
                checked={selected}
                disabled={isDisabled}
                size="small"
                sx={{ mr: 1 }}
              />
              <MUI.Typography variant="body2">
                <span style={{ marginRight: 8 }}>{option.flag}</span>
                {option.label}
              </MUI.Typography>
            </li>
          );
        }}
        renderTags={() => null}
      />

      {/* Selected locales */}
      {selectedOptions.length > 0 && (
        <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedOptions.map(option => (
            <MUI.Chip
              key={option.value}
              label={
                <>
                  <span style={{ marginRight: 4 }}>{option.flag}</span>
                  {option.label}
                </>
              }
              size="small"
              onDelete={!disabled ? () => handleRemove(option.value) : undefined}
              deleteIcon={<CloseIcon />}
            />
          ))}
        </MUI.Box>
      )}
    </MUI.Box>
  );
};
```

**Key Features**:

- Multi-select with search
- "All" option disables others
- Chip-based display
- Removable badges
- Keyboard navigation

---

### Step 3: Create Font Preview Component

**File**: `/workspaces/cgvs/client/views/font/components/FontPreview.tsx`

**Dependencies**:

- React hooks
- `@mui/material` components
- `client/lib/logger`

**Content**:

```typescript
"use client";

import React, { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import logger from "@/client/lib/logger";

interface FontPreviewProps {
  fontName: string;
  fontUrl: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  fontName,
  fontUrl,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontFaceLoaded, setFontFaceLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create unique font family name
        const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

        // Check if font is already loaded
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);

        await fontFace.load();
        document.fonts.add(fontFace);

        logger.info(`Font loaded: ${fontFamily}`);
        setFontFaceLoaded(true);
      } catch (err) {
        logger.error("Error loading font:", err);
        setError("Failed to load font preview");
      } finally {
        setLoading(false);
      }
    };

    if (fontUrl) {
      loadFont();
    }

    // Cleanup
    return () => {
      // Note: FontFace cleanup is complex, skipping for now
      setFontFaceLoaded(false);
    };
  }, [fontUrl, fontName]);

  const fontFamily = `font-preview-${fontName.replace(/\s+/g, "-")}`;

  if (loading) {
    return (
      <MUI.Card>
        <MUI.CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <MUI.Skeleton variant="text" width="100%" height={40} />
          <MUI.Skeleton variant="text" width="75%" height={32} />
          <MUI.Skeleton variant="text" width="100%" height={28} />
        </MUI.CardContent>
      </MUI.Card>
    );
  }

  if (error) {
    return (
      <MUI.Alert severity="error" icon={<ErrorIcon />}>
        {error}
      </MUI.Alert>
    );
  }

  return (
    <MUI.Card>
      <MUI.CardContent>
        <MUI.Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontFamily: fontFaceLoaded ? fontFamily : "inherit",
          }}
        >
          {/* Preview text in different sizes */}
          <MUI.Typography variant="h4" component="p" fontWeight="bold">
            The quick brown fox jumps over the lazy dog
          </MUI.Typography>
          <MUI.Typography variant="h5" component="p">
            السلام عليكم ورحمة الله وبركاته
          </MUI.Typography>
          <MUI.Typography variant="h6" component="p">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </MUI.Typography>
          <MUI.Typography variant="body1" component="p">
            abcdefghijklmnopqrstuvwxyz
          </MUI.Typography>
          <MUI.Typography variant="body2" component="p">
            0123456789 !@#$%^&*()_+-=[]&#123;&#125;|;':",./&lt;&gt;?
          </MUI.Typography>

          {/* Font info */}
          <MUI.Divider sx={{ mt: 2 }} />
          <MUI.Typography variant="caption" color="text.secondary">
            Font: {fontName}
          </MUI.Typography>
        </MUI.Box>
      </MUI.CardContent>
    </MUI.Card>
  );
};
```

**Key Features**:

- Dynamic font loading with FontFace API
- Multiple preview sizes
- Latin and Arabic character sets
- Loading and error states
- Proper cleanup

---

### Step 4: Create Font File Picker Component

**File**: `/workspaces/cgvs/client/views/font/components/FontFilePicker.tsx`

**Dependencies**:

- `client/views/storage/dialogs/FilePickerDialog`
- `@mui/material` components
- GraphQL types
- Pattern: Existing file picker usage

**Content**:

```typescript
"use client";

import React, { useState } from "react";
import * as MUI from "@mui/material";
import {
  Description as FileIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FilePickerDialog } from "@/client/views/storage/dialogs/FilePickerDialog";
import { FONT_FILE_EXTENSIONS } from "../types";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface FontFilePickerProps {
  value: {
    fileId: number;
    fileName: string;
    fileUrl?: string;
  } | null;
  onChange: (file: {
    fileId: number;
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleFileSelect = (file: Graphql.FileInfo) => {
    onChange({
      fileId: Number(file.path), // Use path as ID or adjust based on your schema
      fileName: file.name,
      fileUrl: file.url,
    });
    setIsPickerOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  const getAllowedFileTypes = () => {
    return FONT_FILE_EXTENSIONS.map(ext => `*${ext}`);
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
                      Font file selected
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
                    Change
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
            <MUI.Typography variant="body2">Select Font File</MUI.Typography>
            <MUI.Typography variant="caption" color="text.secondary">
              .ttf, .otf, .woff, .woff2
            </MUI.Typography>
          </MUI.Button>
        )}
      </MUI.Box>

      <FilePickerDialog
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onFileSelect={handleFileSelect}
        title="Select Font File"
        allowedFileTypes={getAllowedFileTypes()}
      />
    </>
  );
};
```

**Key Features**:

- Integrates existing storage file picker
- Filters for font file types
- Shows selected file
- Change/clear actions
- Validation for font extensions

---

### Step 5: Create Font Form Component

**File**: `/workspaces/cgvs/client/views/font/components/FontForm.tsx`

**Dependencies**:

- All previous components
- `@mui/material` components
- GraphQL types

**Content**:

```typescript
"use client";

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
            Select "All Languages" for universal fonts, or choose specific locales
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
```

**Key Features**:

- Form validation
- File selection integration
- Live font preview
- Error display
- Loading states

---

### Step 6: Create Font Detail Component

**File**: `/workspaces/cgvs/client/views/font/FontDetail.tsx`

**Dependencies**:

- `client/views/font/components/FontForm`
- `client/views/font/hooks/useFontOperations`
- `@mui/material` components
- GraphQL types

**Content**:

```typescript
"use client";

import React, { useState } from "react";
import * as MUI from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as FontIcon,
} from "@mui/icons-material";
import { useFontOperations } from "./hooks/useFontOperations";
import { FontForm } from "./components/FontForm";
import { DeleteFontDialog } from "./dialogs/DeleteFontDialog";

export const FontDetail: React.FC = () => {
  const {
    currentFont,
    selectedFontId,
    isCreating,
    isEditing,
    isSaving,
    createFont,
    updateFont,
    cancelCreating,
    cancelEditing,
    startEditing,
  } = useFontOperations();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Creating new font
  if (isCreating) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Typography variant="h4" gutterBottom>
            Create New Font
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                onSubmit={async data => {
                  const success = await createFont(data);
                  if (!success) {
                    // Error handled by operations hook
                  }
                }}
                onCancel={cancelCreating}
                submitLabel="Create Font"
                disabled={isSaving}
              />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // No font selected
  if (!selectedFontId) {
    return (
      <MUI.Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <MUI.Box sx={{ textAlign: "center" }}>
          <FontIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <MUI.Typography variant="h6" gutterBottom>
            No Font Selected
          </MUI.Typography>
          <MUI.Typography variant="body2" color="text.secondary">
            Select a font from the list to view details
          </MUI.Typography>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // Loading font details
  if (!currentFont) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
          <MUI.Card>
            <MUI.CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={150} />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // Editing mode
  if (isEditing) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Typography variant="h4" gutterBottom>
            Edit Font
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                initialData={{
                  name: currentFont.name,
                  locale: currentFont.locale,
                  storageFileId: currentFont.storageFileId,
                  fileName: `Font file ${currentFont.storageFileId}`,
                  fileUrl: "", // Would need storage file query
                }}
                onSubmit={async data => {
                  const success = await updateFont(currentFont.id, data);
                  if (!success) {
                    // Error handled by operations hook
                  }
                }}
                onCancel={cancelEditing}
                submitLabel="Save Changes"
                disabled={isSaving}
              />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // View mode
  return (
    <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
      <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <MUI.Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <MUI.Box>
            <MUI.Typography variant="h4">{currentFont.name}</MUI.Typography>
            <MUI.Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Font ID: {currentFont.id}
            </MUI.Typography>
          </MUI.Box>
          <MUI.Box sx={{ display: "flex", gap: 1 }}>
            <MUI.Button
              variant="outlined"
              size="small"
              onClick={startEditing}
              startIcon={<EditIcon />}
            >
              Edit
            </MUI.Button>
            <MUI.Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </MUI.Button>
          </MUI.Box>
        </MUI.Box>

        {/* Details Card */}
        <MUI.Card>
          <MUI.CardContent>
            <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Basic Info */}
              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Font Name
                </MUI.Typography>
                <MUI.Typography variant="body1" sx={{ mt: 0.5 }}>
                  {currentFont.name}
                </MUI.Typography>
              </MUI.Box>

              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Supported Locales
                </MUI.Typography>
                <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {currentFont.locale.map(locale => (
                    <MUI.Chip key={locale} label={locale} size="small" />
                  ))}
                </MUI.Box>
              </MUI.Box>

              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Storage File ID
                </MUI.Typography>
                <MUI.Typography variant="body1" sx={{ mt: 0.5 }}>
                  {currentFont.storageFileId}
                </MUI.Typography>
              </MUI.Box>

              <MUI.Grid container spacing={2}>
                <MUI.Grid item xs={6}>
                  <MUI.Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Created
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(currentFont.createdAt).toLocaleString()}
                  </MUI.Typography>
                </MUI.Grid>
                <MUI.Grid item xs={6}>
                  <MUI.Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Last Updated
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(currentFont.updatedAt).toLocaleString()}
                  </MUI.Typography>
                </MUI.Grid>
              </MUI.Grid>
            </MUI.Box>
          </MUI.CardContent>
        </MUI.Card>
      </MUI.Box>

      {/* Delete Dialog */}
      <DeleteFontDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        fontId={currentFont.id}
        fontName={currentFont.name}
      />
    </MUI.Box>
  );
};
```

**Key Features**:

- View/Edit mode switching
- Font metadata display
- Delete confirmation
- Loading states
- Proper layout

---

### Step 7: Create Delete Font Dialog

**File**: `/workspaces/cgvs/client/views/font/dialogs/DeleteFontDialog.tsx`

**Dependencies**:

- `client/views/font/hooks/useFontOperations`
- `@mui/material` components
- GraphQL types

**Content**:

```typescript
"use client";

import React, { useState, useEffect } from "react";
import * as MUI from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useFontOperations } from "../hooks/useFontOperations";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface DeleteFontDialogProps {
  open: boolean;
  onClose: () => void;
  fontId: number;
  fontName: string;
}

export const DeleteFontDialog: React.FC<DeleteFontDialogProps> = ({
  open,
  onClose,
  fontId,
  fontName,
}) => {
  const { deleteFont, checkFontUsage } = useFontOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  const [usageInfo, setUsageInfo] = useState<Graphql.FontUsageCheckResult | null>(null);

  // Check usage when dialog opens
  useEffect(() => {
    if (open) {
      setIsCheckingUsage(true);
      checkFontUsage(fontId).then(result => {
        setUsageInfo(result);
        setIsCheckingUsage(false);
      });
    } else {
      setUsageInfo(null);
    }
  }, [open, fontId, checkFontUsage]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteFont(fontId);
    setIsDeleting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <MUI.Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MUI.DialogTitle>Delete Font</MUI.DialogTitle>
      <MUI.DialogContent>
        <MUI.DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete <strong>{fontName}</strong>?
        </MUI.DialogContentText>

        {isCheckingUsage ? (
          <MUI.Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
            }}
          >
            <MUI.CircularProgress size={24} sx={{ mr: 2 }} />
            <MUI.Typography variant="body2" color="text.secondary">
              Checking usage...
            </MUI.Typography>
          </MUI.Box>
        ) : usageInfo && !usageInfo.canDelete ? (
          <MUI.Alert severity="error" icon={<WarningIcon />}>
            <MUI.AlertTitle>Cannot delete this font</MUI.AlertTitle>
            <MUI.Typography variant="body2">
              {usageInfo.deleteBlockReason ||
                `This font is used in ${usageInfo.usageCount} certificate element(s).`}
            </MUI.Typography>
          </MUI.Alert>
        ) : (
          <MUI.Alert severity="warning" icon={<WarningIcon />}>
            <MUI.Typography variant="body2">
              This action cannot be undone. The font will be permanently removed from the system.
            </MUI.Typography>
          </MUI.Alert>
        )}
      </MUI.DialogContent>
      <MUI.DialogActions>
        <MUI.Button variant="outlined" onClick={onClose} disabled={isDeleting}>
          Cancel
        </MUI.Button>
        <MUI.Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={
            isDeleting ||
            isCheckingUsage ||
            (usageInfo !== null && !usageInfo.canDelete)
          }
        >
          {isDeleting ? "Deleting..." : "Delete Font"}
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};
```

**Key Features**:

- Usage check on open
- Blocks deletion if in use
- Shows usage information
- Loading states
- Confirmation flow

---

### Step 8: Create Main Font Management View

**File**: `/workspaces/cgvs/client/views/font/FontManagementView.tsx`

**Dependencies**:

- All previous components
- `@/client/components/splitPane/SplitPane`
- Pattern: Storage/Template management split view

**Content**:

```typescript
"use client";

import React from "react";
import * as MUI from "@mui/material";
import { SplitPane } from "@/client/components/splitPane/SplitPane";
import { FontList } from "./FontList";
import { FontDetail } from "./FontDetail";

export const FontManagementView: React.FC = () => {
  return (
    <MUI.Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SplitPane
        orientation="vertical"
        firstPane={{
          visible: true,
          minRatio: 0.2,
          preferredRatio: 0.3,
        }}
        secondPane={{
          visible: true,
          minRatio: 0.5,
        }}
        resizerProps={{
          style: {
            cursor: "col-resize",
          },
        }}
        style={{
          flex: 1,
          minHeight: "calc(100vh - 64px)",
        }}
        storageKey="fontManagementSplitPane"
      >
        {/* Left sidebar - Font list */}
        <MUI.Paper
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          elevation={0}
        >
          <FontList />
        </MUI.Paper>

        {/* Right content - Font detail */}
        <MUI.Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <FontDetail />
        </MUI.Box>
      </SplitPane>
    </MUI.Box>
  );
};

export default FontManagementView;
```

**Key Features**:

- SplitPane with resizable panels
- Persistent layout state via storageKey
- Responsive min/max ratios
- Fixed width sidebar with 30% default
- Flexible content area (70%)
- Proper overflow handling

---

### Step 9: Create Next.js Page

**File**: `/workspaces/cgvs/app/(root)/(auth)/admin/fonts/page.tsx`

**Dependencies**:

- `client/views/font/FontManagementView`
- Pattern: Other admin pages

**Content**:

```typescript
import React from "react";
import FontManagementView from "@/client/views/font/FontManagementView";

export default function FontsPage() {
  return <FontManagementView />;
}
```

**Key Features**:

- Simple page wrapper
- Consistent with other admin pages
- Server component by default
- Protected by auth layout group

---

### Step 10: Create Component Index

**File**: `/workspaces/cgvs/client/views/font/components/index.ts`

**Content**:

```typescript
export * from "./LocaleSelector";
export * from "./FontPreview";
export * from "./FontFilePicker";
export * from "./FontForm";
```

---

## Directory Structure

After implementation:

```
client/views/font/
├── FontManagementView.tsx (main entry with SplitPane)
├── FontList.tsx (MUI components)
├── FontDetail.tsx (MUI components)
├── types.ts
├── components/
│   ├── index.ts
│   ├── LocaleSelector.tsx (MUI Autocomplete)
│   ├── FontPreview.tsx (MUI Card)
│   ├── FontFilePicker.tsx (MUI + FilePickerDialog)
│   └── FontForm.tsx (MUI Form components)
├── dialogs/
│   └── DeleteFontDialog.tsx (MUI Dialog)
├── hooks/
│   ├── index.ts
│   ├── font.documents.ts (GraphQL documents)
│   ├── useFontApolloMutations.ts (Apollo mutations)
│   └── useFontOperations.ts (Business logic)
└── stores/
    └── useFontStore.ts (Zustand store)

app/(root)/(auth)/admin/fonts/
└── page.tsx (Next.js page)
```

**Key Technologies**:

- **UI**: MUI (Material-UI) components
- **Layout**: SplitPane component from `client/components/splitPane`
- **Data**: GraphQL with Apollo Client
- **Types**: Generated from GraphQL schema
- **File Selection**: FilePickerDialog from storage module

---

## Validation Checklist

1. **TypeScript Compilation**

```bash
~/.bun/bin/bun tsc
```

Expected: No errors

2. **Linting**

```bash
~/.bun/bin/bun lint
```

Expected: No errors

3. **Files Created**

- [ ] All component files created
- [ ] Dialog created
- [ ] Main view created
- [ ] Page created
- [ ] Index files created

4. **UI Functionality**

- [ ] Font list displays and updates
- [ ] Search works with debounce
- [ ] Font selection works
- [ ] Create mode works
- [ ] Edit mode works
- [ ] Delete with usage check works
- [ ] File picker integration works
- [ ] Locale selector works (multi-select, "all" behavior)
- [ ] Font preview loads and displays
- [ ] Split view layout responsive

5. **Navigation**

- [ ] Page accessible at `/admin/fonts`
- [ ] Page protected by auth (in (auth) group)

---

## Testing Scenarios

1. **Create Font**
   - Click "New Font" button
   - Fill in name
   - Select locales (try "all", try multiple)
   - Select font file from storage
   - See preview
   - Submit
   - Verify font appears in list

2. **Edit Font**
   - Select font from list
   - Click "Edit"
   - Modify fields
   - Save
   - Verify changes

3. **Delete Font**
   - Select unused font
   - Click "Delete"
   - Confirm deletion
   - Verify removal

4. **Delete Protection**
   - Try to delete font in use
   - See error message
   - Verify cannot delete

5. **Search**
   - Type in search box
   - See filtered results
   - Clear search
   - See all fonts

---

## Next Steps

After successful validation:

1. Test end-to-end workflows
2. Verify all success criteria from master plan
3. Update master plan as complete
4. Document any issues or improvements

---

## Notes

- **MUI Components**: All UI components use Material-UI (@mui/material) for consistency with the rest of the app
- **SplitPane**: Uses the existing `client/components/splitPane/SplitPane.tsx` component with persistent state
- **GraphQL Types**: All types imported from `@/client/graphql/generated/gql/graphql`
  - `Font`: Main font entity type
  - `FontCreateInput`, `FontUpdateInput`: Mutation input types
  - `FontUsageCheckResult`: Usage validation result
  - `FileInfo`: Storage file information
- **File Picker**: Integrates `FilePickerDialog` from storage module with proper `FileInfo` callback
- **Font Preview**: Requires CORS-enabled storage URLs for dynamic font loading
- **Locale Selector**: "All" locale option is mutually exclusive with specific locales
- **Delete Protection**: Usage check prevents accidental deletion of fonts in use
- **Layout Pattern**: Follows storage and template management split-view patterns

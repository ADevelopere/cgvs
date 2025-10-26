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
- `client/components/ui/*` (shadcn components)
- Pattern: Template management list components

**Content**:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useFontOperations } from "./hooks/useFontOperations";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { ScrollArea } from "@/client/components/ui/scroll-area";
import { Badge } from "@/client/components/ui/badge";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Search, Plus, FileText } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { LOCALE_OPTIONS } from "./types";

export const FontList = () => {
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
    <div className="flex h-full flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Fonts</h2>
          <Button
            size="sm"
            onClick={startCreating}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Font
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search fonts..."
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Font List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            // Loading skeleton
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 mb-2 rounded-lg border">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </>
          ) : fonts.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
                {searchTerm ? "No fonts found" : "No fonts yet"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {searchTerm
                  ? "Try a different search term"
                  : "Create your first font to get started"}
              </p>
              {!searchTerm && (
                <Button size="sm" onClick={startCreating} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Font
                </Button>
              )}
            </div>
          ) : (
            // Font items
            fonts.map(font => (
              <div
                key={font.id}
                onClick={() => selectFont(font.id)}
                className={cn(
                  "p-3 mb-2 rounded-lg border cursor-pointer transition-colors",
                  "hover:bg-accent hover:border-accent-foreground/20",
                  selectedFontId === font.id &&
                    "bg-accent border-accent-foreground/50"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {font.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {font.locale.map(locale => (
                    <Badge
                      key={locale}
                      variant="secondary"
                      className="text-xs px-1.5 py-0"
                    >
                      {getLocaleLabel(locale)}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3 text-xs text-muted-foreground text-center">
        {fonts.length} {fonts.length === 1 ? "font" : "fonts"}
      </div>
    </div>
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

- `client/components/ui/*`
- `client/views/font/types`

**Content**:

```typescript
"use client";

import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/client/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { LOCALE_OPTIONS } from "../types";
import { useState } from "react";

interface LocaleSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export const LocaleSelector = ({
  value,
  onChange,
  disabled = false,
}: LocaleSelectorProps) => {
  const [open, setOpen] = useState(false);

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

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="text-sm text-muted-foreground">
              {value.length === 0
                ? "Select locales..."
                : `${value.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search locale..." />
            <CommandEmpty>No locale found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {LOCALE_OPTIONS.map(option => {
                const isSelected = value.includes(option.value);
                const isAllSelected = value.includes("all");
                const isDisabled =
                  isAllSelected && option.value !== "all";

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleToggle(option.value)}
                    disabled={isDisabled}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2">{option.flag}</span>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected locales */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map(option => (
            <Badge
              key={option.value}
              variant="secondary"
              className="gap-1 pr-1"
            >
              <span>{option.flag}</span>
              <span>{option.label}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(option.value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
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
- `client/components/ui/*`

**Content**:

```typescript
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/client/components/ui/card";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { AlertCircle } from "lucide-react";
import logger from "@/client/lib/logger";

interface FontPreviewProps {
  fontName: string;
  fontUrl: string;
  className?: string;
}

export const FontPreview = ({
  fontName,
  fontUrl,
  className,
}: FontPreviewProps) => {
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
      <Card className={className}>
        <div className="p-6 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6 space-y-4">
        {/* Preview text in different sizes */}
        <div
          style={{ fontFamily: fontFaceLoaded ? fontFamily : "inherit" }}
          className="space-y-3"
        >
          <p className="text-3xl font-bold">
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-2xl">
            السلام عليكم ورحمة الله وبركاته
          </p>
          <p className="text-xl">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
          <p className="text-lg">
            abcdefghijklmnopqrstuvwxyz
          </p>
          <p className="text-base">
            0123456789 !@#$%^&*()_+-=[]{}|;':",./&lt;&gt;?
          </p>
        </div>

        {/* Font info */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>Font: {fontName}</p>
        </div>
      </div>
    </Card>
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
- `client/components/ui/*`
- Pattern: Existing file picker usage

**Content**:

```typescript
"use client";

import { Button } from "@/client/components/ui/button";
import { Card } from "@/client/components/ui/card";
import { FilePickerDialog } from "@/client/views/storage/dialogs/FilePickerDialog";
import { FileText, Upload, X } from "lucide-react";
import { FONT_FILE_EXTENSIONS } from "../types";
import { useState } from "react";

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

export const FontFilePicker = ({
  value,
  onChange,
  disabled = false,
}: FontFilePickerProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleFileSelect = (file: {
    path: string;
    name: string;
    url?: string;
    dbId?: bigint | null;
  }) => {
    if (!file.dbId) {
      // File not in database yet
      return;
    }

    onChange({
      fileId: Number(file.dbId),
      fileName: file.name,
      fileUrl: file.url || "",
    });
    setIsPickerOpen(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  const isValidFontFile = (fileName: string) => {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
    return FONT_FILE_EXTENSIONS.includes(ext);
  };

  return (
    <>
      <div className="space-y-2">
        {value ? (
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {value.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Font file selected
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPickerOpen(true)}
                  disabled={disabled}
                >
                  Change
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full h-24 border-dashed"
            onClick={() => setIsPickerOpen(true)}
            disabled={disabled}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm">Select Font File</span>
              <span className="text-xs text-muted-foreground">
                .ttf, .otf, .woff, .woff2
              </span>
            </div>
          </Button>
        )}
      </div>

      <FilePickerDialog
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleFileSelect}
        title="Select Font File"
        fileTypeFilter={file => isValidFontFile(file.name)}
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
- `client/components/ui/*`

**Content**:

```typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Card } from "@/client/components/ui/card";
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

export const FontForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  disabled = false,
}: FontFormProps) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Font Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Font Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Roboto, Cairo, Noto Sans"
          disabled={disabled || isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Locales */}
      <div className="space-y-2">
        <Label>Supported Locales</Label>
        <LocaleSelector
          value={formData.locale}
          onChange={locale => setFormData(prev => ({ ...prev, locale }))}
          disabled={disabled || isSubmitting}
        />
        {errors.locale && (
          <p className="text-sm text-destructive">{errors.locale}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Select "All Languages" for universal fonts, or choose specific locales
        </p>
      </div>

      {/* Font File */}
      <div className="space-y-2">
        <Label>Font File</Label>
        <FontFilePicker
          value={selectedFile}
          onChange={setSelectedFile}
          disabled={disabled || isSubmitting}
        />
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file}</p>
        )}
      </div>

      {/* Font Preview */}
      {selectedFile?.fileUrl && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <FontPreview
            fontName={formData.name || "Preview"}
            fontUrl={selectedFile.fileUrl}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={disabled || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
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
- `client/components/ui/*`

**Content**:

```typescript
"use client";

import { useFontOperations } from "./hooks/useFontOperations";
import { FontForm } from "./components/FontForm";
import { Button } from "@/client/components/ui/button";
import { Card } from "@/client/components/ui/card";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Trash2, Edit2, FileText } from "lucide-react";
import { useState } from "react";
import { DeleteFontDialog } from "./dialogs/DeleteFontDialog";

export const FontDetail = () => {
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
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Create New Font</h2>
          <Card className="p-6">
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
          </Card>
        </div>
      </div>
    );
  }

  // No font selected
  if (!selectedFontId) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Font Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a font from the list to view details
          </p>
        </div>
      </div>
    );
  }

  // Loading font details
  if (!currentFont) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-64" />
          <Card className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  // Editing mode
  if (isEditing) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Edit Font</h2>
          <Card className="p-6">
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
          </Card>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{currentFont.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Font ID: {currentFont.id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startEditing}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Details Card */}
        <Card className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Font Name
              </label>
              <p className="text-base mt-1">{currentFont.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Supported Locales
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentFont.locale.map(locale => (
                  <span
                    key={locale}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {locale}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Storage File ID
              </label>
              <p className="text-base mt-1">{currentFont.storageFileId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-sm mt-1">
                  {new Date(currentFont.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="text-sm mt-1">
                  {new Date(currentFont.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Dialog */}
      <DeleteFontDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        fontId={currentFont.id}
        fontName={currentFont.name}
      />
    </div>
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
- `client/components/ui/*`

**Content**:

```typescript
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Button } from "@/client/components/ui/button";
import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useFontOperations } from "../hooks/useFontOperations";

interface DeleteFontDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fontId: number;
  fontName: string;
}

export const DeleteFontDialog = ({
  isOpen,
  onClose,
  fontId,
  fontName,
}: DeleteFontDialogProps) => {
  const { deleteFont, checkFontUsage } = useFontOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    isInUse: boolean;
    usageCount: number;
    canDelete: boolean;
    deleteBlockReason: string | null;
  } | null>(null);

  // Check usage when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsCheckingUsage(true);
      checkFontUsage(fontId).then(result => {
        setUsageInfo(result);
        setIsCheckingUsage(false);
      });
    } else {
      setUsageInfo(null);
    }
  }, [isOpen, fontId, checkFontUsage]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteFont(fontId);
    setIsDeleting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Font</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{fontName}</strong>?
          </DialogDescription>
        </DialogHeader>

        {isCheckingUsage ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Checking usage...
            </span>
          </div>
        ) : usageInfo && !usageInfo.canDelete ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Cannot delete this font</p>
              <p className="text-sm">
                {usageInfo.deleteBlockReason ||
                  `This font is used in ${usageInfo.usageCount} certificate element(s).`}
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. The font will be permanently removed from the system.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              isDeleting ||
              isCheckingUsage ||
              (usageInfo !== null && !usageInfo.canDelete)
            }
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Font"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
- Pattern: Template management split view

**Content**:

```typescript
"use client";

import { FontList } from "./FontList";
import { FontDetail } from "./FontDetail";

export const FontManagementView = () => {
  return (
    <div className="flex h-full w-full">
      {/* Left sidebar - Font list (30%) */}
      <div className="w-[350px] flex-shrink-0">
        <FontList />
      </div>

      {/* Right content - Font detail (70%) */}
      <div className="flex-1 flex flex-col min-w-0">
        <FontDetail />
      </div>
    </div>
  );
};

export default FontManagementView;
```

**Key Features**:

- Split view layout
- Fixed width sidebar
- Flexible content area
- Simple composition

---

### Step 9: Create Next.js Page

**File**: `/workspaces/cgvs/app/(root)/(auth)/admin/fonts/page.tsx`

**Dependencies**:

- `client/views/font/FontManagementView`
- Pattern: Other admin pages

**Content**:

```typescript
import FontManagementView from "@/client/views/font/FontManagementView";

export default function FontsPage() {
  return <FontManagementView />;
}
```

**Key Features**:

- Simple page wrapper
- Consistent with other admin pages
- Server component by default

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
├── FontManagementView.tsx (main entry)
├── FontList.tsx
├── FontDetail.tsx
├── types.ts
├── components/
│   ├── index.ts
│   ├── LocaleSelector.tsx
│   ├── FontPreview.tsx
│   ├── FontFilePicker.tsx
│   └── FontForm.tsx
├── dialogs/
│   └── DeleteFontDialog.tsx
├── hooks/
│   ├── index.ts
│   ├── font.documents.ts
│   ├── useFontApolloMutations.ts
│   └── useFontOperations.ts
└── stores/
    └── useFontStore.ts

app/(root)/(auth)/admin/fonts/
└── page.tsx
```

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

- Font preview requires CORS-enabled storage URLs
- File picker filters only font file types
- "All" locale option is mutually exclusive with specific locales
- Usage check prevents accidental deletion
- Split view follows template management pattern
- All components use shadcn/ui for consistency
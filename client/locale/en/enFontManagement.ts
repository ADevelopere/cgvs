import { FontManagementTranslations } from "../components";

export const enFontManagement: FontManagementTranslations = {
  // List section
  fonts: "Fonts",
  newFont: "New Font",
  searchPlaceholder: "Search fonts...",
  noFontsFound: "No fonts found",
  noFontsYet: "No fonts yet",
  tryDifferentSearch: "Try a different search term",
  createFirstFont: "Create your first font to get started",
  createFont: "Create Font",
  errorLoadingFonts: "Error loading fonts: %{error}",
  font: "font",
  fontCount: "%{count}",

  // Detail section - View mode
  noFontSelected: "No Font Selected",
  selectFontFromList: "Select a font from the list to view details",
  fontId: "Font ID: %{id}",
  fontName: "Font Name",
  supportedLocales: "Supported Locales",
  storageFilePath: "Storage File Path",
  created: "Created",
  lastUpdated: "Last Updated",

  // Detail section - Create/Edit mode
  createNewFont: "Create New Font",
  editFont: "Edit Font",

  // Form section
  fontNameLabel: "Font Name",
  fontNamePlaceholder: "e.g., Roboto, Cairo, Noto Sans",
  supportedLocalesLabel: "Supported Locales",
  supportedLocalesHelper: 'Select "All Languages" for universal fonts, or choose specific locales',
  fontFileLabel: "Font File",
  preview: "Preview",

  // Form validation errors
  fontNameRequired: "Font name is required",
  localeRequired: "At least one locale must be selected",
  fontFileRequired: "Font file is required",

  // FilePicker section
  fontFileSelected: "Font file selected",
  change: "Change",
  selectFontFile: "Select Font File",
  fontFileFormats: ".ttf, .otf, .woff, .woff2",

  // Preview section
  failedToLoadPreview: "Failed to load font preview",
  previewFont: "Font: %{fontName}",

  // Delete dialog section
  deleteFont: "Delete Font",
  confirmDeleteMessage: 'Are you sure you want to delete "%{fontName}"?',
  checkingUsage: "Checking usage...",
  cannotDeleteFont: "Cannot delete this font",
  fontUsedInElements: "This font is used in %{count} certificate element(s).",
  cannotUndone: "This action cannot be undone.",
  deleteWarning: "The font will be permanently removed from the system.",
  deletingFont: "Deleting...",

  // LocaleSelector section
  selectLocalesPlaceholder: "Select locales...",

  // Notification messages
  fontCreatedSuccess: "%{name} has been created successfully",
  errorCreatingFont: "Error creating font",
  fontUpdatedSuccess: "%{name} has been updated successfully",
  errorUpdatingFont: "Error updating font",
  fontDeletedSuccess: "%{name} has been deleted successfully",
  errorDeletingFont: "Error deleting font",

  // Common actions
  save: "Save",
  cancel: "Cancel",
  edit: "Edit",
  delete: "Delete",
  saving: "Saving...",
  deleting: "Deleting...",
  saveChanges: "Save Changes",

  // Font Family
  familyName: "Family Name",
  familyNameRequired: "Family name is required",
  category: "Category",
  categoryOptional: "Category (Optional)",
  categoryPlaceholder: "e.g., Serif, Sans-serif, Monospace",
  editFontFamily: "Edit Font Family",
  familyUpdatedSuccess: "Family updated successfully",

  // Font Variant
  variant: "Variant",
  addVariant: "Add Variant",
  editVariant: "Edit Variant",
  variantAddedSuccess: "Variant added successfully",
  variantUpdatedSuccess: "Variant updated successfully",
  variantDeletedSuccess: "Variant deleted successfully",
  deleteVariant: "Delete Variant",
  confirmDeleteVariant: "Are you sure you want to delete the variant",
  cannotDeleteVariant: "Cannot Delete",
  variantUsedInElements: "This variant is used in %{count} element(s).",
  noVariantsYet: "No variants yet. Add your first variant.",
  addFirstVariant: "Add your first variant to get started",
  filePath: "File Path",
  fontVariants: "Font Variants",

  // Create with family
  createNewFontFamily: "Create New Font",
  creating: "Creating...",
  autoExtractedFromFile: "Auto-extracted from font file",
};

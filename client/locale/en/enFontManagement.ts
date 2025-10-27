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
  supportedLocalesHelper:
    'Select "All Languages" for universal fonts, or choose specific locales',
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
  deleteWarning:
    "The font will be permanently removed from the system.",
  deletingFont: "Deleting...",

  // LocaleSelector section
  selectLocalesPlaceholder: "Select locales...",

  // Common actions
  save: "Save",
  cancel: "Cancel",
  edit: "Edit",
  delete: "Delete",
  saving: "Saving...",
  deleting: "Deleting...",
  saveChanges: "Save Changes",
};


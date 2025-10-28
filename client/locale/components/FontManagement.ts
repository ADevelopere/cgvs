export type FontManagementTranslations = {
  [key: string]: string;

  // List section
  fonts: string;
  newFont: string;
  searchPlaceholder: string;
  noFontsFound: string;
  noFontsYet: string;
  tryDifferentSearch: string;
  createFirstFont: string;
  createFont: string;
  errorLoadingFonts: string;
  font: string;
  fontCount: string; // %{count}

  // Detail section - View mode
  noFontSelected: string;
  selectFontFromList: string;
  fontId: string;
  fontName: string;
  supportedLocales: string;
  storageFilePath: string;
  created: string;
  lastUpdated: string;

  // Detail section - Create/Edit mode
  createNewFont: string;
  editFont: string;

  // Form section
  fontNameLabel: string;
  fontNamePlaceholder: string;
  supportedLocalesLabel: string;
  supportedLocalesHelper: string;
  fontFileLabel: string;
  preview: string;

  // Form validation errors
  fontNameRequired: string;
  localeRequired: string;
  fontFileRequired: string;

  // FilePicker section
  fontFileSelected: string;
  change: string;
  selectFontFile: string;
  fontFileFormats: string;

  // Preview section
  failedToLoadPreview: string;
  previewFont: string;

  // Delete dialog section
  deleteFont: string;
  confirmDeleteMessage: string; // %{fontName}
  checkingUsage: string;
  cannotDeleteFont: string;
  fontUsedInElements: string; // %{count}
  cannotUndone: string;
  deleteWarning: string;
  deletingFont: string;

  // LocaleSelector section
  selectLocalesPlaceholder: string;

  // Notification messages
  fontCreatedSuccess: string; // %{name}
  errorCreatingFont: string;
  fontUpdatedSuccess: string; // %{name}
  errorUpdatingFont: string;
  fontDeletedSuccess: string; // %{name}
  errorDeletingFont: string;

  // Common actions
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  saving: string;
  deleting: string;
  saveChanges: string;
};

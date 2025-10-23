export type RecipientVariableDataTranslation = {
  // Tab label
  tabDataManagement: string;

  // Headers
  studentName: string;
  readyStatus: string;
  ready: string;
  notReady: string;
  none: string;

  // Actions
  selectGroup: string;
  selectGroupPrompt: string;

  // Success messages
  valueUpdatedSuccess: string;

  // Error messages
  errorFetchingData: string;
  errorUpdatingValue: string;
  validationError: string;

  // Validation messages
  requiredField: string;
  invalidNumber: string;
  numberTooLow: string;
  numberTooHigh: string;
  invalidDate: string;
  dateTooEarly: string;
  dateTooLate: string;
  textTooShort: string;
  textTooLong: string;
  patternMismatch: string;
  invalidSelection: string;
  tooManyDecimalPlaces: string;
  multipleSelectionNotAllowed: string;

  // Status tooltips
  missingRequiredFields: string;
  invalidValues: string;
  allRequiredFieldsComplete: string;

  // Table messages
  noRecipientsFound: string;
  loadingData: string;

  // Group selector
  selectGroupFirst: string;
  noGroupsAvailable: string;
};

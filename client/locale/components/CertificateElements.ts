export type CertificateElementsTranslations = {
  [key: string]: string | object;

  textElement: TextElementTranslations;
  dateElement: DateElementTranslations;
  numberElement: NumberElementTranslations;
  countryElement: CountryElementTranslations;
  genderElement: GenderElementTranslations;
  imageElement: ImageElementTranslations;
  qrCodeElement: QrCodeElementTranslations;
  baseElement: BaseElementTranslations;
  textProps: TextPropsTranslations;
  common: CommonTranslations;
};

export type TextElementTranslations = {
  [key: string]: string;

  // Section title
  textElementTitle: string;

  // Data source types
  dataSourceLabel: string;
  dataSourceStatic: string;
  dataSourceStudentField: string;
  dataSourceCertificateField: string;
  dataSourceTemplateTextVariable: string;
  dataSourceTemplateSelectVariable: string;

  // Static source
  staticValueLabel: string;
  staticValuePlaceholder: string;
  staticValueRequired: string;

  // Student field options
  studentFieldLabel: string;
  studentFieldName: string;
  studentFieldEmail: string;
  studentFieldRequired: string;

  // Certificate field options
  certificateFieldLabel: string;
  certificateFieldVerificationCode: string;
  certificateFieldRequired: string;

  // Template variables
  templateTextVariableLabel: string;
  templateSelectVariableLabel: string;
  selectVariable: string;
  noVariablesAvailable: string;
  variableRequired: string;
};

export type DateElementTranslations = {
  [key: string]: string;

  // Section title
  dateElementTitle: string;

  // Data source types
  dataSourceLabel: string;
  dataSourceStatic: string;
  dataSourceStudentField: string;
  dataSourceCertificateField: string;
  dataSourceTemplateVariable: string;

  // Static source
  staticValueLabel: string;
  staticValuePlaceholder: string;
  staticValueRequired: string;

  // Student field options
  studentFieldLabel: string;
  studentFieldDateOfBirth: string;
  studentFieldRequired: string;

  // Certificate field options
  certificateFieldLabel: string;
  certificateFieldReleaseDate: string;
  certificateFieldRequired: string;

  // Template variables
  templateDateVariableLabel: string;
  selectVariable: string;
  noVariablesAvailable: string;
  variableRequired: string;

  // Date properties
  formatLabel: string;
  formatPlaceholder: string;
  formatHelper: string;
  formatRequired: string;
  calendarTypeLabel: string;
  calendarTypeRequired: string;
  calendarTypeGregorian: string;
  calendarTypeHijri: string;
  offsetDaysLabel: string;
  offsetDaysPlaceholder: string;
  offsetDaysHelper: string;
  offsetDaysRequired: string;
  offsetDaysInvalid: string;
  
  // Transformation
  transformationLabel: string;
  transformationPlaceholder: string;
  transformationAgeCalculation: string;
  transformationNone: string;
  clearTransformation: string;
  closeTransformation: string;
};

export type BaseElementTranslations = {
  [key: string]: string;

  // Section title
  basePropertiesTitle: string;

  // Fields
  nameLabel: string;
  namePlaceholder: string;
  nameRequired: string;
  nameMinLength: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionRequired: string;

  // Position & Size
  positionLabel: string;
  positionXLabel: string;
  positionYLabel: string;
  positionRequired: string;
  sizeLabel: string;
  widthLabel: string;
  heightLabel: string;
  dimensionRequired: string;
  dimensionMustBePositive: string;

  // Alignment
  alignmentLabel: string;
  alignmentRequired: string;
  alignmentStart: string;
  alignmentEnd: string;
  alignmentTop: string;
  alignmentBottom: string;
  alignmentCenter: string;
  alignmentBaseline: string;

  // Render order
  renderOrderLabel: string;
  renderOrderPlaceholder: string;
  renderOrderRequired: string;
};

export type NumberElementTranslations = {
  [key: string]: string;

  // Section title
  numberElementTitle: string;

  // Data source
  dataSourceLabel: string;
  variableLabel: string;
  variableRequired: string;
  noVariablesAvailable: string;

  // Mapping
  mappingLabel: string;
  mappingDescription: string;
  localeLabel: string;
  decimalPlacesLabel: string;
  addLocaleButton: string;
  removeLocaleButton: string;
  decimalPlacesRequired: string;
  decimalPlacesInvalid: string;
};

export type TextPropsTranslations = {
  [key: string]: string;

  // Section title
  textPropertiesTitle: string;

  // Font
  fontLabel: string;
  fontRequired: string;
  fontSourceLabel: string;
  fontSourceRequired: string;
  fontSourceGoogle: string;
  fontSourceSelfHosted: string;
  googleFontLabel: string;
  googleFontPlaceholder: string;
  googleFontRequired: string;
  googleFontInvalidChars: string;
  selfHostedFontLabel: string;
  selfHostedFontPlaceholder: string;
  selfHostedFontRequired: string;
  searchFonts: string;
  loadingFonts: string;
  noFontsFound: string;

  // Color
  colorLabel: string;
  colorPlaceholder: string;
  colorRequired: string;
  colorInvalid: string;

  // Font size
  fontSizeLabel: string;
  fontSizePlaceholder: string;
  fontSizeRequired: string;
  fontSizeMinValue: string;
  fontSizeMaxValue: string;

  // Overflow
  overflowLabel: string;
  overflowRequired: string;
  overflowResizeDown: string;
  overflowTruncate: string;
  overflowEllipse: string;
  overflowWrap: string;
};

export type CountryElementTranslations = {
  [key: string]: string;

  // Section title
  countryElementTitle: string;

  // Representation
  representationLabel: string;
  representationRequired: string;
  representationInvalid: string;
  representationCountryName: string;
  representationNationality: string;
  representationCountryNameHelp: string;
  representationNationalityHelp: string;

  // Info message
  dataSourceInfo: string;
};

export type GenderElementTranslations = {
  [key: string]: string;

  // Section title
  genderElementTitle: string;

  // Info message
  dataSourceInfo: string;
};

export type ImageElementTranslations = {
  [key: string]: string;

  // Section title
  imageElementTitle: string;

  // Data Source
  dataSourceLabel: string;
  selectImageFile: string;
  selectedFile: string;
  noFileSelected: string;
  changeFile: string;
  clearSelection: string;

  // Image Props
  fitLabel: string;
  fitContain: string;
  fitContainDesc: string;
  fitCover: string;
  fitCoverDesc: string;
  fitFill: string;
  fitFillDesc: string;

  // Form titles
  createTitle: string;
  updateTitle: string;
};

export type QrCodeElementTranslations = {
  [key: string]: string;

  // Section title
  qrCodeElementTitle: string;

  // QR Code Props
  foregroundColorLabel: string;
  foregroundColorHelper: string;
  foregroundColorRequired: string;
  backgroundColorLabel: string;
  backgroundColorHelper: string;
  backgroundColorRequired: string;
  errorCorrectionLabel: string;
  errorCorrectionHelper: string;
  errorCorrectionRequired: string;
  errorCorrectionL: string;
  errorCorrectionM: string;
  errorCorrectionQ: string;
  errorCorrectionH: string;
  errorCorrectionLDesc: string;
  errorCorrectionMDesc: string;
  errorCorrectionQDesc: string;
  errorCorrectionHDesc: string;

  // Info message
  dataSourceInfo: string;
};

export type CommonTranslations = {
  [key: string]: string;

  // Actions
  create: string;
  update: string;
  cancel: string;
  save: string;
  submit: string;
  creating: string;
  updating: string;
  saving: string;

  // Messages
  requiredField: string;
  invalidValue: string;
  fillRequiredFields: string;

  // Success/Error
  createSuccess: string;
  createError: string;
  updateSuccess: string;
  updateError: string;
};


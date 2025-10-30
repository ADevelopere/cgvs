export type CertificateElementsTranslations = {
  [key: string]: string | object;

  textElement: TextElementTranslations;
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


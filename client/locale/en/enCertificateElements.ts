import type { CertificateElementsTranslations } from "../components/CertificateElements";

export const enCertificateElements: CertificateElementsTranslations = {
  textElement: {
    textElementTitle: "Text Element",

    // Data source types
    dataSourceLabel: "Data Source",
    dataSourceStatic: "Static Text",
    dataSourceStudentField: "Student Field",
    dataSourceCertificateField: "Certificate Field",
    dataSourceTemplateTextVariable: "Text Variable",
    dataSourceTemplateSelectVariable: "Select Variable",

    // Static source
    staticValueLabel: "Static Value",
    staticValuePlaceholder: "Enter static text",
    staticValueRequired: "Static value is required",

    // Student field options
    studentFieldLabel: "Student Field",
    studentFieldName: "Student Name",
    studentFieldEmail: "Student Email",
    studentFieldRequired: "Student field is required",

    // Certificate field options
    certificateFieldLabel: "Certificate Field",
    certificateFieldVerificationCode: "Verification Code",
    certificateFieldRequired: "Certificate field is required",

    // Template variables
    templateTextVariableLabel: "Text Variable",
    templateSelectVariableLabel: "Select Variable",
    selectVariable: "Select Variable",
    noVariablesAvailable: "No variables available",
    variableRequired: "Variable is required",
  },

  dateElement: {
    dateElementTitle: "Date Element",

    // Data source types
    dataSourceLabel: "Data Source",
    dataSourceStatic: "Static Date",
    dataSourceStudentField: "Student Date Field",
    dataSourceCertificateField: "Certificate Date Field",
    dataSourceTemplateVariable: "Date Variable",

    // Static source
    staticValueLabel: "Static Date",
    staticValuePlaceholder: "Select a date",
    staticValueRequired: "Static date is required",

    // Student field options
    studentFieldLabel: "Student Date Field",
    studentFieldDateOfBirth: "Date of Birth",
    studentFieldRequired: "Student date field is required",

    // Certificate field options
    certificateFieldLabel: "Certificate Date Field",
    certificateFieldReleaseDate: "Release Date",
    certificateFieldRequired: "Certificate date field is required",

    // Template variables
    templateDateVariableLabel: "Date Variable",
    selectVariable: "Select Variable",
    noVariablesAvailable: "No date variables available",
    variableRequired: "Date variable is required",

    // Date properties
    formatLabel: "Date Format",
    formatPlaceholder: "e.g., YYYY-MM-DD or DD/MM/YYYY",
    formatHelper: "Examples: YYYY-MM-DD, DD/MM/YYYY, MMMM DD, YYYY",
    formatRequired: "Date format is required",
    calendarTypeLabel: "Calendar Type",
    calendarTypeRequired: "Calendar type is required",
    calendarTypeGregorian: "Gregorian",
    calendarTypeHijri: "Hijri",
    offsetDaysLabel: "Offset Days",
    offsetDaysPlaceholder: "0",
    offsetDaysHelper: "Number of days to add or subtract from the date (use negative numbers to subtract)",
    offsetDaysRequired: "Offset days is required",
    offsetDaysInvalid: "Offset days must be an integer",
    
    // Transformation
    transformationLabel: "Transformation",
    transformationPlaceholder: "Select transformation type",
    transformationAgeCalculation: "Age Calculation",
    transformationNone: "None",
    clearTransformation: "Clear",
    closeTransformation: "Close",
  },

  numberElement: {
    numberElementTitle: "Number Element",

    // Data source
    dataSourceLabel: "Data Source",
    variableLabel: "Number Variable",
    variableRequired: "Number variable is required",
    noVariablesAvailable: "No number variables available",

    // Mapping
    mappingLabel: "Decimal Places Formatting",
    mappingDescription: "Specify decimal places for each locale",
    localeLabel: "Locale",
    decimalPlacesLabel: "Decimal Places",
    addLocaleButton: "Add Locale",
    removeLocaleButton: "Remove Locale",
    decimalPlacesRequired: "Decimal places is required",
    decimalPlacesInvalid: "Decimal places must be a non-negative number",
  },

  countryElement: {
    // Section title
    countryElementTitle: "Country Element",

    // Representation
    representationLabel: "Representation",
    representationRequired: "Representation is required",
    representationInvalid: "Invalid representation",
    representationCountryName: "Country Name",
    representationNationality: "Nationality",
    representationCountryNameHelp: "Displays country name (e.g., Egypt)",
    representationNationalityHelp: "Displays nationality (e.g., Egyptian)",

    // Info message
    dataSourceInfo: "Data source is always the student's nationality",
  },

  genderElement: {
    // Section title
    genderElementTitle: "Gender Element",

    // Info message
    dataSourceInfo: "Data source is always the student's gender",
  },

  imageElement: {
    // Section title
    imageElementTitle: "Image Element",

    // Data Source
    dataSourceLabel: "Image Source",
    selectImageFile: "Select Image File",
    selectedFile: "Selected File",
    noFileSelected: "No file selected",
    changeFile: "Change File",
    clearSelection: "Clear Selection",

    // Image Props
    fitLabel: "Image Fit",
    fitContain: "Contain",
    fitContainDesc: "Preserve aspect ratio, entire image visible",
    fitCover: "Cover",
    fitCoverDesc: "Preserve aspect ratio, fill entire space",
    fitFill: "Fill",
    fitFillDesc: "Stretch image to fill entire space",

    // Form titles
    createTitle: "Create Image Element",
    updateTitle: "Update Image Element",
  },

  baseElement: {
    basePropertiesTitle: "Base Properties",

    // Fields
    nameLabel: "Name",
    namePlaceholder: "Enter element name",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Enter element description",
    descriptionRequired: "Description is required",

    // Position & Size
    positionLabel: "Position",
    positionXLabel: "X Position",
    positionYLabel: "Y Position",
    positionRequired: "Position is required",
    sizeLabel: "Size",
    widthLabel: "Width",
    heightLabel: "Height",
    dimensionRequired: "Dimensions are required",
    dimensionMustBePositive: "Dimensions must be positive",

    // Alignment
    alignmentLabel: "Alignment",
    alignmentRequired: "Alignment is required",
    alignmentStart: "Start",
    alignmentEnd: "End",
    alignmentTop: "Top",
    alignmentBottom: "Bottom",
    alignmentCenter: "Center",
    alignmentBaseline: "Baseline",

    // Render order
    renderOrderLabel: "Render Order",
    renderOrderPlaceholder: "Enter render order",
    renderOrderRequired: "Render order is required",
  },

  textProps: {
    textPropertiesTitle: "Text Properties",

    // Font
    fontLabel: "Font",
    fontRequired: "Font is required",
    fontSourceLabel: "Font Source",
    fontSourceRequired: "Font source is required",
    fontSourceGoogle: "Google Fonts",
    fontSourceSelfHosted: "Self-Hosted Fonts",
    googleFontLabel: "Google Font",
    googleFontPlaceholder: "Search for Google Font",
    googleFontRequired: "Google font identifier is required",
    googleFontInvalidChars: "Invalid characters in font identifier",
    selfHostedFontLabel: "Self-Hosted Font",
    selfHostedFontPlaceholder: "Select self-hosted font",
    selfHostedFontRequired: "Font selection is required",
    searchFonts: "Search fonts",
    loadingFonts: "Loading fonts...",
    noFontsFound: "No fonts found",

    // Color
    colorLabel: "Color",
    colorPlaceholder: "#000000",
    colorRequired: "Color is required",
    colorInvalid: "Invalid color format",

    // Font size
    fontSizeLabel: "Font Size",
    fontSizePlaceholder: "16",
    fontSizeRequired: "Font size is required",
    fontSizeMinValue: "Font size must be positive",
    fontSizeMaxValue: "Font size cannot exceed 1000",

    // Overflow
    overflowLabel: "Overflow",
    overflowRequired: "Overflow is required",
    overflowResizeDown: "Resize Down",
    overflowTruncate: "Truncate",
    overflowEllipse: "Ellipse",
    overflowWrap: "Wrap",
  },

  common: {
    // Actions
    create: "Create",
    update: "Update",
    cancel: "Cancel",
    save: "Save",
    submit: "Submit",
    creating: "Creating...",
    updating: "Updating...",
    saving: "Saving...",

    // Messages
    requiredField: "This field is required",
    invalidValue: "Invalid value",
    fillRequiredFields: "Please fill in all required fields",

    // Success/Error
    createSuccess: "Created successfully",
    createError: "Failed to create",
    updateSuccess: "Updated successfully",
    updateError: "Failed to update",
  },
};


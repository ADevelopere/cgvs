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


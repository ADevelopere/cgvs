import {
  TemplateEditorTranslations,
  MiscellaneousPanelTranslations,
  TemplateEditorPaneTranslations,
  AddNodePanelTranslations,
} from "../components";

const enMiscellaneousPanel: MiscellaneousPanelTranslations = {
  // tabs
  configTab: "Config",
  elementsTab: "Elements",
  currentElementTab: "Current Element",
};

const enTemplateEditorPane: TemplateEditorPaneTranslations = {
  miscellaneousPane: "Settings",
  addNodePane: "Add Node",
};

const enAddNodePanel: AddNodePanelTranslations = {
  create: "Create",

  createTextElement: "Create Text Element",
  createDateElement: "Create Date Element",
  createNumberElement: "Create Number Element",
  createCountryElement: "Create Country Element",
  createGenderElement: "Create Gender Element",
  createImageElement: "Create Image Element",
  createQrCodeElement: "Create QR Code Element",

  failedToCreateElement: "Failed to create element",

  items: {
    student: "Student",
    certificate: "Certificate",
    variable: "Variable",
    image: "Image",
  },
  studentOptions: {
    title: "Student fields",
    name: "Student name",
    email: "Student email",
    dateOfBirth: "Date of birth",
    age: "Age",
    gender: "Gender",
    nationality: "Nationality",
    country: "Country",
  },
  certificateOptions: {
    title: "Certificate fields",
    verificationCode: "Verification code",
    qrCode: "QR code",
  },
  variableOptions: {
    title: "Variables",
    text: "Text variable",
    date: "Date variable",
    number: "Number variable",
    select: "Select variable",
  },
};

export const enTemplateEditor: TemplateEditorTranslations = {
  templateEditorPane: enTemplateEditorPane,
  miscellaneousPanel: enMiscellaneousPanel,
  addNodePanel: enAddNodePanel,
};

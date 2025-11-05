import {
  TemplateEditorTranslations,
  MiscellaneousPanelTranslations,
  TemplateEditorPaneTranslations,
  AddNodePanelTranslations
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
    },
};

export const enTemplateEditor: TemplateEditorTranslations = {
  templateEditorPane: enTemplateEditorPane,
  miscellaneousPanel: enMiscellaneousPanel,
  addNodePanel: enAddNodePanel,
};

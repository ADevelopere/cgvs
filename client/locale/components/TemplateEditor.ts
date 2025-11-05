export type MiscellaneousPanelTranslations = {
  [key: string]: string | object;

  // tabs
  configTab: string;
  elementsTab: string;
  currentElementTab: string;
};

export type TemplateEditorPaneTranslations = {
  [key: string]: string | object;

  addNodePane: string;
  miscellaneousPane: string;
};

export type TemplateEditorTranslations = {
  [key: string]: string | object;

  templateEditorPane: TemplateEditorPaneTranslations;

  miscellaneousPanel: MiscellaneousPanelTranslations;
  addNodePanel: AddNodePanelTranslations;
};

export type AddNodePanelTranslations = {
  [key: string]: string | object;

  items: {
    [key: string]: string;
    student: string;
    certificate: string;
    variable: string;
    image: string;
  };

  studentOptions: {
    [key: string]: string;
    title: string;
    name: string;
    email: string;
    dateOfBirth: string;
    age: string;
    gender: string;
    nationality: string;
    country: string;
  };

  certificateOptions: {
    [key: string]: string;
    title: string;
    verificationCode: string;
    qrCode: string;
  };

  variableOptions: {
    [key: string]: string;
    title: string;
    text: string;
    date: string;
    number: string;
  };
};

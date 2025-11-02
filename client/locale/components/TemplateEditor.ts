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
};

export type TemplateConfigTranslations = {
  [key: string]: string | object;

  // Form Labels
  width: string;
  height: string;

  // Titles
  createTemplateConfiguration: string;
  templateConfiguration: string;

  // Buttons
  create: string;

  // Error Messages
  failedToCreateTemplateConfiguration: string;
  failedToUpdateTemplateConfiguration: string;
  valueIsRequired: string;

  // Validation Errors
  valueMustBeGreaterThanZero: string;
  valueMustBeLessThanOrEqualTo10000: string;
  valueIsTooSmall: string;
  valueIsTooLarge: string;
};

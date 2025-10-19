import * as AR from "@/client/locale/ar";

import * as Components from "./components";
import AppLanguage from "./AppLanguage";

export type Translations = {
  headerTranslations: Components.HeaderTranslations;
  authTranslations: Components.AuthTranslations;
  calendarTranslations: Components.CalendarTranslations;
  countryTranslations: Components.CountryTranslations;
  genderTranslations: Components.GenderTranslations;
  languageTranslations: Components.LanguageTranslations;
  templateCategoryTranslations: Components.TemplateCategoryTranslation;
  errorTranslations: Components.ErrorTranslations;
  studentTranslations: Components.StudentTranslations;
  templateVariableTranslations: Components.TemplateVariableTranslation;
  recipientTranslations: Components.RecipientTranslation;
  recipientGroupTranslations: Components.RecipientGroupTranslation;
  storageTranslations: Components.StorageTranslations;
  connectivityTranslations: Components.ConnectivityTranslations;
};

const translations: Record<AppLanguage, Translations> = {
  ar: {
    headerTranslations: AR.header,
    authTranslations: AR.auth,
    calendarTranslations: AR.calendar,
    countryTranslations: AR.country,
    genderTranslations: AR.gender,
    languageTranslations: AR.language,
    templateCategoryTranslations: AR.templateCategory,
    errorTranslations: AR.error,
    studentTranslations: AR.student,
    templateVariableTranslations: AR.templateVariable,
    recipientTranslations: AR.recipient,
    recipientGroupTranslations: AR.recipientGroup,
    storageTranslations: AR.storage,
    connectivityTranslations: AR.connectivity,
  },
  // Add other languages here as needed
};

export default translations;

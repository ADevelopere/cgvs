import * as AR from "@/client/locale/ar";
import * as EN from "@/client/locale/en";

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
  recipientVariableDataTranslations: Components.RecipientVariableDataTranslation;
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
    recipientVariableDataTranslations: AR.recipientVariableData,
    storageTranslations: AR.storage,
    connectivityTranslations: AR.connectivity,
  },
  en: {
    headerTranslations: EN.enHeader,
    authTranslations: EN.enAuth,
    calendarTranslations: EN.enCalendar,
    countryTranslations: EN.enCountry,
    genderTranslations: EN.enGender,
    languageTranslations: EN.enLanguage,
    templateCategoryTranslations: EN.enTemplateCategory,
    errorTranslations: EN.enError,
    studentTranslations: EN.enStudent,
    templateVariableTranslations: EN.enTemplateVariable,
    recipientTranslations: EN.enRecipient,
    recipientGroupTranslations: EN.enRecipientGroup,
    recipientVariableDataTranslations: EN.enRecipientVariableData,
    storageTranslations: EN.enStorage,
    connectivityTranslations: EN.enConnectivity,
  },
};

export default translations;

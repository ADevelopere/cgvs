import * as AR from "@/client/locale/ar";
import * as EN from "@/client/locale/en";

import * as Components from "./components";
import AppLanguage from "./AppLanguage";

export type Translations = {
  headerTranslations: Components.HeaderTranslations;
  authTranslations: Components.AuthTranslations;
  calendarTranslations: Components.CalendarTranslations;
  certificateElementsTranslations: Components.CertificateElementsTranslations;
  connectivityTranslations: Components.ConnectivityTranslations;
  countryTranslations: Components.CountryTranslations;
  dashboardLayoutTranslations: Components.DashboardLayoutTranslations;
  errorTranslations: Components.ErrorTranslations;
  fontManagementTranslations: Components.FontManagementTranslations;
  genderTranslations: Components.GenderTranslations;
  languageTranslations: Components.LanguageTranslations;
  recipientTranslations: Components.RecipientTranslation;
  recipientGroupTranslations: Components.RecipientGroupTranslation;
  recipientVariableDataTranslations: Components.RecipientVariableDataTranslation;
  storageTranslations: Components.StorageTranslations;
  studentTranslations: Components.StudentTranslations;
  templateCategoryTranslations: Components.TemplateCategoryTranslation;
  templateVariableTranslations: Components.TemplateVariableTranslation;
};

const translations: Record<AppLanguage, Translations> = {
  ar: {
    headerTranslations: AR.header,
    authTranslations: AR.auth,
    calendarTranslations: AR.calendar,
    certificateElementsTranslations: AR.certificateElements,
    connectivityTranslations: AR.connectivity,
    countryTranslations: AR.country,
    dashboardLayoutTranslations: AR.dashboardLayout,
    errorTranslations: AR.error,
    fontManagementTranslations: AR.fontManagement,
    genderTranslations: AR.gender,
    languageTranslations: AR.language,
    recipientTranslations: AR.recipient,
    recipientGroupTranslations: AR.recipientGroup,
    recipientVariableDataTranslations: AR.recipientVariableData,
    storageTranslations: AR.storage,
    studentTranslations: AR.student,
    templateCategoryTranslations: AR.templateCategory,
    templateVariableTranslations: AR.templateVariable,
  },
  en: {
    headerTranslations: EN.enHeader,
    authTranslations: EN.enAuth,
    calendarTranslations: EN.enCalendar,
    certificateElementsTranslations: EN.enCertificateElements,
    connectivityTranslations: EN.enConnectivity,
    countryTranslations: EN.enCountry,
    dashboardLayoutTranslations: EN.enDashboardLayout,
    errorTranslations: EN.enError,
    fontManagementTranslations: EN.enFontManagement,
    genderTranslations: EN.enGender,
    languageTranslations: EN.enLanguage,
    recipientTranslations: EN.enRecipient,
    recipientGroupTranslations: EN.enRecipientGroup,
    recipientVariableDataTranslations: EN.enRecipientVariableData,
    storageTranslations: EN.enStorage,
    studentTranslations: EN.enStudent,
    templateCategoryTranslations: EN.enTemplateCategory,
    templateVariableTranslations: EN.enTemplateVariable,
  },
};

export default translations;

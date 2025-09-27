import HeaderTranslations from "@/locale/components/Header";
import AuthTranslations from "@/locale/components/Auth";
import CalendarTranslations from "@/locale/components/Calendar";
import CountryTranslations from "@/locale/components/Country";
import GenderTranslations from "./components/Gender";
import LanguageTranslations from "./components/Language";
import TemplateCategoryTranslation from "./components/TemplateCategory";
import ErrorTranslations from "./components/Error";
import StudentTranslations from "./components/Student";
import ConnectivityTranslations from "./components/Connectivity";

import arHeader from "@/locale/ar/header";
import arAuth from "@/locale/ar/auth";
import arCalendar from "@/locale/ar/calendar";
import arCountry from "@/locale/ar/country";
import arGender from "@/locale/ar/gender";
import arLanguage from "@/locale/ar/language";
import arCourseCategory from "@/locale/ar/templateCategory";
import arError from "@/locale/ar/error";
import arStudent from "@/locale/ar/student";
import arTemplateVariable from "@/locale/ar/templateVariable";
import arStorageTranslations from "./ar/storage";
import arConnectivity from "./ar/connectivity";


import AppLanguage from "./AppLanguage";
import TemplateVariableTranslation from "./components/TemplateVariable";
import StorageTranslations from "./components/Storage";

export type Translations = {
    headerTranslations: HeaderTranslations;
    authTranslations: AuthTranslations;
    calendarTranslations: CalendarTranslations;
    countryTranslations: CountryTranslations;
    genderTranslations: GenderTranslations;
    languageTranslations: LanguageTranslations;
    templateCategoryTranslations: TemplateCategoryTranslation;
    errorTranslations: ErrorTranslations;
    studentTranslations: StudentTranslations;
    templateVariableTranslations: TemplateVariableTranslation;
    storageTranslations: StorageTranslations;
    connectivityTranslations: ConnectivityTranslations;
};

const translations: Record<AppLanguage, Translations> = {
    ar: {
        headerTranslations: arHeader,
        authTranslations: arAuth,
        calendarTranslations: arCalendar,
        countryTranslations: arCountry,
        genderTranslations: arGender,
        languageTranslations: arLanguage,
        templateCategoryTranslations: arCourseCategory,
        errorTranslations: arError,
        studentTranslations: arStudent,
        templateVariableTranslations: arTemplateVariable,
        storageTranslations: arStorageTranslations,
        connectivityTranslations: arConnectivity,
    },
    // Add other languages here as needed
};

export default translations;

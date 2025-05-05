import HeaderTranslations from "@/locale/components/Header";
import AuthTranslations from "@/locale/components/Auth";
import CalendarTranslations from "@/locale/components/Calendar";
import CountryTranslations from "@/locale/components/Country";
import GenderTranslations from "./components/Gender";
import LanguageTranslations from "./components/Language";
import TemplateCategoryTranslation from "./components/TemplateCategory";

import arHeader from "@/locale/ar/header";
import arAuth from "@/locale/ar/auth";
import arCalendar from "@/locale/ar/calendar";
import arCountry from "@/locale/ar/country";
import arGender from "@/locale/ar/gender";
import arLanguage from "@/locale/ar/language";
import arCourseCategory from "@/locale/ar/templateCategory";

import AppLanguage from "./AppLanguage";

export type Translations = {
    headerTranslations: HeaderTranslations;
    authTranslations: AuthTranslations;
    calendarTranslations: CalendarTranslations;
    countryTranslations: CountryTranslations;
    genderTranslations: GenderTranslations;
    languageTranslations: LanguageTranslations;
    templateCategoryTranslations: TemplateCategoryTranslation;
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
    },
    // Add other languages here as needed
};

export default translations;

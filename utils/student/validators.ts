import Calendar from "@/types/Calendar";
import moment from "moment-hijri";
import { matchIsValidTel } from "mui-tel-input";
import countries, { CountryType } from "../country";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";

// Constants
export const ARABIC_REGEX = /^[\u0621-\u064A ]+$/;

// Function to validate name
/**
 * Validates if the given name is valid based on Arabic characters.
 * @param {string} name - The name to validate.
 * @param {boolean} isRequired - Whether the name is required.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
export const isArabicNameValid = (
    name: string,
    isRequired: boolean,
): boolean => {
    if (name.trim().length === 0) {
        return !isRequired;
    }
    return ARABIC_REGEX.test(name);
};

// Function to validate date
/**
 * Validates if the given date is valid based on the calendar type and max date.
 * @param {moment.Moment} date - The date to validate.
 * @param {moment.Moment} maxDate - The maximum allowed date.
 * @param {Calendar} calendar - The calendar type (Hijri or Gregorian).
 * @returns {boolean} - True if the date is valid, false otherwise.
 */
export const isValidDate = (
    date: moment.Moment,
    maxDate: moment.Moment,
    calendar: Calendar,
): boolean => {
    maxDate.add(6, "months");

    if (calendar === Calendar.Hijri) {
        const hijriDate = moment(date.format("iYYYY/iM/iD"), "iYYYY/iM/iD");
        const maxHijriDate = moment(
            maxDate.format("iYYYY/iM/iD"),
            "iYYYY/iM/iD",
        );
        return hijriDate.isValid() && hijriDate.isSameOrBefore(maxHijriDate);
    }

    return date.isValid() && date.isSameOrBefore(maxDate);
};

export const isValidCountryCode = (countryCode: string): boolean => {
    if(!countryCode) return false;
    return countries.some(
        (country) => country.code.toLowerCase() === countryCode.toLowerCase(),
    );
};

// Function to validate country
/**
 * Validates if the given country is valid.
 * @param {CountryType} country - The country to validate.
 * @returns {boolean} - True if the country is valid, false otherwise.
 */
export const isValidCountry = (country: CountryType): boolean => {
    return country?.code
        ? 
          country.code !== "IL" as CountryCode
        : false;
};

// Function to validate phone number
/**
 * Validates if the given phone number is valid.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    return matchIsValidTel(phone, { excludedCountries: ["IL"] });
};

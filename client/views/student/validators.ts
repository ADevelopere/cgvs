import { Calendar } from "@/lib/enum";
import moment from "moment-hijri";
import { matchIsValidTel } from "mui-tel-input";
import countries, { CountryType } from "../../lib/country";
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
  isRequired: boolean
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
  calendar: Calendar
): boolean => {
  maxDate.add(6, "months");

  if (calendar === Calendar.Hijri) {
    const hijriDate = moment(date.format("iYYYY/iM/iD"), "iYYYY/iM/iD");
    const maxHijriDate = moment(maxDate.format("iYYYY/iM/iD"), "iYYYY/iM/iD");
    return hijriDate.isValid() && hijriDate.isSameOrBefore(maxHijriDate);
  }

  return date.isValid() && date.isSameOrBefore(maxDate);
};

export const isValidCountryCode = (countryCode: string): boolean => {
  if (!countryCode) return false;
  return countries.some(
    country => country.code.toLowerCase() === countryCode.toLowerCase()
  );
};

// Function to validate country
/**
 * Validates if the given country is valid.
 * @param {CountryType} country - The country to validate.
 * @returns {boolean} - True if the country is valid, false otherwise.
 */
export const isValidCountry = (country: CountryType): boolean => {
  return country?.code ? country.code !== ("IL" as CountryCode) : false;
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

// ============================================================================
// Validator Functions for Table and Form
// These return null if valid, or error message string if invalid
// ============================================================================

/**
 * Validates student name (requires 3 words, each at least 3 characters)
 * @param value - The name to validate
 * @returns null if valid, error message if invalid
 */
export const validateName = (value: string | undefined): string | null => {
  if (!value || !value.trim()) {
    return "Name is required";
  }
  const words = value.trim().split(/\s+/);
  if (words.length < 3) {
    return "Name must contain at least 3 words";
  }
  if (!words.every(word => word.length >= 3)) {
    return "Each word must be at least 3 characters";
  }
  // Unicode regex for letters from any language plus allowed special characters
  const nameRegex = /^[\p{L}\p{M}'-]+$/u;
  if (!words.every(word => nameRegex.test(word))) {
    return "Name contains invalid characters";
  }
  return null;
};

/**
 * Validates email address
 * @param value - The email to validate
 * @returns null if valid, error message if invalid
 */
export const validateEmail = (value: string | undefined): string | null => {
  // Allow empty values
  if (!value || !value.trim()) {
    return null;
  }

  const trimmedValue = value.trim();

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedValue) ? null : "Invalid email address";
};

/**
 * Validates date of birth (must be in the past)
 * @param value - The date to validate
 * @returns null if valid, error message if invalid
 */
export const validateDateOfBirth = (value: Date | undefined): string | null => {
  if (!value) {
    return null; // Optional field
  }

  // Check if valid date
  if (isNaN(value.getTime())) {
    return "Invalid date format";
  }

  const now = new Date();
  if (value > now) {
    return "Date of birth cannot be in the future";
  }

  return null;
};

/**
 * Validates gender value
 * @param value - The gender to validate
 * @returns null if valid, error message if invalid
 */
export const validateGender = (value: string | undefined): string | null => {
  if (!value) {
    return null; // Optional field
  }

  const validGenders = ["MALE", "FEMALE", "OTHER"];
  return validGenders.includes(value.toUpperCase())
    ? null
    : "Invalid gender value";
};

/**
 * Validates nationality country code
 * @param value - The country code to validate
 * @returns null if valid, error message if invalid
 */
export const validateNationality = (value: CountryCode | undefined): string | null => {
  if (!value) {
    return null; // Optional field
  }

  return isValidCountryCode(value) ? null : "Invalid country code";
};

/**
 * Validates phone number
 * @param value - The phone number to validate
 * @returns null if valid, error message if invalid
 */
export const validatePhoneNumber = (value: string | undefined): string | null => {
  if (!value || !value.trim()) {
    return null; // Optional field
  }

  return isValidPhoneNumber(value) ? null : "Invalid phone number";
};

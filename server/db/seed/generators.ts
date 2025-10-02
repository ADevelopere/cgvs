/**
 * Helper functions for generating seed data
 */

import {
    arabicFirstNames,
    arabicMiddleNames,
    arabicLastNames,
    emailDomains,
} from "./constants";

/**
 * Generates a random Arabic full name
 */
export function generateArabicFullName(): string {
    const firstName =
        arabicFirstNames[Math.floor(Math.random() * arabicFirstNames.length)];
    const middleName =
        arabicMiddleNames[
            Math.floor(Math.random() * arabicMiddleNames.length)
        ];
    const lastName =
        arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];

    return `${firstName} ${middleName} ${lastName}`;
}

/**
 * Generates a random email address from Arabic name components
 */
export function generateEmail(
    firstName: string = "",
    lastName: string = "",
): string {
    const randomNum = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    const firstNameSafe = `${firstName.replace(/\s/g, "")}${Math.floor(Math.random() * 9000) + 1000}`;
    const lastNameSafe = `${lastName.replace(/\s/g, "")}${Math.floor(Math.random() * 900) + 100}`;
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    
    return `${firstNameSafe}.${lastNameSafe}${randomNum}@${domain}`.toLowerCase();
}

/**
 * Generates a random Saudi phone number
 */
export function generatePhoneNumber(): string {
    const secondDigit = Math.floor(Math.random() * 10);
    const rest = Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000);
    return `+9665${secondDigit}${rest}`;
}

/**
 * Generates a random date of birth (between 1980 and 2004)
 */
export function generateDateOfBirth(): Date {
    const year = Math.floor(Math.random() * (2004 - 1980 + 1) + 1980);
    const month = Math.floor(Math.random() * 12); // 0-11
    const day = Math.floor(Math.random() * (28 - 1 + 1) + 1); // Safe day range
    return new Date(year, month, day);
}

/**
 * Shuffles an array randomly (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

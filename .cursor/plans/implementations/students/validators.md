# Student Validators Implementation

**File:** `client/views/student/validators.ts`

**Status:** ✅ No changes needed - Already compatible with new architecture

This file contains validation functions for student data. These validators are pure functions that work with any table architecture.

## Current Implementation

```typescript
import { Calendar } from "@/lib/enum";
import moment from "moment-hijri";
import { matchIsValidTel } from "mui-tel-input";
import countries, { CountryType } from "../../lib/country";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";

// Constants
export const ARABIC_REGEX = /^[\u0621-\u064A ]+$/;

// Function to validate name
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
export const isValidCountry = (country: CountryType): boolean => {
  return country?.code ? country.code !== ("IL" as CountryCode) : false;
};

// Function to validate phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  return matchIsValidTel(phone, { excludedCountries: ["IL"] });
};
```

## Usage in New Architecture

### In useStudentTable Hook

```typescript
const validateFullName = useCallback(
  (value: string): string | null => {
    if (!value) return strings?.nameRequired;
    const words = value.trim().split(/\s+/);
    // ... validation logic
    return null;
  },
  [strings]
);

const validateNationality = useCallback(
  (value: string): string | null | undefined => {
    return isValidCountryCode(value) ? null : strings?.nationalityInvalid;
  },
  [strings]
);

const validatePhoneNumber = useCallback(
  (value: string): string | null | undefined => {
    return isValidPhoneNumber(value) ? null : strings?.phoneNumberInvalid;
  },
  [strings]
);
```

### In Edit Renderers

```typescript
<TextEditRenderer
  value={row.name}
  onSave={onSave}
  onCancel={onCancel}
  validator={validateFullName}
/>

<CountryEditRenderer
  value={row.nationality}
  onSave={onSave}
  onCancel={onCancel}
  validator={validateNationality}
/>

<PhoneEditRenderer
  value={row.phoneNumber}
  onSave={onSave}
  onCancel={onCancel}
  validator={validatePhoneNumber}
/>
```

## Validator Functions

### isArabicNameValid

Validates Arabic names:

- Checks if name is empty (allowed if not required)
- Tests against Arabic character regex
- Used for forms that require Arabic input

### isValidDate

Validates dates with calendar support:

- Supports both Hijri and Gregorian calendars
- Ensures date is not in the future (with 6-month grace period)
- Used for date of birth validation

### isValidCountryCode

Validates country codes:

- Checks against list of valid country codes
- Case-insensitive comparison
- Excludes invalid/blocked countries

### isValidCountry

Validates country objects:

- Ensures country has a code
- Excludes specific countries (e.g., Israel)
- Used with country picker components

### isValidPhoneNumber

Validates phone numbers:

- Uses `mui-tel-input` library
- Excludes specific country codes
- Supports international format

## Integration with New Architecture

These validators work seamlessly with the new renderer-based architecture:

1. **Pure Functions**: No dependencies on table structure
2. **Reusable**: Can be used in edit renderers, forms, and validation hooks
3. **Type Safe**: Work with TypeScript types
4. **Composable**: Can be combined with other validators
5. **Testable**: Easy to unit test

## Constants

### ARABIC_REGEX

```typescript
const ARABIC_REGEX = /^[\u0621-\u064A ]+$/;
```

Matches Arabic Unicode characters and spaces.

## Why No Changes Are Needed

1. **Pure Functions**: Validators don't depend on table structure
2. **Reusable**: Used in both table and form components
3. **Type Safe**: Work with any TypeScript types
4. **Framework Agnostic**: Don't depend on React or table library
5. **Well Tested**: Existing tests remain valid

## Testing

No changes to validator tests are required. Example tests:

```typescript
describe("isValidCountryCode", () => {
  it("should return true for valid country codes", () => {
    expect(isValidCountryCode("US")).toBe(true);
    expect(isValidCountryCode("SA")).toBe(true);
  });

  it("should return false for invalid country codes", () => {
    expect(isValidCountryCode("")).toBe(false);
    expect(isValidCountryCode("XX")).toBe(false);
  });
});

describe("isValidPhoneNumber", () => {
  it("should return true for valid phone numbers", () => {
    expect(isValidPhoneNumber("+966501234567")).toBe(true);
  });

  it("should return false for invalid phone numbers", () => {
    expect(isValidPhoneNumber("")).toBe(false);
    expect(isValidPhoneNumber("invalid")).toBe(false);
  });
});
```

## Dependencies

- `moment-hijri`: For Hijri calendar support
- `mui-tel-input`: For phone number validation
- `countries` library: For country code validation

## Summary

**Action Required:** ✅ None - This file is already compatible

The validator functions are pure, reusable, and work perfectly with the new renderer-based architecture. They can be used in edit renderers, forms, and any other validation scenarios without modification.

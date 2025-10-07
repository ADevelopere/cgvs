import type {
    TemplateTextVariable,
    TemplateNumberVariable,
    TemplateDateVariable,
    TemplateSelectVariable,
    UptemplateDateTextVariableInput,
    UpdateTemplateNumberVariableInput,
    UptemplateDateDateVariableInput,
    UpdateTemplateSelectVariableInput,
} from "@/graphql/generated/types";

/**
 * Helper function to check if two potentially undefined values are different.
 * Handles undefined, null, empty strings, and different data types consistently.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns boolean - true if values are different, false if they are equivalent
 */
function isDifferent<T>(
    a: T | undefined | null,
    b: T | undefined | null,
): boolean {
    // Handle null and undefined cases
    const aIsNullish = a === null || a === undefined;
    const bIsNullish = b === null || b === undefined;

    // If both are nullish, they are considered equal
    if (aIsNullish && bIsNullish) {
        return false;
    }

    // Handle empty string cases - consider empty string equivalent to null/undefined
    const aIsEmpty = a === "";
    const bIsEmpty = b === "";

    // If one is empty string and the other is nullish, consider them equal
    if ((aIsEmpty && bIsNullish) || (aIsNullish && bIsEmpty)) {
        return false;
    }

    // If one is nullish but the other isn't, they are different
    if (aIsNullish || bIsNullish) {
        return true;
    }

    // Handle string comparison with trimming
    if (typeof a === "string" && typeof b === "string") {
        return a.trim() !== b.trim();
    }

    // Handle number comparison (including NaN check)
    if (typeof a === "number" && typeof b === "number") {
        // Special handling for NaN
        if (Number.isNaN(a) && Number.isNaN(b)) {
            return false; // Both are NaN, consider them equal
        }
        return a !== b;
    }

    // For objects, arrays, etc., use standard equality check
    return a !== b;
}

/**
 * Checks if a text variable's temporary value is different from the original
 */
export function isTextVariableDifferent(
    original: TemplateTextVariable,
    temporary: Partial<UptemplateDateTextVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) {
        return true;
    }
    if (isDifferent(temporary.description, original.description)) {
        return true;
    }
    if (isDifferent(temporary.required, original.required)) {
        return true;
    }
    if (isDifferent(temporary.previewValue, original.textPreviewValue)) {
        return true;
    }
    if (isDifferent(temporary.minLength, original.minLength)) {
        return true;
    }
    if (isDifferent(temporary.maxLength, original.maxLength)) {
        return true;
    }
    if (isDifferent(temporary.pattern, original.pattern)) {
        return true;
    }

    return false;
}

/**
 * Checks if a number variable's temporary value is different from the original
 */
export function isNumberVariableDifferent(
    original: TemplateNumberVariable,
    temporary: Partial<UpdateTemplateNumberVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.previewValue, original.numberPreviewValue))
        return true;
    if (isDifferent(temporary.minValue, original.minValue)) return true;
    if (isDifferent(temporary.maxValue, original.maxValue)) return true;
    if (isDifferent(temporary.decimalPlaces, original.decimalPlaces))
        return true;

    return false;
}

/**
 * Checks if a date variable's temporary value is different from the original
 */
export function isDateVariableDifferent(
    original: TemplateDateVariable,
    temporary: Partial<UptemplateDateDateVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.previewValue, original.datePreviewValue))
        return true;
    if (isDifferent(temporary.minDate, original.minDate)) return true;
    if (isDifferent(temporary.maxDate, original.maxDate)) return true;
    if (isDifferent(temporary.format, original.format)) return true;

    return false;
}

/**
 * Checks if a select variable's temporary value is different from the original
 */
export function isSelectVariableDifferent(
    original: TemplateSelectVariable,
    temporary: Partial<UpdateTemplateSelectVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.previewValue, original.selectPreviewValue))
        return true;
    if (isDifferent(temporary.multiple, original.multiple)) return true;

    // Special handling for options since it's an array
    if (
        temporary.options !== undefined &&
        JSON.stringify(temporary.options) !== JSON.stringify(original.options)
    )
        return true;

    return false;
}

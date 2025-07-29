import type {
    TemplateTextVariable,
    TemplateNumberVariable,
    TemplateDateVariable,
    TemplateSelectVariable,
    UpdateTextTemplateVariableInput,
    UpdateNumberTemplateVariableInput,
    UpdateDateTemplateVariableInput,
    UpdateSelectTemplateVariableInput,
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
    temporary: Partial<UpdateTextTemplateVariableInput>,
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
    if (isDifferent(temporary.preview_value, original.preview_value)) {
        return true;
    }
    if (isDifferent(temporary.min_length, original.min_length)) {
        return true;
    }
    if (isDifferent(temporary.max_length, original.max_length)) {
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
    temporary: Partial<UpdateNumberTemplateVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.preview_value, original.preview_value))
        return true;
    if (isDifferent(temporary.min_value, original.min_value)) return true;
    if (isDifferent(temporary.max_value, original.max_value)) return true;
    if (isDifferent(temporary.decimal_places, original.decimal_places))
        return true;

    return false;
}

/**
 * Checks if a date variable's temporary value is different from the original
 */
export function isDateVariableDifferent(
    original: TemplateDateVariable,
    temporary: Partial<UpdateDateTemplateVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.preview_value, original.preview_value))
        return true;
    if (isDifferent(temporary.min_date, original.min_date)) return true;
    if (isDifferent(temporary.max_date, original.max_date)) return true;
    if (isDifferent(temporary.format, original.format)) return true;

    return false;
}

/**
 * Checks if a select variable's temporary value is different from the original
 */
export function isSelectVariableDifferent(
    original: TemplateSelectVariable,
    temporary: Partial<UpdateSelectTemplateVariableInput>,
): boolean {
    if (isDifferent(temporary.name, original.name)) return true;
    if (isDifferent(temporary.description, original.description)) return true;
    if (isDifferent(temporary.required, original.required)) return true;
    if (isDifferent(temporary.preview_value, original.preview_value))
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

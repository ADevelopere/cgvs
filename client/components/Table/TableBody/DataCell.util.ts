// Helper functions (getCellValue, formatCellValue, formatInputValue) remain the same

import { CountryTranslations } from "@/client/locale";
import { EditableColumn } from "@/types/table.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCellValue = (column: EditableColumn, rowData: any) => {
    if (typeof column.accessor === "function") {
        return column.accessor(rowData);
    }
    return rowData[column.accessor];
};

/**
 * Retrieves the country name by its code.
 * @param {CountryTranslations} strings - The language strings for countries.
 * @param {string} code - The country code.
 * @returns {string} The country name.
 */
export function countryNameByCode(
    strings: CountryTranslations,
    code: string,
): string {
    return strings[code] || code;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) {
        return "";
    }
    switch (type) {
        case "date":
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString();
                }
            } catch {
                throw new Error("Invalid date:", value);
            }
            return value;
        case "text":
        default:
            return value.toString();
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatInputValue = (value: any, type: string) => {
    if (value === null || value === undefined) {
        return "";
    }
    switch (type) {
        case "date":
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split("T")[0];
                }
            } catch {
                throw new Error("Invalid date:", value);
            }
            return value;
        case "text":
        default:
            return value.toString();
    }
};

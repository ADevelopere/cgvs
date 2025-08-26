"use client";

import React from "react";
import {
    TextField,
    Tooltip,
    MenuItem,
    Box,
    Autocomplete,
    FilledTextFieldProps,
    OutlinedTextFieldProps,
    StandardTextFieldProps,
} from "@mui/material";
// Ensure these are the actual exported React.Context objects
import { EditableColumn } from "@/types/table.type";
import countries, { CountryType } from "@/utils/country";
import CountryTranslations from "@/locale/components/Country";
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";
// import { useTableStyles } from "@/styles"; // Cannot use hooks in class components
// inputStyle will be expected as a prop
import Image from "next/image";
import { DataCellState } from "./NewDataCell";

const preferredCountries: MuiTelInputCountry[] = [
    "SA",
    "PS",
    "YE",
    "SY",
    "EG",
    "KW",
    "QA",
    "OM",
    "BH",
    "LB",
    "JO",
    "IQ",
    "LY",
    "AE",
    "TN",
    "DZ",
    "MA",
    "SD",
    "MR",
    "SO",
    "ID",
    "KM",
    "DJ",
    "ER",
    "SS",
    "EH",
];

// Helper functions (getCellValue, formatCellValue, formatInputValue) remain the same
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCellValue = (column: EditableColumn, rowData: any) => {
    if (typeof column.accessor === "function") {
        return column.accessor(rowData);
    }
    return rowData[column.accessor];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatCellValue = (value: any, type: string) => {
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
const formatInputValue = (value: any, type: string) => {
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

/**
 * Retrieves the country name by its code.
 * @param {CountryTranslations} strings - The language strings for countries.
 * @param {string} code - The country code.
 * @returns {string} The country name.
 */
function countryNameByCode(strings: CountryTranslations, code: string): string {
    return strings[code] || code;
}

type CellContentRendererProps = {
    column: EditableColumn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    countryStrings: CountryTranslations; // Add this line
    state: React.RefObject<DataCellState>;
    commonProps:
        | FilledTextFieldProps
        | OutlinedTextFieldProps
        | StandardTextFieldProps;
    validateValue: (value: unknown) => string | null;
    handleUpdate: () => void;
    handleInputKeyDown: (e: React.KeyboardEvent) => void;

    value: unknown;
    isEditing: boolean;
    errorMessage: string | null;
};
const CellContentRenderer: React.FC<CellContentRendererProps> = ({
    column,
    rowData,
    countryStrings,
    state,
    commonProps,
    validateValue,
    handleUpdate,
    handleInputKeyDown,

    value,
    isEditing,
    errorMessage,
}) => {
    const cellValue = getCellValue(column, rowData);

    if (!isEditing) {
        if (column.type === "select" && column.options) {
            const option = column.options.find(
                (opt) => opt.value === cellValue,
            );
            return <span>{option?.label ?? cellValue}</span>;
        }

        if (column.type === "country") {
            const country = cellValue
                ? countries.find((c) => c.code === cellValue)
                : null;
            if (country) {
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Image
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            alt=""
                            width={20}
                            height={15}
                            style={{ objectFit: "cover" }}
                            loading="lazy"
                        />
                        {countryStrings[country.code]}
                    </Box>
                );
            }
            return String(cellValue ?? "");
        }

        return (
            <span
                style={{
                    direction: column.type === "phone" ? "ltr" : "inherit",
                }}
            >
                {formatCellValue(cellValue, column.type)}
            </span>
        );
    }

    // Handle select type
    if (column.type === "select" && column.options) {
        return (
            <TextField
                {...commonProps}
                select
                value={value ?? ""}
                slotProps={{
                    select: {
                        open: isEditing,
                        onClose: () =>
                            (state.current = {
                                ...state.current,
                                isEditing: false,
                            }),
                    },
                }}
            >
                {column.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    if (column.type === "country") {
        return (
            <Autocomplete
                fullWidth
                options={countries}
                autoHighlight
                value={countries.find((c) => c.code === value) || countries[0]}
                onChange={(_, newValue) => {
                    if (newValue) {
                        const validationError = validateValue(newValue.code);
                        state.current = {
                            localTmpValue: newValue.code,
                            localErrorMessage: validationError,
                            isEditing: false,
                        };
                        handleUpdate();
                    }
                }}
                onBlur={handleUpdate}
                getOptionLabel={(option) =>
                    countryNameByCode(countryStrings, option.code)
                }
                renderOption={(
                    props: React.HTMLAttributes<HTMLLIElement> & {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        key: any;
                    },
                    option: CountryType,
                ) => {
                    // key is extracted from props to prevent it from being passed to the DOM
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={option.code}
                            component="li"
                            sx={{ "& > img": { mr: 0, flexShrink: 0 } }}
                            {...optionProps}
                        >
                            <Image
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                alt=""
                                width={20}
                                height={15}
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                            />
                            {countryNameByCode(countryStrings, option.code)}
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...commonProps}
                        {...params}
                        onBlur={handleUpdate}
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                            },
                        }}
                    />
                )}
            />
        );
    }

    if (column.type === "phone") {
        return (
            <MuiTelInput
                {...commonProps}
                value={(value as string) ?? ""}
                //     onChange?: (value: string, info: MuiTelInputInfo) => void;
                onChange={(value: string) => {
                    const validationError = validateValue(value);
                    state.current = {
                        ...state.current,
                        localTmpValue: value,
                        localErrorMessage: validationError,
                    };
                }}
                onBlur={handleUpdate}
                onKeyDown={handleInputKeyDown}
                langOfCountryName={"ar"}
                defaultCountry={"EG"}
                focusOnSelectCountry={true}
                excludedCountries={["IL"]}
                preferredCountries={preferredCountries}
                fullWidth
                error={errorMessage !== null}
                helperText={errorMessage}
            />
        );
    }

    const inputValue =
        column.type === "date"
            ? formatInputValue(value, column.type)
            : (value ?? "");

    const inputElement = (
        <TextField
            {...commonProps}
            type={column.type === "date" ? "date" : "text"}
            value={inputValue}
        />
    );

    return (
        <Tooltip
            open={!!errorMessage}
            title={errorMessage ?? ""}
            arrow
            placement="bottom-start"
        >
            {inputElement}
        </Tooltip>
    );
};

export default CellContentRenderer;
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
import countries, { CountryType, preferredCountries } from "@/utils/country";
import CountryTranslations from "@/locale/components/Country";
import { MuiTelInput } from "mui-tel-input";
// import { useTableStyles } from "@/styles"; // Cannot use hooks in class components
// inputStyle will be expected as a prop
import Image from "next/image";
import { DataCellState } from "./NewDataCell";
import {
    countryNameByCode,
    formatCellValue,
    formatInputValue,
} from "./DataCell.util";

// Helper functions (getCellValue, formatCellValue, formatInputValue) remain the same
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCellValue = (column: EditableColumn, rowData: any) => {
    if (typeof column.accessor === "function") {
        return column.accessor(rowData);
    }
    return rowData[column.accessor];
};

type CellContentRendererProps = {
    column: EditableColumn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    countryStrings: CountryTranslations; // Add this line
    state: DataCellState;
    setState: React.Dispatch<React.SetStateAction<DataCellState>>;
    // Use union type for commonProps
    commonProps:
        | FilledTextFieldProps
        | OutlinedTextFieldProps
        | StandardTextFieldProps;
    validateValue: (value: unknown) => string | null;
    handleInputKeyDown: (e: React.KeyboardEvent) => void;
    handleBlur: () => void;
};

const CellContentRenderer = React.forwardRef<
    HTMLInputElement,
    CellContentRendererProps
>(
    (
        {
            column,
            rowData,
            countryStrings,
            state,
            setState,
            commonProps,
            validateValue,
            handleInputKeyDown,
            handleBlur,
        },
        ref,
    ) => {
        const cellValue = getCellValue(column, rowData);

        if (!state.isEditing) {
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
                    inputRef={ref}
                    select
                    value={state.localTmpValue ?? ""}
                    slotProps={{
                        select: {
                            open: state.isEditing,
                            onClose: () =>
                                setState((prev) => ({
                                    ...prev,
                                    isEditing: false,
                                })),
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
                    value={
                        countries.find((c) => c.code === state.localTmpValue) ||
                        countries[0]
                    }
                    onChange={(_, newValue) => {
                        if (newValue) {
                            const validationError = validateValue(
                                newValue.code,
                            );
                            setState({
                                localTmpValue: newValue.code,
                                localErrorMessage: validationError,
                                isEditing: false,
                            });
                        }
                    }}
                    onBlur={handleBlur}
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
                            inputRef={ref}
                            {...params}
                            onBlur={handleBlur}
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
                    inputRef={ref}
                    value={(state.localTmpValue as string) ?? ""}
                    //     onChange?: (value: string, info: MuiTelInputInfo) => void;
                    onChange={(value: string) => {
                        const validationError = validateValue(value);
                        setState((prev) => ({
                            ...prev,
                            localTmpValue: value,
                            localErrorMessage: validationError,
                        }));
                    }}
                    onBlur={handleBlur}
                    onKeyDown={handleInputKeyDown}
                    langOfCountryName={"ar"}
                    defaultCountry={"EG"}
                    focusOnSelectCountry={true}
                    excludedCountries={["IL"]}
                    preferredCountries={preferredCountries}
                    fullWidth
                    error={state.localErrorMessage !== null}
                    helperText={state.localErrorMessage}
                />
            );
        }

        const inputValue =
            column.type === "date"
                ? formatInputValue(state.localTmpValue, column.type)
                : (state.localTmpValue ?? "");

        const inputElement = (
            <TextField
                {...commonProps}
                inputRef={ref}
                type={column.type === "date" ? "date" : "text"}
                value={inputValue}
            />
        );

        return (
            <Tooltip
                open={!!state.localErrorMessage}
                title={state.localErrorMessage ?? ""}
                arrow
                placement="bottom-start"
            >
                {inputElement}
            </Tooltip>
        );
    },
);

CellContentRenderer.displayName = "CellContentRenderer";

export default CellContentRenderer;

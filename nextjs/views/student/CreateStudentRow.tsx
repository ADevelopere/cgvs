"use client";

import React, { useState, useMemo } from "react";
import { Button, TextField, Box, Autocomplete, MenuItem, Tooltip } from "@mui/material";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import { useStudentTableManagement } from "@/contexts/student/StudentTableManagementContext";
import { useTableColumnContext } from "@/components/Table/Table/TableColumnContext";
import { useTableContext } from "@/components/Table/Table/TableContext";
import { useTableRowsContext } from "@/components/Table/Table/TableRowsContext";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "@/constants/tableConstants";
import { CountryCode, CreateStudentInput, Gender } from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";
import countries, { CountryType } from "@/utils/country";
import Image from "next/image";

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

const CreateStudentRow = () => {
    const { createStudent } = useStudentManagement();
    const { columns } = useStudentTableManagement();
    const strings = useAppTranslation("studentTranslations");
    const countryStrings = useAppTranslation("countryTranslations");

    const [newStudent, setNewStudent] = useState<CreateStudentInput>({
        name: "",
        email: "",
        dateOfBirth: null,
        gender: undefined,
    });

    const [phoneNumberState, setPhoneNumberState] = useState<{
        value: string;
        error: string | null | undefined;
    }>({
        value: "",
        error: null,
    });

    const [nationalityState, setNationalityState] = useState<{
        value: CountryCode;
        error: string | null | undefined;
    }>({
        value: "EG",
        error: null,
    });

    const [genderState, setGenderState] = useState<{
        value: string | undefined;
        open: boolean;
        error: string | null | undefined;
    }>({
        value: undefined,
        open: false,
        error: null,
    });

    const { visibleColumns, columnWidths } = useTableColumnContext();
    const { rowSelectionEnabled } = useTableRowsContext();
    const { paginationInfo, data } = useTableContext();

    const maxIndexValue = useMemo(() => {
        return paginationInfo ? paginationInfo.total : data.length;
    }, [paginationInfo, data.length]);

    const indexColWidth = useMemo(() => {
        const maxDigits = maxIndexValue.toString().length;
        return Math.max(50, maxDigits * 15 + 20);
    }, [maxIndexValue]);

    const totalWidth = useMemo(() => {
        const columnsWidth = visibleColumns.reduce(
            (sum, column) => sum + (columnWidths[column.id] || 0),
            0,
        );
        return (
            columnsWidth +
            indexColWidth +
            (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0)
        );
    }, [visibleColumns, columnWidths, rowSelectionEnabled, indexColWidth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = () => {
        createStudent({
            input: newStudent,
        });
    };

    const getColumnWidth = (id: string) => {
        const column = visibleColumns.find((c) => c.id === id);
        return column ? columnWidths[column.id] : 0;
    };

    const editableColumns = columns.filter((c) => c.editable);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                gap: "1px",
                width: totalWidth,
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <Box
                sx={{
                    width: rowSelectionEnabled
                        ? TABLE_CHECKBOX_CONTAINER_SIZE
                        : 0,
                    flexShrink: 0,
                }}
            />
            <Box sx={{ width: indexColWidth, flexShrink: 0 }} />
            {editableColumns.map((col) => (
                <Box
                    key={col.id}
                    sx={{ width: getColumnWidth(col.id), pr: 1, flexShrink: 0 }}
                >
                    {col.type === "text" && col.id === "name" && (
                        <Tooltip
                            open={col.getIsValid?.(newStudent.name) !== null}
                            title={col.getIsValid?.(newStudent.name) || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <TextField
                                name={col.id}
                                value={newStudent.name}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                error={col.getIsValid?.(newStudent.name) !== null}
                            />
                        </Tooltip>
                    )}
                    {col.type === "text" && col.id === "email" && (
                        <Tooltip
                            open={col.getIsValid?.(newStudent.email) !== null}
                            title={col.getIsValid?.(newStudent.email) || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <TextField
                                name={col.id}
                                value={newStudent.email || ""}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                error={col.getIsValid?.(newStudent.email) !== null}
                            />
                        </Tooltip>
                    )}
                    {col.type === "date" && (
                        <Tooltip
                            open={col.getIsValid?.(newStudent.dateOfBirth) !== null}
                            title={col.getIsValid?.(newStudent.dateOfBirth) || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <TextField
                                name={col.id}
                                type="date"
                                value={newStudent.dateOfBirth || ""}
                                onChange={handleInputChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                                error={col.getIsValid?.(newStudent.dateOfBirth) !== null}
                            />
                        </Tooltip>
                    )}
                    {col.type === "select" && col.id === "gender" && (
                        <Tooltip
                            open={genderState.error !== null}
                            title={genderState.error || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <TextField
                                select
                                name={col.id}
                                value={genderState.value ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const validationError = col.getIsValid?.(value) ?? null;
                                    setGenderState({
                                        value: value,
                                        open: false,
                                        error: validationError,
                                    });
                                    setNewStudent((prev) => ({ ...prev, gender: value as Gender }));
                                }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                error={genderState.error !== null}
                                slotProps={{
                                    select: {
                                        open: genderState.open,
                                        onClose: () =>
                                            setGenderState((prev) => ({
                                                ...prev,
                                                open: false,
                                            })),
                                    },
                                }}
                            >
                                {col.options?.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Tooltip>
                    )}
                    {col.type === "country" && (
                        <Tooltip
                            open={nationalityState.error !== null}
                            title={nationalityState.error || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <Autocomplete
                                fullWidth
                                options={countries}
                                autoHighlight
                                value={
                                    countries.find(
                                        (c) => c.code === nationalityState.value,
                                    ) || countries[0]
                                }
                                onChange={(_, newValue) => {
                                    if (newValue) {
                                        const validationError = col.getIsValid?.(newValue.code) ?? null;
                                        setNationalityState({
                                            value: newValue.code,
                                            error: validationError,
                                        });
                                        setNewStudent((prev) => ({ ...prev, nationality: newValue.code }));
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    countryStrings[option.code] || option.code
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
                                            sx={{
                                                "& > img": { mr: 0, flexShrink: 0 },
                                            }}
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
                                            {countryStrings[option.code] || option.code}
                                        </Box>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        size="small"
                                        error={nationalityState.error !== null}
                                    />
                                )}
                            />
                        </Tooltip>
                    )}
                    {col.type === "phone" && (
                        <Tooltip
                            open={phoneNumberState.error !== null}
                            title={phoneNumberState.error || ""}
                            arrow
                            placement="bottom-start"
                        >
                            <MuiTelInput
                                value={phoneNumberState.value}
                                onChange={(value: string) => {
                                    const validationError = col.getIsValid?.(value) ?? null;
                                    setPhoneNumberState({
                                        value: value,
                                        error: validationError,
                                    });
                                    setNewStudent((prev) => ({ ...prev, phoneNumber: value }));
                                }}
                                langOfCountryName={"ar"}
                                defaultCountry={"EG"}
                                focusOnSelectCountry={true}
                                excludedCountries={["IL"]}
                                preferredCountries={preferredCountries}
                                fullWidth
                                error={phoneNumberState.error !== null}
                            />
                        </Tooltip>
                    )}
                </Box>
            ))}
            <Button onClick={handleCreate}>{strings.actions}</Button>
        </Box>
    );
};

export default CreateStudentRow;

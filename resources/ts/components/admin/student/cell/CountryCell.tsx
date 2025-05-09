"use client";

import type React from "react";
import { Box } from "@mui/material";
import CountrySelect from "@/components/input/CountrySelect";
import countries from "@/utils/country";
import { CellProps } from "../types";

const CountryCell: React.FC<
    CellProps & { countryStrings: Record<string, string> }
> = ({ value, onEdit, onSave, isEditing, countryStrings, editable }) => {
    if (isEditing) {
        return (
            <CountrySelect
                country={
                    countries.find((c) => c.code === value) || countries[0]
                }
                setCountry={(country) => onEdit(country.code)}
                onBlur={onSave}
                fullWidth
            />
        );
    }

    const country = value ? countries.find((c) => c.code === value) : null;
    if (country) {
        return (
            <Box
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={() => editable && onEdit(value)}
            >
                <img
                    loading="lazy"
                    width="20"
                    height="15"
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt=""
                />
                {countryStrings[country.code]}
            </Box>
        );
    }
    return String(value || "");
};

export default CountryCell;

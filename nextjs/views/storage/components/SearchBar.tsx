"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
} from "@mui/material";
import {
    Search as SearchIcon,
    Clear as ClearIcon,
} from "@mui/icons-material";
import useAppTranslation from "@/locale/useAppTranslation";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder,
    debounceMs = 300,
}) => {
    const [localValue, setLocalValue] = useState(value);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const translations = useAppTranslation("storageTranslations");

    // Debounced callback to trigger the actual search
    const debouncedSearch = useCallback(
        (searchTerm: string) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                onChange(searchTerm);
                timeoutRef.current = null;
            }, debounceMs);
        },
        [onChange, debounceMs],
    );

    // Update local value when external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            setLocalValue(newValue);
            debouncedSearch(newValue);
        },
        [debouncedSearch],
    );

    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange("");
    }, [onChange]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                // Trigger immediate search on Enter
                onChange(localValue);
            } else if (event.key === "Escape") {
                handleClear();
            }
        },
        [localValue, onChange, handleClear],
    );

    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                fullWidth
                size="small"
                value={localValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || translations.search}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: localValue && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    edge="end"
                                    aria-label={translations.clearSearch}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;

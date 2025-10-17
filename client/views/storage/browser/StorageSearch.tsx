"use client";
import React, { useState, useEffect } from "react";
import { useStorageUIStore } from "@/client/views/storage/stores/useStorageUIStore";
import { useStorageDataOperations } from "@/client/views/storage/hooks/useStorageDataOperations";
import { useAppTranslation } from "@/client/locale";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HistoryIcon from "@mui/icons-material/History";

const STORAGE_SEARCH_HISTORY_KEY = "storage-search-history";

const StorageSearch: React.FC = () => {
    const { searchMode, setSearchMode, setSearchResults, clearSelection, setLastSelectedItem } = useStorageUIStore();
    const { search: searchOperation } = useStorageDataOperations();
    
    const search = async (term: string) => {
        const result = await searchOperation(term, "");
        if (result) {
            setSearchResults(result.items);
            setSearchMode(true);
            clearSelection();
            setLastSelectedItem(null);
        }
    };
    
    const exitSearchMode = () => {
        setSearchMode(false);
        setSearchResults([]);
        clearSelection();
        setLastSelectedItem(null);
    };
    const { ui: translations } = useAppTranslation("storageTranslations");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(
                STORAGE_SEARCH_HISTORY_KEY,
            );
            if (storedHistory) {
                setSearchHistory(JSON.parse(storedHistory));
            }
        } catch {}
    }, []);

    const updateSearchHistory = React.useCallback(
        (query: string) => {
            const newHistory = [
                query,
                ...searchHistory.filter((item) => item !== query),
            ].slice(0, 10);
            setSearchHistory(newHistory);
            try {
                localStorage.setItem(
                    STORAGE_SEARCH_HISTORY_KEY,
                    JSON.stringify(newHistory),
                );
            } catch {}
        },
        [searchHistory],
    );

    const handleSearch = React.useCallback(
        (query: string) => {
            if (query.trim()) {
                search(query);
                updateSearchHistory(query);
            }
        },
        [search, updateSearchHistory],
    );

    const handleClearSearch = React.useCallback(() => {
        setSearchQuery("");
        exitSearchMode();
    }, [exitSearchMode]);

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
                handleSearch(searchQuery);
            }
        },
        [handleSearch, searchQuery],
    );

    return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Autocomplete
                freeSolo
                fullWidth
                options={searchHistory}
                value={searchQuery}
                onInputChange={(_event, newValue) => setSearchQuery(newValue)}
                onChange={(_event, newValue) => {
                    if (newValue) {
                        handleSearch(newValue);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={translations.searchPlaceholder}
                        variant="outlined"
                        size="small"
                        onKeyDown={handleKeyDown}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {searchMode && (
                                            <IconButton
                                                onClick={handleClearSearch}
                                                size="small"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    // The key is being passed in props, but needs to be passed directly to the element.
                    // See https://react.dev/learn/rendering-lists#why-does-react-need-keys
                    const { key, ...otherProps } = props;
                    return (
                        <li key={key} {...otherProps}>
                            <HistoryIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">{option}</Typography>
                        </li>
                    );
                }}
            />
        </Box>
    );
};

export default StorageSearch;

"use client";
import React, { useState, useEffect } from "react";
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
import { StorageItemUnion } from "@/client/views/storage/core/storage.type";

const STORAGE_SEARCH_HISTORY_KEY = "storage-search-history";

interface StorageSearchProps {
  searchMode: boolean;
  setSearchMode: (mode: boolean) => void;
  searchResults: StorageItemUnion[];
  searchLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSelection: () => void;
  setLastSelectedItem: (item: string | null) => void;
}

const StorageSearch: React.FC<StorageSearchProps> = ({
  searchMode,
  setSearchMode,
  // searchResults, // TODO: Display search results
  // searchLoading, // TODO: Show loading state
  searchTerm,
  setSearchTerm,
  clearSelection,
  setLastSelectedItem,
}) => {
  const search = React.useCallback(
    (term: string) => {
      setSearchTerm(term);
      setSearchMode(true);
      clearSelection();
      setLastSelectedItem(null);
    },
    [clearSelection, setLastSelectedItem, setSearchMode, setSearchTerm]
  );

  const exitSearchMode = React.useCallback(() => {
    setSearchMode(false);
    setSearchTerm("");
    clearSelection();
    setLastSelectedItem(null);
  }, [clearSelection, setLastSelectedItem, setSearchMode, setSearchTerm]);

  const {
    storageTranslations: { ui: translations },
  } = useAppTranslation();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_SEARCH_HISTORY_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch {
      // Ignore errors accessing localStorage
    }
  }, []);

  const updateSearchHistory = React.useCallback(
    (query: string) => {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      try {
        localStorage.setItem(STORAGE_SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch {
        // Ignore errors accessing localStorage
      }
    },
    [searchHistory]
  );

  const handleSearch = React.useCallback(
    (query: string) => {
      if (query.trim()) {
        search(query);
        updateSearchHistory(query);
      }
    },
    [search, updateSearchHistory]
  );

  const handleClearSearch = React.useCallback(() => {
    setSearchTerm("");
    exitSearchMode();
  }, [exitSearchMode, setSearchTerm]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearch(searchTerm);
      }
    },
    [handleSearch, searchTerm]
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Autocomplete
        freeSolo
        fullWidth
        options={searchHistory}
        value={searchTerm}
        onInputChange={(_event, newValue) => setSearchTerm(newValue)}
        onChange={(_event, newValue) => {
          if (newValue) {
            handleSearch(newValue);
          }
        }}
        renderInput={params => (
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
                      <IconButton onClick={handleClearSearch} size="small">
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
              <HistoryIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2">{option}</Typography>
            </li>
          );
        }}
      />
    </Box>
  );
};

export default StorageSearch;

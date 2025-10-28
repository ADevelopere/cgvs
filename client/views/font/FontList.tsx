import React, { useState, useMemo, useRef } from "react";
import * as MUI from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Description as FontIcon,
} from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import { fontsQueryDocument } from "./hooks/font.documents";
import { LOCALE_OPTIONS } from "./types";
import { useDebounce } from "@/client/hooks/useDebounce";
import { useAppTranslation } from "@/client/locale";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

type FontListProps = {
  selectedFont: Graphql.Font | null;
  queryParams: Graphql.FontsQueryVariables;
  setQueryParams: (params: Graphql.FontsQueryVariables) => void;
  startCreating: () => void;
  selectFont: (font: Graphql.Font) => void;
};

export const FontList: React.FC<FontListProps> = ({
  selectedFont,
  queryParams,
  setQueryParams,
  startCreating,
  selectFont,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");

  // Local state for immediate input feedback
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Debounce search term
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  const setQueryParamsRef = useRef(setQueryParams);
  setQueryParamsRef.current = setQueryParams;

  // Update store when debounced value changes
  React.useEffect(() => {
    setQueryParamsRef.current({
      filterArgs: debouncedSearchTerm
        ? { name: debouncedSearchTerm }
        : undefined,
    });
  }, [debouncedSearchTerm]);

  // Query fonts with variables from store
  const { data, loading, error } = useQuery(fontsQueryDocument, {
    variables: queryParams,
  });

  // Derive fonts from query data
  const fonts = useMemo(() => {
    return data?.fonts?.data || [];
  }, [data]);

  const getLocaleLabel = (localeCode: string) => {
    const option = LOCALE_OPTIONS.find(opt => opt.value === localeCode);
    return option?.flag || localeCode;
  };

  return (
    <MUI.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <MUI.Box sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}>
        <MUI.Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <MUI.Typography variant="h6">{strings.fonts}</MUI.Typography>
          <MUI.Button
            size="small"
            variant="contained"
            onClick={startCreating}
            startIcon={<AddIcon />}
          >
            {strings.newFont}
          </MUI.Button>
        </MUI.Box>

        {/* Search */}
        <MUI.TextField
          fullWidth
          size="small"
          placeholder={strings.searchPlaceholder}
          value={localSearchTerm}
          onChange={e => setLocalSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <MUI.InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </MUI.InputAdornment>
            ),
          }}
        />
      </MUI.Box>

      {/* Font List */}
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {error ? (
          // Error state
          <MUI.Alert severity="error" sx={{ m: 2 }}>
            {strings.errorLoadingFonts.replace("%{error}", error.message)}
          </MUI.Alert>
        ) : loading ? (
          // Loading skeleton
          <>
            {[...Array(5)].map((_, i) => (
              <MUI.Card key={i} sx={{ p: 2, mb: 1 }}>
                <MUI.Skeleton variant="text" width="75%" height={24} />
                <MUI.Skeleton variant="text" width="50%" height={20} />
              </MUI.Card>
            ))}
          </>
        ) : fonts.length === 0 ? (
          // Empty state
          <MUI.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              px: 2,
              textAlign: "center",
            }}
          >
            <FontIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <MUI.Typography variant="body2" color="text.secondary" gutterBottom>
              {queryParams.filterArgs?.name
                ? strings.noFontsFound
                : strings.noFontsYet}
            </MUI.Typography>
            <MUI.Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {queryParams.filterArgs?.name
                ? strings.tryDifferentSearch
                : strings.createFirstFont}
            </MUI.Typography>
            {!queryParams.filterArgs?.name && (
              <MUI.Button
                size="small"
                variant="outlined"
                onClick={startCreating}
                startIcon={<AddIcon />}
              >
                {strings.createFont}
              </MUI.Button>
            )}
          </MUI.Box>
        ) : (
          // Font items
          fonts.map(font => (
            <MUI.Card
              key={font.id!}
              onClick={() => selectFont(font)}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor:
                  selectedFont?.id === font.id
                    ? "action.selected"
                    : "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <MUI.Typography variant="body2" fontWeight="medium" gutterBottom>
                {font.name!}
              </MUI.Typography>
              <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {font.locale!.map(locale => (
                  <MUI.Chip
                    key={locale}
                    label={getLocaleLabel(locale!)}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </MUI.Box>
            </MUI.Card>
          ))
        )}
      </MUI.Box>

      {/* Footer */}
      <MUI.Box
        sx={{
          borderTop: 1,
          borderColor: "divider",
          p: 1.5,
          textAlign: "center",
        }}
      >
        <MUI.Typography variant="caption" color="text.secondary">
          {fonts.length} {fonts.length === 1 ? strings.font : strings.fonts}
        </MUI.Typography>
      </MUI.Box>
    </MUI.Box>
  );
};

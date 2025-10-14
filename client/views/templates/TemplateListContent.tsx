"use client";

import React, { useCallback, useMemo } from "react";
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import CardView from "./views/CardView";
import ListView from "./views/ListView";
import GridView from "./views/GridView";
import { useAppTranslation } from "@/client/locale";
import { useTemplatesList } from "./TemplatesContext";
import { useQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/sharedDocuments";
import EmptyStateIllustration from "@/client/components/common/EmptyStateIllustration";

type TemplateListProps = {
  style?: React.CSSProperties;
};

const TemplateListContent: React.FC<TemplateListProps> = ({ style }) => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const {
    currentCategoryId,
    templateQueryVariables,
    updateTemplateQueryVariables,
    viewMode,
    setViewMode,
  } = useTemplatesList();

  // Fetch templates with current query variables
  const { data, loading } = useQuery(
    Document.templatesByCategoryIdQueryDocument,
    {
      variables: {
        categoryId: currentCategoryId ?? undefined,
        paginationArgs: templateQueryVariables.paginationArgs,
        filterArgs: templateQueryVariables.filterArgs,
        orderBy: templateQueryVariables.orderBy,
      },
      fetchPolicy: "cache-first",
    },
  );

  const templates = useMemo(
    () => data?.templatesByCategoryId?.data ?? [],
    [data?.templatesByCategoryId?.data],
  );

  const pageInfo = useMemo(
    () => data?.templatesByCategoryId?.pageInfo,
    [data?.templatesByCategoryId?.pageInfo],
  );

  // Search query from filter args
  const searchQuery = useMemo(
    () => templateQueryVariables.filterArgs?.name ?? "",
    [templateQueryVariables.filterArgs?.name],
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.target.value;
      updateTemplateQueryVariables((current) => ({
        ...current,
        filterArgs: {
          ...current.filterArgs,
          name: searchValue || undefined,
        },
        paginationArgs: {
          ...current.paginationArgs,
          page: 1, // Reset to first page on search
        },
      }));
    },
    [updateTemplateQueryVariables],
  );

  const handleViewChange = useCallback(
    (
      _: React.MouseEvent<HTMLElement>,
      newView: "card" | "grid" | "list" | null,
    ): void => {
      if (newView !== null) {
        setViewMode(newView);
      }
    },
    [setViewMode],
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      updateTemplateQueryVariables((current) => ({
        ...current,
        paginationArgs: {
          ...current.paginationArgs,
          page,
        },
      }));
    },
    [updateTemplateQueryVariables],
  );

  const handlePageSizeChange = useCallback(
    (event: SelectChangeEvent<number>) => {
      const pageSize = event.target.value as number;
      updateTemplateQueryVariables((current) => ({
        ...current,
        paginationArgs: {
          first: pageSize,
          page: 1, // Reset to page 1 on page size change
        },
      }));
    },
    [updateTemplateQueryVariables],
  );

  const getEmptyMessage = React.useCallback(() => {
    if (searchQuery) {
      return strings.noTemplatesFoundSearch;
    }
    if (currentCategoryId === null) {
      return strings.noTemplatesFoundCreate;
    }
    return strings.noTemplates;
  }, [
    currentCategoryId,
    searchQuery,
    strings.noTemplates,
    strings.noTemplatesFoundCreate,
    strings.noTemplatesFoundSearch,
  ]);

  const renderTemplateView = useMemo(() => {
    if (templates?.length === 0 && !loading) {
      return <EmptyStateIllustration message={getEmptyMessage()} />;
    }

    switch (viewMode) {
      case "list":
        return <ListView templates={templates} />;
      case "grid":
        return <GridView templates={templates} />;
      default:
        return <CardView templates={templates} />;
    }
  }, [templates, loading, viewMode, getEmptyMessage]);

  return (
    <Box
      sx={{
        ...style,
        bgcolor: "background.default",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6">
          {currentCategoryId !== null
            ? strings.templates
            : strings.allTemplates}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <TextField
            placeholder={strings.searchTemplatesPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            sx={{ alignSelf: { xs: "center", sm: "auto" } }}
          >
            <ToggleButton value="card">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Loading progress bar */}
      {loading && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Template view */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>{renderTemplateView}</Box>

      {/* Pagination controls */}
      {pageInfo && pageInfo.total > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap",
          }}
        >
          {/* Pagination info */}
          <Typography variant="body2" color="text.secondary">
            {strings.showing} {pageInfo.firstItem ?? 0}-{pageInfo.lastItem ?? 0}{" "}
            {strings.of} {pageInfo.total}
          </Typography>

          {/* Page size selector */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="page-size-label">{strings.perPage}</InputLabel>
            <Select
              labelId="page-size-label"
              value={
                templateQueryVariables.paginationArgs?.first ?? pageInfo.perPage
              }
              label={strings.perPage}
              onChange={handlePageSizeChange}
              disabled={loading}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          {/* Pagination component */}
          {pageInfo.lastPage > 1 && (
            <Pagination
              count={pageInfo.lastPage}
              page={pageInfo.currentPage}
              onChange={handlePageChange}
              color="primary"
              disabled={loading}
              showFirstButton
              showLastButton
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default TemplateListContent;

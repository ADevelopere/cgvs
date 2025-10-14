"use client";

import React, { useCallback, useMemo, useState } from "react";
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
import {
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from "@mui/icons-material";
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
    templateQueryVariables,
    updateTemplateQueryVariables,
    viewMode,
    setViewMode,
    currentCategory,
  } = useTemplatesList();

  // Local state for page input value (can be different from actual current page until confirmed)
  const [pageInputValue, setPageInputValue] = useState<number>(1);

  // Fetch templates with current query variables
  const { data, loading } = useQuery(
    Document.templatesByCategoryIdQueryDocument,
    {
      variables: {
        categoryId: currentCategory?.id,
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

  // Sync local input value with actual current page when pageInfo changes
  React.useEffect(() => {
    if (pageInfo?.currentPage) {
      setPageInputValue(pageInfo.currentPage);
    }
  }, [pageInfo?.currentPage]);

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

  const handlePageInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const pageValue = event.target.value;
      const pageNumber = parseInt(pageValue, 10);

      // Update local state regardless of validity (for controlled input)
      if (pageValue === "") {
        // Allow empty value for better UX, but don't change the state yet
        return;
      } else if (!isNaN(pageNumber) && pageNumber >= 1) {
        setPageInputValue(pageNumber);
      }
    },
    [],
  );

  const handlePageInputSubmit = useCallback(() => {
    const maxPage = pageInfo?.lastPage ?? 1;
    // Coerce the value to be within valid range
    const coercedPage = Math.min(Math.max(pageInputValue, 1), maxPage);

    // Update pagination args with the coerced value
    updateTemplateQueryVariables((current) => ({
      ...current,
      paginationArgs: {
        ...current.paginationArgs,
        page: coercedPage,
      },
    }));

    // Update local state to reflect the coerced value that will be fetched
    setPageInputValue(coercedPage);
  }, [pageInputValue, pageInfo?.lastPage, updateTemplateQueryVariables]);

  const handlePageInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handlePageInputSubmit();
      }
    },
    [handlePageInputSubmit],
  );

  const handlePageInputBlur = useCallback(() => {
    // Reset the input to the current page value
    const currentPage = pageInfo?.currentPage ?? 1;
    setPageInputValue(currentPage);
  }, [pageInfo?.currentPage]);

  const getEmptyMessage = React.useCallback(() => {
    if (searchQuery) {
      return strings.noTemplatesFoundSearch;
    }
    if (currentCategory?.id === null) {
      return strings.noTemplatesFoundCreate;
    }
    return strings.noTemplates;
  }, [
    currentCategory?.id,
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
          {currentCategory ? currentCategory.name : strings.allTemplates}
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
            justifyContent: { sm: "center", md: "space-between" },
            mt: { xs: 1, sm: 2 },
            pt: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2 },
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Pagination info - hidden on mobile */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            {strings.showing} {pageInfo.firstItem ?? 0}-{pageInfo.lastItem ?? 0}{" "}
            {strings.of} {pageInfo.total}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: { xs: 1, sm: 1.5, md: 2 },
              flexWrap: "wrap",
            }}
          >
            {/* Page input field and pagination arrows */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              {/* Page input field */}
              <TextField
                size="small"
                type="number"
                label={strings.goToPage}
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
                disabled={loading || pageInfo.lastPage <= 1}
                slotProps={{
                  input: {
                    style: { textAlign: "center", width: "60px" },
                  },
                  htmlInput: {
                    min: 1,
                    max: pageInfo.lastPage,
                  },
                }}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              />

              {/* Pagination arrows */}
              <Pagination
                count={pageInfo.lastPage}
                page={pageInfo.currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
                showFirstButton
                showLastButton
                size="small"
                sx={{
                  "& .MuiPagination-ul": {
                    flexWrap: "nowrap",
                  },
                  "& .MuiPaginationItem-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  },
                }}
              />
            </Box>

            {/* Page size selector */}
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: 80, sm: 100 },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            >
              <InputLabel id="page-size-label">{strings.perPage}</InputLabel>
              <Select
                labelId="page-size-label"
                value={
                  templateQueryVariables.paginationArgs?.first ??
                  pageInfo.perPage
                }
                label={strings.perPage}
                onChange={handlePageSizeChange}
                disabled={loading}
                sx={{
                  "& .MuiSelect-select": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TemplateListContent;

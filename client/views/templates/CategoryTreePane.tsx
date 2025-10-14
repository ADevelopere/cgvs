"use client";

import { Box, Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useAppTranslation } from "@/client/locale";
import { useTemplatesList } from "./TemplatesContext";
import { ReactiveCategoryTree } from "@/client/components/reactiveTree/ReactiveCategoryTree";
import { useLazyQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/sharedDocuments";
import { categoryChildrenQueryDocument } from "@/client/graphql/sharedDocuments/template/templateCategory.documents";
import {
  CategoryChildrenQuery,
  CategoryChildrenQueryVariables,
  TemplateCategory,
  TemplateCategoryWithParentTree,
} from "@/client/graphql/generated/gql/graphql";

const CategoryTreePane: React.FC<{ isMobile?: boolean }> = ({ isMobile: disableTopPadding = false }) => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const {
    currentCategoryId,
    clearCurrentCategory,
    selectCategoryWithParentTree,
    expandedCategoryIds,
    toggleExpanded,
    markAsFetched,
    isFetched,
    currentCategory,
    setCurrentCategory,
  } = useTemplatesList();

  // Category search for autocomplete
  const [
    searchCategories,
    { data: searchCategoriesData, loading: searchLoading },
  ] = useLazyQuery(Document.searchTemplateCategoriesQueryDocument);
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync currentCategory with currentCategoryId from store
  React.useEffect(() => {
    if (currentCategoryId === null) {
      setCurrentCategory(null);
    }
  }, [currentCategoryId, setCurrentCategory]);

  const categoryOptions = React.useMemo(
    () => searchCategoriesData?.searchTemplateCategories ?? [],
    [searchCategoriesData?.searchTemplateCategories],
  );

  // Debounced search handler
  const handleCategorySearch = React.useCallback(
    (searchTerm: string) => {
      setCategorySearchTerm(searchTerm);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (searchTerm.trim().length > 0) {
        searchTimeoutRef.current = setTimeout(() => {
          searchCategories({
            variables: {
              searchTerm,
              limit: 10,
              includeParentTree: true,
            },
          });
        }, 300);
      }
    },
    [searchCategories],
  );

  // Handle input change for autocomplete
  const handleInputChange = React.useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      handleCategorySearch(newInputValue);
    },
    [handleCategorySearch],
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Callback adapters for expansion and fetch tracking
  const handleToggleExpanded = React.useCallback(
    (nodeId: number) => {
      toggleExpanded(nodeId);
    },
    [toggleExpanded],
  );

  const handleIsFetched = React.useCallback(
    (nodeId: number) => {
      return isFetched(nodeId);
    },
    [isFetched],
  );

  const handleMarkAsFetched = React.useCallback(
    (nodeId: number) => {
      markAsFetched(nodeId);
    },
    [markAsFetched],
  );

  const handleCategorySelect = React.useCallback(
    (category: TemplateCategory) => {
      selectCategoryWithParentTree(category.id, []);
      // Also set the current category state for autocomplete display
      setCurrentCategory({
        id: category.id,
        name: category.name,
        parentTree: [],
      });
    },
    [selectCategoryWithParentTree, setCurrentCategory],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        pt: disableTopPadding ? 14 : 8,
      }}
      onClick={(e) => {
        // Click on empty area clears category selection
        if (e.target === e.currentTarget) {
          clearCurrentCategory();
        }
      }}
    >
      {/* Category Search Autocomplete - positioned at top, outside scrollable area */}
      <Box
        sx={{
          px: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Autocomplete
          value={currentCategory}
          onChange={(_, newValue: TemplateCategoryWithParentTree | null) => {
            if (newValue) {
              selectCategoryWithParentTree(
                newValue.id,
                newValue.parentTree ?? [],
              );
            } else {
              clearCurrentCategory();
            }
          }}
          inputValue={categorySearchTerm}
          onInputChange={handleInputChange}
          options={categoryOptions}
          getOptionLabel={(option) => option.name ?? strings.unnamed}
          loading={searchLoading}
          loadingText={strings.loading}
          noOptionsText={
            categorySearchTerm.trim().length > 0
              ? strings.noCategories
              : strings.selectCategory
          }
          sx={{ width: "100%", backgroundColor: "background.paper" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.searchCategories}
              variant="outlined"
              size="small"
              placeholder={
                currentCategory ? undefined : strings.searchCategories
              }
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name ?? strings.unnamed}
            </li>
          )}
        />
      </Box>

      {/* Reactive Category Tree - now in scrollable area */}
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 2, pt: 1 }}>
        <ReactiveCategoryTree<
          TemplateCategory,
          CategoryChildrenQuery,
          CategoryChildrenQueryVariables
        >
          resolver={(parent) => ({
            query: categoryChildrenQueryDocument,
            variables: parent ? { parentCategoryId: parent.id } : undefined,
            fetchPolicy: "cache-first",
          })}
          getItems={(data) => data.categoryChildren || []}
          getNodeLabel={(node) => node.name || String(node.id)}
          selectedItemId={currentCategoryId}
          onSelectItem={handleCategorySelect}
          expandedItemIds={expandedCategoryIds}
          onToggleExpand={handleToggleExpanded}
          isFetched={handleIsFetched}
          onMarkAsFetched={handleMarkAsFetched}
          noItemsMessage={strings.noCategories}
          itemHeight={48}
        />
      </Box>
    </Box>
  );
};

export default CategoryTreePane;

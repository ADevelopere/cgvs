"use client";

import {
  Box,
  Paper,
  styled,
  useMediaQuery,
  useTheme,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import TemplateListContent from "./TemplateListContent";
import SplitPane from "@/client/components/splitPane/SplitPane";
import { useAppTranslation } from "@/client/locale";
import { TemplatesPageProvider, useTemplatesList } from "./TemplatesContext";
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

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const ToggleSideBarButton: React.FC<{
  open?: boolean;
  toggleSidebar: () => void;
  dashboardsidebarState: string;
  zIndex: number;
  isMobile: boolean;
}> = ({ open, toggleSidebar, dashboardsidebarState, isMobile, zIndex }) => {
  if (dashboardsidebarState === "expanded" && isMobile) {
    return null;
  }
  return (
    <Box
      sx={{
        width: { xs: 48, sm: 72 },
        display: "flex",
        justifyContent: "center",
        position: "fixed",
        zIndex: zIndex,
        minHeight: 48,
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={toggleSidebar}
        edge="start"
        color="inherit"
        aria-label="toggle sidebar"
        sx={{
          transition: "transform 0.3s ease-in-out",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};

const CategoryTreePane: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const {
    currentCategoryId,
    clearCurrentCategory,
    selectCategoryWithParentTree,
    expandedCategoryIds,
    toggleExpanded,
    markAsFetched,
    isFetched,
  } = useTemplatesList();

  // Category search for autocomplete
  const [
    searchCategories,
    { data: searchCategoriesData, loading: searchLoading },
  ] = useLazyQuery(Document.searchTemplateCategoriesQueryDocument);
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get current category for autocomplete (convert from ID to object)
  const currentCategory = React.useMemo(() => {
    if (!currentCategoryId) return null;
    // Try to find in search results
    const found = categoryOptions.find((cat) => cat.id === currentCategoryId);
    if (found) return found;
    // Return a placeholder object if not in search results
    return {
      id: currentCategoryId,
      name: strings.loading,
      description: null,
      specialType: null,
      order: 0,
      parentTree: [],
    } as TemplateCategoryWithParentTree;
  }, [currentCategoryId, categoryOptions, strings.loading]);

  // Callback adapters for expansion and fetch tracking
  const handleToggleExpanded = React.useCallback(
    (nodeId: string | number) => {
      toggleExpanded(Number(nodeId));
    },
    [toggleExpanded],
  );

  const handleIsFetched = React.useCallback(
    (nodeId: string | number) => {
      return isFetched(Number(nodeId));
    },
    [isFetched],
  );

  const handleMarkAsFetched = React.useCallback(
    (nodeId: string | number) => {
      markAsFetched(Number(nodeId));
    },
    [markAsFetched],
  );

  const handleCategorySelect = React.useCallback(
    (category: TemplateCategory) => {
      selectCategoryWithParentTree(category.id, []);
    },
    [selectCategoryWithParentTree],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 2,
      }}
      onClick={(e) => {
        // Click on empty area clears category selection
        if (e.target === e.currentTarget) {
          clearCurrentCategory();
        }
      }}
    >
      {/* Category Search Autocomplete */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Autocomplete
          value={currentCategory}
          onChange={(_, newValue: TemplateCategoryWithParentTree | null) => {
            if (newValue) {
              selectCategoryWithParentTree(newValue.id, newValue.parentTree);
            } else {
              clearCurrentCategory();
            }
          }}
          inputValue={categorySearchTerm}
          onInputChange={(_, newInputValue) => {
            handleCategorySearch(newInputValue);
          }}
          options={categoryOptions}
          getOptionLabel={(option) => option.name ?? strings.unnamed}
          loading={searchLoading}
          loadingText={strings.loading}
          noOptionsText={strings.noCategories}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.selectCategory}
              variant="outlined"
              size="small"
              placeholder={strings.selectCategory}
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

      {/* Reactive Category Tree */}
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 2 }}>
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
          header={strings.categories}
          noItemsMessage={strings.noCategories}
          itemHeight={48}
        />
      </Box>
    </Box>
  );
};

const TemplateList: React.FC = () => {
  const { sidebarState: dashboardsidebarState } = useDashboardLayout();
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <ToggleSideBarButton
        open={open}
        toggleSidebar={toggleSidebar}
        dashboardsidebarState={dashboardsidebarState}
        zIndex={theme.zIndex.drawer + 1}
        isMobile={isMobile}
      />

      {!isMobile && (
        <SplitPane
          orientation="vertical"
          firstPane={{
            visible: open,
            minRatio: 0.1,
          }}
          secondPane={{
            visible: true,
            minRatio: 0.5,
          }}
          resizerProps={{
            style: {
              cursor: "col-resize",
            },
          }}
          storageKey="templateListSplitPane"
        >
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CategoryTreePane />
          </Paper>
          <TemplateListContent
            style={{
              paddingInlineStart: open ? 2 : 8,
              paddingInlineEnd: 2,
              paddingTop: 2,
              paddingBottom: 4,
            }}
          />
        </SplitPane>
      )}

      {isMobile && (
        <Main>
          <TemplateListContent
            style={{
              paddingInlineStart: 2,
            }}
          />
        </Main>
      )}
    </Box>
  );
};

const TemplateListPage: React.FC = () => {
  return (
    <TemplatesPageProvider>
      <TemplateList />
    </TemplatesPageProvider>
  );
};

export default TemplateListPage;

"use client";

import React from "react";
import { Box, ListItem, Button, ListItemButton, Paper } from "@mui/material";
import { Boxes } from "lucide-react";

import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useAppTranslation } from "@/client/locale";

import {
  CategoryChildrenQuery,
  CategoryChildrenQueryVariables,
  TemplateCategory,
} from "@/client/graphql/generated/gql/graphql";

import { ReactiveCategoryTree } from "@/client/components/reactiveTree";
import EditableTypography from "@/client/components/input/EditableTypography";

import CategoryEditDialog from "./---CategoryEditDialog";
import RenderCategoryItem from "./RenderCategoryItem";
import { categoryChildrenQueryDocument } from "@/client/graphql/sharedDocuments";
import { useTemplateCategoryStore } from "./hooks/useTemplateCategoryStore";
import { useTemplateCategoryOperations } from "./hooks/useTemplateCategoryOperations";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
  const { theme } = useAppTheme();
  const strings = useAppTranslation("templateCategoryTranslations");

  const {
    currentCategory,
    expandedCategoryIds,
    toggleExpanded,
    isFetched,
    markAsFetched,
    selectCategory,
  } = useTemplateCategoryStore();
  const { createCategory, updateCategory, deleteCategory } =
    useTemplateCategoryOperations();

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    React.useState<TemplateCategory | null>(null);
  const [tempCategory, setTempCategory] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const newCategoryRef = React.useRef<HTMLLIElement>(null);

  const validateCategoryName = React.useCallback(
    (name: string) => {
      if (name.length < 3) return strings.nameTooShort;
      if (name.length > 255) return strings.nameTooLong;
      return "";
    },
    [strings.nameTooLong, strings.nameTooShort],
  );

  const handleCategoryClick = React.useCallback(
    (category: TemplateCategory) => {
      selectCategory(category);
    },
    [selectCategory],
  );

  const handleAddNewCategory = React.useCallback(() => {
    setTempCategory({ id: "temp-" + Date.now(), name: "" });
    // Schedule scroll after render
    setTimeout(() => {
      newCategoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }, []);

  const handleNewCategorySave = React.useCallback(
    async (name: string) => {
      const error = validateCategoryName(name);
      if (error) {
        return error;
      }

      try {
        createCategory({ name });
        setTempCategory(null);
        return "";
      } catch (error: unknown) {
        return (error as Error).message || strings.categoryAddFailed;
      }
    },
    [createCategory, strings.categoryAddFailed, validateCategoryName],
  );

  const handleUpdateCategory = React.useCallback(
    ({
      name,
      description,
      parentId,
    }: {
      name: string;
      description?: string;
      parentId?: number | null;
    }) => {
      if (categoryToEdit) {
        updateCategory({
          ...categoryToEdit,
          name,
          description: description,
          parentCategoryId: parentId,
        });
        setIsEditDialogOpen(false);
        setCategoryToEdit(null);
      }
    },
    [categoryToEdit, updateCategory],
  );

  const handleOpenEditDialog = (category: TemplateCategory) => {
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCategoryToEdit(null);
  };

  const handleCategoryNameEdit = async (
    category: TemplateCategory,
    newName: string,
  ) => {
    updateCategory({ ...category, name: newName });
  };

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

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: 1,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          mb: tempCategory ? 0 : 2,
        }}
      >
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
          // Extract data from query results
          getItems={(data) => data.categoryChildren || []}
          // Get node label
          getNodeLabel={(node) => node.name || String(node.id)}
          // Custom rendering using existing RenderCategoryItem
          itemRenderer={({ node }) => (
            <RenderCategoryItem
              key={node.id}
              category={node}
              handleCategoryClick={handleCategoryClick}
              handleOpenEditDialog={handleOpenEditDialog}
              deleteCategory={deleteCategory}
              validateCategoryName={validateCategoryName}
              handleCategoryNameEdit={handleCategoryNameEdit}
              createCategory={createCategory}
            />
          )}
          // Selection
          selectedItemId={currentCategory?.id}
          onSelectItem={handleCategoryClick}
          // Expansion state (persisted across navigation)
          expandedItemIds={expandedCategoryIds}
          onToggleExpand={handleToggleExpanded}
          // Fetch tracking (persisted across navigation)
          isFetched={handleIsFetched}
          onMarkAsFetched={handleMarkAsFetched}
          // UI
          header={strings.categories}
          noItemsMessage={strings.noCategories}
          itemHeight={48}
        />
      </Box>

      {tempCategory && (
        <Paper
          sx={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            borderRadius: 2,
          }}
        >
          <ListItem ref={newCategoryRef} disablePadding key={tempCategory.id}>
            <ListItemButton
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Boxes />
                <EditableTypography
                  typography={{
                    variant: "body1",
                  }}
                  textField={{
                    size: "small",
                    variant: "standard",
                    sx: { minWidth: 150 },
                  }}
                  value=""
                  onSave={handleNewCategorySave}
                  onCancel={() => setTempCategory(null)}
                  isValid={validateCategoryName}
                  startEditing={true}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        </Paper>
      )}

      {/* bottom action bar */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: theme.palette.divider,
          display: "flex",
        }}
      >
        {/* Add root Category */}
        <Button
          variant="contained"
          onClick={handleAddNewCategory}
          sx={{ mr: 1 }}
          disabled={!!tempCategory}
        >
          {strings.addCategory}
        </Button>
      </Box>

      {/* edit category dialog */}
      <CategoryEditDialog
        open={isEditDialogOpen}
        categoryToEdit={categoryToEdit}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateCategory}
      />
    </Box>
  );
};
export default TemplateCategoryManagementCategoryPane;

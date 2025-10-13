"use client";

import React from "react";
import { Box, ListItem, Button, ListItemButton, Paper } from "@mui/material";
import { Boxes } from "lucide-react";

import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useAppTranslation } from "@/client/locale";

import { TemplateCategory } from "@/client/graphql/generated/gql/graphql";

import { ReactiveCategoryTree } from "@/client/components/reactiveTree";
import EditableTypography from "@/client/components/input/EditableTypography";

import * as Document from "./0-categories.documents";
import { useTemplateCategoryManagement } from "./4-categories.context";
import CategoryEditDialog from "./CategoryEditDialog";
import RenderCategoryItem from "./RenderCategoryItem";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
  const { theme } = useAppTheme();
  const strings = useAppTranslation("templateCategoryTranslations");

  const {
    trySelectCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    currentCategoryId,
  } = useTemplateCategoryManagement();

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
      trySelectCategory(category.id);
    },
    [trySelectCategory],
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
        createCategory(name);
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
        updateCategory(
          {
            ...categoryToEdit,
            name,
            description: description,
          },
          parentId,
        );
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
          { rootTemplateCategories: TemplateCategory[] },
          { categoryChildren: TemplateCategory[] },
          Record<string, string | number | boolean>,
          { parentCategoryId: number }
        >
          // Root resolver - returns query options for root categories
          rootResolver={() => ({
            query: Document.rootTemplateCategoriesQueryDocument,
            fetchPolicy: "cache-first",
          })}
          // Children resolver - returns query options for a parent's children
          childrenResolver={(parentId) => ({
            query: Document.categoryChildrenQueryDocument,
            variables: { parentCategoryId: Number(parentId) },
            fetchPolicy: "cache-first",
          })}
          // Extract data from query results
          getRootItems={(data) => data.rootTemplateCategories || []}
          getChildItems={(data) => data.categoryChildren || []}
          // Get node label
          getNodeLabel={(node) => node.name || String(node.id)}
          // Custom rendering using existing RenderCategoryItem
          itemRenderer={({ node }) => (
            <RenderCategoryItem
              key={node.id}
              category={node}
              selectedCategoryId={currentCategoryId}
              handleCategoryClick={handleCategoryClick}
              handleOpenEditDialog={handleOpenEditDialog}
              deleteCategory={deleteCategory}
              validateCategoryName={validateCategoryName}
              handleCategoryNameEdit={handleCategoryNameEdit}
              createCategory={createCategory}
            />
          )}
          // Selection
          selectedItemId={currentCategoryId}
          onSelectItem={handleCategoryClick}
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

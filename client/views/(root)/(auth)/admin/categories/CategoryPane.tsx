"use client";

import React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { ListItemButton, Paper } from "@mui/material";
import { useQuery } from "@apollo/client";
import EditableTypography from "@/client/components/input/EditableTypography";
import { Boxes } from "lucide-react";
import { useTemplateCategoryManagement } from "@/client/views/(root)/(auth)/admin/categories/categories.context";
import { useTemplateCategoryUIStore } from "@/client/views/(root)/(auth)/admin/categories/categories.store";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useAppTranslation } from "@/client/locale";
import CategoryEditDialog from "./CategoryEditDialog";
import RenderCategoryItem from "./RenderCategoryItem";
import { TemplateCategory } from "@/client/graphql/generated/gql/graphql";
import { ReactiveCategoryTree } from "@/client/components/reactiveTree";
import * as Document from "@/client/views/(root)/(auth)/admin/categories/category.documents";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
  const { theme } = useAppTheme();
  const strings = useAppTranslation("templateCategoryTranslations");

  const {
    trySelectCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useTemplateCategoryManagement();

  // Get current category ID from store
  const { currentCategoryId } = useTemplateCategoryUIStore();

  // Fetch current category data
  const { data: currentCategoryData } = useQuery(
    Document.templateCategoryByIdQueryDocument,
    {
      variables: { id: currentCategoryId ?? 0 },
      skip: !currentCategoryId,
      fetchPolicy: "cache-first",
    },
  );
  const selectedCategory = currentCategoryData?.templateCategoryById ?? null;

  // Fetch all categories for the edit dialog
  const { data: categoriesData } = useQuery(
    Document.templateCategoriesQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );
  const allCategories = categoriesData?.templateCategories ?? [];

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<TemplateCategory | null>(
    null,
  );
  const [tempCategory, setTempCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const newCategoryRef = useRef<HTMLLIElement>(null);

  const validateCategoryName = React.useCallback((name: string) => {
    if (name.length < 3) return strings.nameTooShort;
    if (name.length > 255) return strings.nameTooLong;
    return "";
  }, [strings.nameTooLong, strings.nameTooShort]);

  const handleCategoryClick = (category: TemplateCategory) => {
    trySelectCategory(category.id);
  };

  const handleAddNewCategory = React.useCallback(() => {
    setTempCategory({ id: "temp-" + Date.now(), name: "" });
    // Schedule scroll after render
    setTimeout(() => {
      newCategoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  }, [])

  const handleNewCategorySave = React.useCallback(async (name: string) => {
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
  }, [createCategory, strings.categoryAddFailed, validateCategoryName])

  const handleUpdateCategory = React.useCallback(({
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
  }, [categoryToEdit, updateCategory])

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
        <ReactiveCategoryTree
          // Root resolver - returns query options for root categories
          rootResolver={() => ({
            query: Document.rootTemplateCategoriesQueryDocument,
            fetchPolicy: "cache-first",
          })}
          // Children resolver - returns query options for a parent's children
          childrenResolver={(parentId) => ({
            query: Document.categoryChildrenQueryDocument,
            variables: { parentCategoryId: parentId },
            fetchPolicy: "cache-first",
          })}
          // Extract data from query results
          getRootItems={(data) => data.rootTemplateCategories || []}
          getChildItems={(data) => data.categoryChildren || []}
          // Custom rendering using existing RenderCategoryItem
          itemRenderer={({ node }) => (
            <RenderCategoryItem
              key={node.id}
              category={node}
              selectedCategory={selectedCategory}
              handleCategoryClick={handleCategoryClick}
              handleOpenEditDialog={handleOpenEditDialog}
              deleteCategory={deleteCategory}
              validateCategoryName={validateCategoryName}
              handleCategoryNameEdit={handleCategoryNameEdit}
              createCategory={createCategory}
            />
          )}
          // Selection
          selectedItemId={selectedCategory?.id}
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
        categories={allCategories}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateCategory}
      />
    </Box>
  );
};
export default TemplateCategoryManagementCategoryPane;

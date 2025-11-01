"use client";

import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  ListItem,
  IconButton,
  ListItemButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { useAppTranslation } from "@/client/locale";
import { EditableTypography } from "@/client/components";
import { EditIcon, Ungroup, FolderPlus } from "lucide-react";
import {
  TemplateCategoryWithParentTree,
  TemplateCategoryCreateInput,
} from "@/client/graphql/generated/gql/graphql";
import { TemplateDocuments } from "../hooks";

type RenderCategoryItemProps = {
  category: TemplateCategoryWithParentTree;
  handleCategoryClick: (category: TemplateCategoryWithParentTree) => void;
  handleOpenEditDialog: (category: TemplateCategoryWithParentTree) => void;
  deleteCategory: (categoryId: number) => void;
  validateCategoryName: (name: string) => string;
  handleCategoryNameEdit: (
    category: TemplateCategoryWithParentTree,
    newValue: string
  ) => void;
  createCategory: (input: TemplateCategoryCreateInput) => Promise<void>;
};

const RenderCategoryItem: React.FC<RenderCategoryItemProps> = ({
  category,
  handleCategoryClick,
  handleOpenEditDialog,
  deleteCategory,
  validateCategoryName,
  handleCategoryNameEdit,
  createCategory,
}) => {
  const theme = useTheme();
  const { templateCategoryTranslations: strings } = useAppTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryDescription, setNewCategoryDescription] =
    React.useState("");
  const [error, setError] = React.useState("");

  // Fetch templates for current category
  const { data: templatesByCategoryIdQuery } = useQuery(
    TemplateDocuments.templatesByCategoryIdQueryDocument,
    {
      variables: {
        categoryId: category.id,
      },
      skip: !category.id,
      fetchPolicy: "cache-only",
      nextFetchPolicy: "cache-only",
    }
  );

  const hasTemplates: boolean = React.useMemo(
    () =>
      (templatesByCategoryIdQuery?.templatesByCategoryId?.data?.length ?? 0) >
      0,
    [templatesByCategoryIdQuery?.templatesByCategoryId?.data]
  );

  const handleCreateSubCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setError("");
  };

  const handleSaveNewCategory = () => {
    const validationError = validateCategoryName(newCategoryName);
    if (validationError) {
      setError(validationError);
      return;
    }
    createCategory({
      name: newCategoryName,
      parentCategoryId: category.id,
    });
    handleCloseCreateDialog();
  };

  if (!category.name) {
    throw new Error("Category name is required");
  }

  return (
    <ListItem
      disablePadding
      key={category.id}
      sx={{
        px: 0,
      }}
    >
      <ListItemButton
        onClick={() => handleCategoryClick(category)}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          p: 0,
          paddingInlineStart: 1,
          "&:hover": {
            backgroundColor: "transparent",
          },
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
          <Ungroup
            size={16}
            style={{
              transform:
                theme.direction === "rtl"
                  ? "rotate(180deg)"
                  : "rotate(-180deg)",
            }}
          />
          <EditableTypography
            typography={{
              variant: "body1",
              minWidth: "150px",
              width: "max-content",
            }}
            textField={{
              size: "small",
              variant: "standard",
              sx: { minWidth: "150px", width: "max-content" },
            }}
            value={category.name}
            onSaveAction={newValue =>
              handleCategoryNameEdit(category, newValue)
            }
            isValidAction={validateCategoryName}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        {/* delete */}
        <Tooltip title={strings.delete}>
          <span>
            <IconButton
              onClick={e => {
                e.stopPropagation();
                deleteCategory(category.id);
              }}
              color="error"
              disabled={!!category.specialType || hasTemplates}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* Create child category button */}
        <Tooltip title={strings.createChildCategory ?? "Create Child Category"}>
          <span>
            <IconButton onClick={handleCreateSubCategory}>
              <FolderPlus size={20} />
            </IconButton>
          </span>
        </Tooltip>

        {/* edit button */}
        <Tooltip title={strings.edit}>
          <IconButton
            onClick={e => {
              e.stopPropagation();
              handleOpenEditDialog(category);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </ListItemButton>

      {/* Simple Create Child Category Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{strings.createChildCategory}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              autoFocus
              label={strings.name}
              fullWidth
              value={newCategoryName}
              onChange={e => {
                setNewCategoryName(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              required
            />
            <TextField
              label={strings.description}
              fullWidth
              multiline
              rows={3}
              value={newCategoryDescription}
              onChange={e => setNewCategoryDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>{strings.cancel}</Button>
          <Button onClick={handleSaveNewCategory} variant="contained">
            {strings.save}
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default RenderCategoryItem;

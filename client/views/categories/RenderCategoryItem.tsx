"use client";

import type React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ListItemButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditableTypography from "@/client/components/input/EditableTypography";
import { EditIcon, Ungroup, FolderPlus } from "lucide-react";
import { useAppTranslation } from "@/client/locale";
import { useState } from "react";
import { TemplateCategory } from "@/client/graphql/generated/gql/graphql";

type RenderCategoryItemProps = {
  category: TemplateCategory;
  handleCategoryClick: (category: TemplateCategory) => void;
  handleOpenEditDialog: (category: TemplateCategory) => void;
  deleteCategory: (categoryId: number) => void;
  validateCategoryName: (name: string) => string;
  handleCategoryNameEdit: (
    category: TemplateCategory,
    newValue: string,
  ) => void;
  createCategory: (name: string, parentId?: number) => void;
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
  const strings = useAppTranslation("templateCategoryTranslations");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [error, setError] = useState("");

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
    createCategory(newCategoryName, category.id);
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
            onSave={(newValue) => handleCategoryNameEdit(category, newValue)}
            isValid={validateCategoryName}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        {/* delete */}
        <Tooltip title="Delete">
          <span>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteCategory(category.id);
              }}
              color="error"
              disabled={
                !!category.specialType || (category.templates?.length ?? 0) > 0
              }
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
            onClick={(e) => {
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
              onChange={(e) => {
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
              onChange={(e) => setNewCategoryDescription(e.target.value)}
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

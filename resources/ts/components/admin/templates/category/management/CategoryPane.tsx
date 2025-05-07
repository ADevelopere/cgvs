import type React from "react";
import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { ListItemButton, Typography } from "@mui/material";
import EmptyStateIllustration from "@/components/common/EmptyStateIllustration";
import EditableTypography from "@/components/input/EditableTypography";
import { Boxes, EditIcon } from "lucide-react";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { TemplateCategory } from "@/graphql/generated/types";
import { getSerializableCategories } from "@/utils/template/template-category-mapper";
import CategoryEditDialog from "./CategoryEditDialog";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const {
        regularCategories,
        currentCategory: selectedCategory,
        trySelectCategory,
        addCategory,
        updateCategory,
        deleteCategory,
    } = useTemplateCategoryManagement();

    useEffect(() => {
        const s = getSerializableCategories(regularCategories);
        console.log("TemplateCategoryManagementCategoryPane categories", s);
    }, [regularCategories]);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<TemplateCategory | null>(null);
    const [tempCategory, setTempCategory] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const newCategoryRef = useRef<HTMLLIElement>(null);

    const validateCategoryName = (name: string) => {
        if (name.length < 3) return strings.nameTooShort;
        if (name.length > 255) return strings.nameTooLong;
        return "";
    };

    const handleCategoryClick = (category: TemplateCategory) => {
        trySelectCategory(category).then((r) => r);
    };

    const handleAddNewCategory = () => {
        setTempCategory({ id: "temp-" + Date.now(), name: "" });
        // Schedule scroll after render
        setTimeout(() => {
            newCategoryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 100);
    };

    const handleNewCategoryCancel = () => {
        setTempCategory(null);
    };

    const handleNewCategorySave = async (name: string) => {
        const error = validateCategoryName(name);
        if (error) {
            return error;
        }

        try {
            addCategory(name);
            setTempCategory(null);
            return "";
        } catch (error: any) {
            return error.message || strings.categoryAddFailed;
        }
    };

    const handleEditCategory = ({ name, description, parentId }: { name: string; description?: string; parentId?: string | null }) => {
        if (categoryToEdit) {
            // TODO: Update the updateCategory function in the context to handle description and parentId
            updateCategory({
                ...categoryToEdit,
                name,
                description: description,
                
            }, parentId);
            setIsEditDialogOpen(false);
            setCategoryToEdit(null);
        }
    };

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
        updateCategory({...category, name: newName });
    };

    const renderCategory = (category: (typeof regularCategories)[0]) => (
        <ListItem
            disablePadding
            key={category.id}
            sx={{
                backgroundColor:
                    category.id === selectedCategory?.id
                        ? theme.palette.action.focus
                        : "inherit",
            }}
        >
            <ListItemButton
                selected={category.id === selectedCategory?.id}
                onClick={() => handleCategoryClick(category)}
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
                        value={category.name}
                        onSave={(newValue) =>
                            handleCategoryNameEdit(category, newValue)
                        }
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
                            disabled={!!category.special_type || (category.templates?.length ?? 0) > 0}
                        >
                            <DeleteIcon />
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
        </ListItem>
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
            <Typography
                variant="h5"
                sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: theme.palette.divider,
                }}
            >
                {strings.categories}
            </Typography>
            {!Array.isArray(regularCategories) ? (
                <EmptyStateIllustration message={strings.noCategories} />
            ) : regularCategories.length === 0 && !tempCategory ? (
                <EmptyStateIllustration message={strings.noCategories} />
            ) : (
                <List
                    ref={listRef}
                    sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        height: "80%",
                    }}
                >
                    {regularCategories.map(renderCategory)}
                    {tempCategory && (
                        <ListItem
                            ref={newCategoryRef}
                            disablePadding
                            key={tempCategory.id}
                        >
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
                                        onCancel={handleNewCategoryCancel}
                                        isValid={validateCategoryName}
                                        startEditing={true}
                                    />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
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
                {/* sort categories */}
                {/* <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={handleSortClick}
                    disabled={!regularCategories?.length}
                >
                    {strings.sort}
                </Button> */}
                {/* total count */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography>{regularCategories.length}</Typography>
                </Box>
            </Box>

            {/* edit category dialog */}
            <CategoryEditDialog
                open={isEditDialogOpen}
                category={categoryToEdit}
                categories={regularCategories}
                onClose={handleCloseEditDialog}
                onSave={handleEditCategory}
            />
        </Box>
    );
};
export default TemplateCategoryManagementCategoryPane;

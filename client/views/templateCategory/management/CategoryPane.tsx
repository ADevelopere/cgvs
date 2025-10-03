"use client";

import type React from "react";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { ListItemButton, Paper, Typography } from "@mui/material";
import EmptyStateIllustration from "@/client/components/common/EmptyStateIllustration";
import EditableTypography from "@/client/components/input/EditableTypography";
import { Boxes } from "lucide-react";
import { useTemplateCategoryManagement } from "@/client/contexts/template/TemplateCategoryManagementContext";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { TemplateCategory } from "@/graphql/generated/types";
import CategoryEditDialog from "./CategoryEditDialog";
import RenderCategoryItem from "./RenderCategoryItem";
import { TreeView } from "@/client/components/treeView/TreeView";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const {
        regularCategories,
        currentCategory: selectedCategory,
        trySelectCategory,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useTemplateCategoryManagement();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] =
        useState<TemplateCategory | null>(null);
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
            createCategory(name);
            setTempCategory(null);
            return "";
        } catch (error: unknown) {
            return (error as Error).message || strings.categoryAddFailed;
        }
    };

    const handleEditCategory = ({
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
                        p: 0,
                    }}
                >
                    {/* {regularCategories.map(renderCategory)} */}
                    <Box
                        sx={{
                            width: "100%",
                            height: tempCategory ? "calc(100% - 80px)" : "100%",
                            overflow: "auto",
                            borderRadius: tempCategory
                                ? "20px 20px 0px 0px"
                                : "20px 20px 20px 20px",
                        }}
                    >
                        <TreeView
                            items={regularCategories}
                            itemRenderer={({ item }) => (
                                <RenderCategoryItem
                                    key={item.id}
                                    category={item}
                                    selectedCategory={selectedCategory}
                                    handleCategoryClick={handleCategoryClick}
                                    handleOpenEditDialog={handleOpenEditDialog}
                                    deleteCategory={deleteCategory}
                                    validateCategoryName={validateCategoryName}
                                    handleCategoryNameEdit={
                                        handleCategoryNameEdit
                                    }
                                    createCategory={createCategory}
                                />
                            )}
                            childrenKey="childCategories"
                            labelKey="name"
                            header={strings.categories}
                            noItemsMessage={strings.noCategories}
                            searchText={strings.filter}
                        />
                    </Box>
                    {tempCategory && (
                        <Paper
                            sx={{
                                height: "80px",
                                display: "flex",
                                alignItems: "end",
                                justifyContent: "end",
                                borderRadius: "0px 0px 20px 20px",
                            }}
                        >
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
                                        borderRadius: "0px 0px 20px 20px",
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
                        </Paper>
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

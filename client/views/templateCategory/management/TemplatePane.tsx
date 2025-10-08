"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { GraduationCap, SquareArrowOutUpRight, EditIcon } from "lucide-react";

import EmptyStateIllustration from "@/client/components/common/EmptyStateIllustration";
import EditableTypography from "@/client/components/input/EditableTypography";
import { useTemplateCategoryManagement } from "@/client/contexts/template/TemplateCategoryManagementContext";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useAppTranslation } from "@/client/locale";
import TemplateEditDialog from "./TemplateEditDialog";
import { mapTemplateToUpdateInput } from "@/client/utils/template/template-mappers";
import { Template } from "@/client/graphql/generated/gql/graphql";

const TemplateCategoryManagementTemplatePane: React.FC = () => {
    const {
        currentCategory,
        regularCategories,
        createTemplate: addTemplate,
        updateTemplate,
        suspendTemplate,
        trySelectCategory,
        setIsAddingTemplate,
        setOnNewTemplateCancel,
        manageTemplate,
    } = useTemplateCategoryManagement();

    const templates = currentCategory?.templates ?? [];

    const { theme } = useAppTheme();
    const [tempTemplate, setTempTemplate] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const newTemplateRef = useRef<HTMLLIElement>(null);
    const strings = useAppTranslation("templateCategoryTranslations");

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

    const validateTemplateName = (name: string) => {
        if (name.length < 3) return strings.nameTooShort;
        if (name.length > 255) return strings.nameTooLong;
        return "";
    };

    const handleNewTemplateCancel = useCallback(() => {
        setTempTemplate(null);
        setIsAddingTemplate(false);
        setOnNewTemplateCancel(undefined);
    }, [setOnNewTemplateCancel, setIsAddingTemplate]);

    const handleAddNewTemplate = () => {
        if (!currentCategory) return;
        setTempTemplate({ id: "temp-" + Date.now(), name: "" });
        setIsAddingTemplate(true);
        setOnNewTemplateCancel(() => handleNewTemplateCancel);
        // Schedule scroll after render
        setTimeout(() => {
            newTemplateRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 100);
    };

    const handleNewTemplateSave = async (name: string) => {
        if (!currentCategory) return strings.selectCategoryFirst;

        const error = validateTemplateName(name);
        if (error) {
            return error;
        }

        try {
            addTemplate(name, currentCategory.id);
            setTempTemplate(null);
            setIsAddingTemplate(false);
            return "";
        } catch (error: unknown) {
            return (error as Error).message || strings.templateAddFailed;
        }
    };

    const handleTemplateNameEdit = async (
        template: Template,
        newName: string,
    ) => {
        const error = validateTemplateName(newName);
        if (error) {
            return error;
        }

        try {
            updateTemplate({
                input: mapTemplateToUpdateInput({ ...template, name: newName }),
            });
            return ""; // success
        } catch (error: unknown) {
            return (error as Error).message || strings.templateUpdateFailed;
        }
    };

    const handleOpenEditDialog = (template: Template) => {
        setTemplateToEdit(template);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setTemplateToEdit(null);
    };

    const handleEditTemplate = (updatedTemplate: Template) => {
        updateTemplate({
            input: mapTemplateToUpdateInput(updatedTemplate),
        });
        setIsEditDialogOpen(false);
        setTemplateToEdit(null);
    };

    const getEmptyMessage = () => {
        if (regularCategories.length === 0) {
            return strings.createCategoryFirst;
        }
        if (!currentCategory) {
            return strings.selectCategoryFirst;
        }
        return strings.noTemplates;
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
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        p: 2,
                    }}
                >
                    {strings.templates}
                </Typography>

                {/* category selector */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        flexGrow: 1,
                    }}
                >
                    <Autocomplete
                        value={currentCategory}
                        onChange={(_, newValue) => {
                            trySelectCategory(newValue).then((r) => r);
                        }}
                        options={
                            Array.isArray(regularCategories)
                                ? regularCategories
                                : []
                        }
                        getOptionLabel={(option) => {
                            if (!option.name) {
                                throw new Error("Category name is required");
                            }
                            return option.name;
                        }}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={strings.selectCategory}
                                variant="outlined"
                                size="small"
                                disabled={
                                    !Array.isArray(regularCategories) ||
                                    regularCategories.length === 0
                                }
                            />
                        )}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        )}
                    />
                </Box>
            </Box>
            {regularCategories.length === 0 ? (
                <EmptyStateIllustration message={strings.noCategories} />
            ) : (
                <>
                    <List
                        ref={listRef}
                        sx={{
                            flexGrow: 1,
                            overflow: "auto",
                        }}
                    >
                        {templates.map((template) => (
                            <ListItem
                                key={template?.id}
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
                                    <GraduationCap style={{ marginRight: 2 }} />
                                    <EditableTypography
                                        typography={{
                                            variant: "body1",
                                        }}
                                        textField={{
                                            size: "small",
                                            variant: "standard",
                                            sx: { minWidth: 150 },
                                        }}
                                        value={template?.name ?? ""}
                                        onSave={(newValue) =>
                                            handleTemplateNameEdit(
                                                template,
                                                newValue,
                                            )
                                        }
                                        isValid={validateTemplateName}
                                    />
                                </Box>

                                <Box sx={{ flexGrow: 1 }} />

                                <Tooltip title={strings.delete}>
                                    <IconButton
                                        onClick={() =>
                                            suspendTemplate(template.id)
                                        }
                                        color="error"
                                        disabled={false}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={strings.edit}>
                                    <IconButton
                                        onClick={() => {
                                            handleOpenEditDialog(template);
                                        }}
                                        color="primary"
                                        disabled={false}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={strings.manage}>
                                    <IconButton
                                        onClick={() =>
                                            manageTemplate(template.id)
                                        }
                                        color="info"
                                        disabled={false}
                                    >
                                        <SquareArrowOutUpRight />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        ))}
                        {tempTemplate && (
                            <ListItem
                                ref={newTemplateRef}
                                key={tempTemplate.id}
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
                                    <GraduationCap style={{ marginRight: 2 }} />
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
                                        onSave={handleNewTemplateSave}
                                        onCancel={handleNewTemplateCancel}
                                        isValid={validateTemplateName}
                                        startEditing={true}
                                    />
                                </Box>
                            </ListItem>
                        )}
                    </List>

                    {/* Show empty state only when no templates and no temp template */}
                    {templates.length === 0 && !tempTemplate && (
                        <EmptyStateIllustration message={getEmptyMessage()} />
                    )}

                    {/* Bottom action bar */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: "1px solid",
                            borderColor: theme.palette.divider,
                            display: "flex",
                        }}
                    >
                        {/* add template button */}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddNewTemplate}
                            disabled={!currentCategory || !!tempTemplate}
                            sx={{ mr: 1 }}
                        >
                            {strings.addTemplate}
                        </Button>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Typography>{templates?.length ?? 0}</Typography>
                        </Box>
                    </Box>
                </>
            )}

            <TemplateEditDialog
                open={isEditDialogOpen}
                template={templateToEdit}
                categories={regularCategories}
                onClose={handleCloseEditDialog}
                onSave={handleEditTemplate}
            />
        </Box>
    );
};

export default TemplateCategoryManagementTemplatePane;

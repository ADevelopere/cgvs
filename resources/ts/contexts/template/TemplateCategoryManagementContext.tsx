"use client";

import React, {
    useMemo,
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import {
    Template,
    TemplateCategory,
    TemplateCategoriesQuery,
} from "@/graphql/generated/types";

import { CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useAppTranslation from "@/locale/useAppTranslation";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    mapTemplateCategories,
    mapTemplateCategory,
} from "@/utils/template/template-category-mapper";
import { updateCategoryInTree } from "@/utils/template/templateCategoryTree";
import { useTemplateCategoryGraphQL } from "./TemplateCategoryGraphQLContext";
import { useTemplateGraphQL } from "./TemplateGraphQLContext";
import { mapSingleTemplate } from "@/utils/template/template-mappers";

// Logger utility
const logger = {
    enabled: process.env.NODE_ENV === "development" && true,
    log: (...args: any[]) => {
        if (logger.enabled) {
            console.log(...args);
        }
    },
    info: (...args: any[]) => {
        if (logger.enabled) {
            console.info(...args);
        }
    },
    error: (...args: any[]) => {
        if (logger.enabled) {
            console.error(...args);
        }
    },
};

type TemplateCategoryManagementContextType = {
    /**
     * Initiates the process of fetching the complete list of template categories.
     * This function is responsible for retrieving the category data used throughout the context.
     */
    fetchCategories: () => void;
    /**
     * Holds any error that occurred during the last attempt to fetch template categories.
     * It will be `null` if the last fetch was successful, otherwise it contains the error object.
     */
    fetchError: Error | null;
    // category states
    /**
     * An array containing all the regular template categories (excluding the deleted category).
     * This list is populated by `fetchCategories` and updated dynamically when categories are added, updated, or deleted.
     */
    regularCategories: TemplateCategory[];
    /**
     * Represents the special deleted category (special_type='deleted') that holds trashed templates.
     * This is a single category object that serves as a parent for all deleted templates.
     */
    deletionCategory: TemplateCategory | null;
    /**
     * Represents the currently selected template category.
     * When a category is selected, its associated templates are displayed. It's `null` if no category is currently selected.
     */
    currentCategory: TemplateCategory | null;
    /**
     * A function to programmatically set the `currentCategory`.
     * This directly changes the selected category without user interaction checks (like unsaved changes warnings).
     */
    setCurrentCategory: (category: TemplateCategory | null) => void;
    /**
     * Attempts to change the `currentCategory` to the provided category.
     * If a new template is currently being added, it will prompt the user for confirmation before switching, preventing accidental data loss.
     * Returns a promise resolving to `true` if the switch happened immediately, or `false` if a confirmation dialog was shown.
     */
    trySelectCategory: (category: TemplateCategory | null) => Promise<boolean>;
    /**
     * A boolean flag indicating if the confirmation dialog (warning about switching categories while adding a template) is currently visible.
     * `true` if the dialog is open, `false` otherwise.
     */
    isSwitchWarningOpen: boolean;
    /**
     * Closes the category switch confirmation dialog without changing the selected category.
     * This cancels the pending category switch.
     */
    closeSwitchWarning: () => void;
    /**
     * Confirms the intention to switch categories after the warning dialog was shown.
     * This will cancel the ongoing new template addition, switch to the intended category, and close the dialog.
     */
    confirmSwitch: () => void;
    // category mutations
    /**
     * Creates a new template category with the specified name and optional parent category.
     * After successful creation, the new category is added to the `categories` list and set as the `currentCategory`.
     */
    addCategory: (name: string, parentId?: string) => void;
    /**
     * Updates the name of an existing template category identified by its ID.
     * This modifies the category's name in the backend and updates the corresponding category in the local `categories` state.
     */
    updateCategory: (categoryId: string, name: string) => void;
    /**
     * Deletes a template category identified by its ID.
     * This removes the category from the backend and the local `categories` state. If the deleted category was the `currentCategory`, the selection is cleared.
     */
    deleteCategory: (categoryId: string) => void;
    /**
     * Sorts the `categories` array based on the specified field ('name' or 'id') and order ('asc' or 'desc').
     * This function reorders the categories list displayed to the user.
     */
    sortCategories: (sortBy: "name" | "id", order: "asc" | "desc") => void;
    // template
    /**
     * An array containing the templates associated with the `currentCategory`.
     * This list is updated whenever the `currentCategory` changes.
     */
    templates: Template[];
    /**
     * Represents the currently selected template within the `currentCategory`.
     * It's `null` if no template is currently selected.
     */
    currentTemplate: Template | null;
    /**
     * A function to programmatically set the `currentTemplate`.
     * This directly changes the selected template.
     */
    setCurrentTemplate: (template: Template | null) => void;
    // template mutations
    /**
     * Creates a new template with the specified name within the given category ID.
     * After successful creation, the new template is added to the `templates` list for the current category and potentially set as the `currentTemplate`.
     */
    addTemplate: (name: string, categoryId: string) => void;
    /**
     * Updates the name of an existing template identified by its ID.
     * This modifies the template's name in the backend and updates the corresponding template in the local `templates` and `categories` states.
     */
    updateTemplate: (
        id: string,
        updates: {
            name?: string;
            description?: string;
            background?: File;
            category_id?: number;
            order?: number;
        },
    ) => Promise<Template>;
    /**
     * Deletes a template identified by its ID.
     * This changes the templates's parent category to the deletion category.
     */
    moveTemplateToDeletionCategory(templateId: string): void;
    /**
     * Restores a template from the deletion category back to its original category.
     * This will move the template from the deletion category to the specified category and update both categories.
     */
    restoreTemplate: (templateId: string) => Promise<void>;
    /**
     * Sorts the `templates` array (associated with the `currentCategory`) based on the specified field ('name' or 'id') and order ('asc' or 'desc').
     * This function reorders the templates list displayed to the user for the selected category.
     */
    sortTemplates: (sortBy: "name" | "id", order: "asc" | "desc") => void;
    /**
     * A boolean flag indicating whether the user interface is currently in the state of adding a new template.
     * This is used, for example, to trigger the confirmation dialog when attempting to switch categories (`trySelectCategory`).
     */
    isAddingTemplate: boolean;
    /**
     * A function to explicitly set the `isAddingTemplate` state.
     * Used to control the UI state related to adding a new template.
     */
    setIsAddingTemplate: (adding: boolean) => void;
    /**
     * A callback function that can be set to handle the cancellation of the new template addition process.
     * This is typically invoked when the user confirms switching categories while adding a template (`confirmSwitch`).
     */
    onNewTemplateCancel?: () => void;
    /**
     * A function to set or clear the `onNewTemplateCancel` callback function.
     */
    setOnNewTemplateCancel: (callback: (() => void) | undefined) => void;
};

const TemplateCategoryManagementContext = createContext<
    TemplateCategoryManagementContextType | undefined
>(undefined);

export const useTemplateCategoryManagement = () => {
    const messages = useAppTranslation("templateCategoryTranslations");
    const context = useContext(TemplateCategoryManagementContext);
    if (!context) {
        throw new Error(messages.useCategoryContextError);
    }
    return context;
};

export const TemplateCategoryManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const messages = useAppTranslation("templateCategoryTranslations");
    const notifications = useNotifications();

    const [regularCategories, setRegularCategories] = useState<
        TemplateCategory[]
    >([]);
    const [deletedCategory, setDeletedCategory] =
        useState<TemplateCategory | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [currentCategory, setCurrentCategory] =
        useState<TemplateCategory | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<Error | null>(null);
    const [isSwitchWarningOpen, setIsSwitchWarningOpen] = useState(false);
    const [pendingCategory, setPendingCategory] =
        useState<TemplateCategory | null>(null);
    const [isAddingTemplate, setIsAddingTemplate] = useState(false);
    const [onNewTemplateCancel, setOnNewTemplateCancel] = useState<
        (() => void) | undefined
    >(undefined);

    const {
        templateCategoriesQuery,
        createTemplateCategoryMutation,
        updateTemplateCategoryMutation,
        deleteTemplateCategoryMutation,
    } = useTemplateCategoryGraphQL();

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await templateCategoriesQuery();

            if (!response.data) {
                throw new Error(messages.noDataReturned);
            }

            if (response.errors) {
                throw new Error(
                    response.errors.map((err) => err.message).join(", "),
                );
            }

            const data: TemplateCategoriesQuery = response.data;
            logger.log(messages.fetchingCategories);
            logger.log(messages.responseData, data);

            const categories = mapTemplateCategories(data);
            console.log(
                "Fetched categories:",
                JSON.stringify(categories, null, 2),
            );

            // Separate deleted category from regular categories
            const deleted = categories.find(
                (cat) => cat.special_type === "deletion",
            );
            const regular = categories.filter(
                (cat) => cat.special_type !== "deletion",
            );
            setDeletedCategory(deleted || null);
            setRegularCategories(regular);
            setFetchError(null);
            setIsLoading(false);
        } catch (error) {
            logger.error(messages.errorLoadingCategories, error);
        }
    }, []);

    // Add type for API error response
    type ApiErrorResponse = {
        message?: string;
        errors?: {
            general?: string[];
            name?: string[];
            description?: string[];
            parent_category_id?: string[];
            category_id?: string[];
            background?: string[];
            special_type?: string[];
            order?: string[];
            [key: string]: string[] | undefined;
        };
    };

    const addCategory = useCallback(
        async (name: string, parentId?: string) => {
            try {
                const response = await createTemplateCategoryMutation({
                    input: {
                        name,
                        parentCategoryId: parentId,
                    },
                });

                const newCategory = mapTemplateCategory(response.data);
                if (!newCategory) {
                    throw new Error(messages.categoryAddFailed);
                }

                // push the new category to the regular categories, to its parent category
                if (parentId) {
                    setRegularCategories((prev) =>
                        prev.map((cat) => {
                            if (cat.id === parentId) {
                                return {
                                    ...cat,
                                    childCategories: [
                                        ...(cat.childCategories || []),
                                        newCategory,
                                    ],
                                };
                            }
                            return cat;
                        }),
                    );
                } else {
                    setRegularCategories((prev) => [...prev, newCategory]);
                }

                setCurrentCategory(newCategory);
                notifications.show(messages.categoryAddedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.categoryAddFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToCreateCategory, {
                    error: gqlError,
                    name,
                    parentId,
                });
            }
        },
        [messages, notifications],
    );

    const updateCategory = useCallback(
        async (categoryId: string, name: string, parentCategoryId?: string) => {
            try {
                const category = regularCategories.find(
                    (cat) => cat.id === categoryId,
                );
                if (!category) {
                    throw new Error(messages.categoryNotFound);
                }

                const response = await updateTemplateCategoryMutation({
                    id: categoryId,
                    input: {
                        name,
                        parentCategoryId,
                    },
                });

                const updatedCategory = mapTemplateCategory(response.data);
                if (!updatedCategory) {
                    throw new Error(messages.categoryUpdateFailed);
                }

                setRegularCategories((prevCategories) => {
                    const updatedCategories = updateCategoryInTree(
                        prevCategories,
                        updatedCategory,
                        parentCategoryId,
                    );

                    // If the updated category was at the root level and is now a child
                    if (
                        parentCategoryId &&
                        !prevCategories.some((cat) =>
                            cat.childCategories?.some(
                                (child) => child.id === categoryId,
                            ),
                        )
                    ) {
                        return updatedCategories.filter(
                            (cat) => cat.id !== categoryId,
                        );
                    }

                    // If the updated category was a child and is now at root level
                    if (
                        !parentCategoryId &&
                        !updatedCategories.some((cat) => cat.id === categoryId)
                    ) {
                        return [...updatedCategories, updatedCategory];
                    }

                    return updatedCategories;
                });

                notifications.show(messages.categoryUpdatedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.categoryUpdateFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToUpdateCategory, {
                    error: gqlError,
                    categoryId,
                    name,
                });
            }
        },
        [regularCategories, messages, notifications],
    );

    const deleteCategory = useCallback(
        async (categoryId: string) => {
            if (!categoryId) {
                logger.error(messages.invalidCategoryIdProvided, categoryId);
                notifications.show(messages.categoryDeleteFailed, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                return;
            }

            try {
                logger.info(messages.attemptingToDeleteCategory, categoryId);
                const response = await deleteTemplateCategoryMutation({
                    id: categoryId,
                });

                if (response.data?.deleteTemplateCategory) {
                    // Update regular categories
                    setRegularCategories((prevCategories) => {
                        // First find if the category is a child of another category
                        let parentCategory: TemplateCategory | undefined;
                        let isChildCategory = false;

                        for (const cat of prevCategories) {
                            if (
                                cat.childCategories?.some(
                                    (child) => child.id === categoryId,
                                )
                            ) {
                                parentCategory = cat;
                                isChildCategory = true;
                                break;
                            }
                        }

                        if (isChildCategory && parentCategory) {
                            // If it's a child category, update the parent's children
                            return prevCategories.map((cat) => {
                                if (cat.id === parentCategory?.id) {
                                    return {
                                        ...cat,
                                        childCategories:
                                            cat.childCategories?.filter(
                                                (child) =>
                                                    child.id !== categoryId,
                                            ) || [],
                                    };
                                }
                                return cat;
                            });
                        } else {
                            // If it's a root category, just filter it out
                            return prevCategories.filter(
                                (cat) => cat.id !== categoryId,
                            );
                        }
                    });

                    if (currentCategory?.id === categoryId) {
                        setCurrentCategory(null);
                    }

                    notifications.show(messages.categoryDeletedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    logger.info(
                        messages.categoryDeletedSuccessfully,
                        categoryId,
                    );
                } else {
                    throw new Error(messages.failedToDeleteCategory);
                }
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.categoryDeleteFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });

                logger.error(messages.errorDeletingCategory, {
                    categoryId,
                    error: gqlError,
                });
            }
        },
        [
            currentCategory,
            messages,
            notifications,
            deleteTemplateCategoryMutation,
        ],
    );

    const {
        createTemplateMutation,
        updateTemplateMutation,
        moveTemplateToDeletionCategoryMutation,
        restoreTemplateMutation
    } = useTemplateGraphQL();

    // Memoized callbacks for template operations
    const addTemplate = useCallback(
        async (
            name: string,
            categoryId: string,
            description?: string,
            background?: File,
        ) => {
            try {
                const { data } = await createTemplateMutation({
                    input: {
                        name,
                        categoryId,
                        description,
                        backgroundImage: background,
                    },
                });

                const newTemplate = data?.createTemplate
                    ? mapSingleTemplate({ createTemplate: data.createTemplate })
                    : null;

                if (!newTemplate) {
                    throw new Error(messages.templateAddFailed);
                }

                setTemplates((prev) => [...prev, newTemplate]);
                setCurrentTemplate(newTemplate);
                setRegularCategories((prev) =>
                    updateCategoryInTree(prev, {
                        ...currentCategory!,
                        templates: [
                            ...(currentCategory?.templates || []),
                            newTemplate,
                        ],
                    }),
                );

                notifications.show(messages.templateAddedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });

                return newTemplate;
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.templateAddFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToCreateCategory, {
                    error: gqlError,
                    name,
                    categoryId,
                    hasDescription: !!description,
                    hasBackground: !!background,
                });

                throw error;
            }
        },
        [
            messages,
            notifications,
            createTemplateMutation,
            currentCategory,
            setRegularCategories,
        ],
    );

    const updateTemplate = useCallback(
        async (
            id: string,
            updates: {
                name?: string;
                description?: string;
                background?: File;
                category_id?: number;
                order?: number;
            },
        ) => {
            try {
                const { data } = await updateTemplateMutation({
                    id,
                    input: {
                        name: updates.name || "",
                        description: updates.description,
                        categoryId: updates.category_id?.toString() || currentTemplate?.category.id || "",
                        backgroundImage: updates.background,
                        order: updates.order,
                    },
                });

                const updatedTemplate = data?.updateTemplate ? mapSingleTemplate({ updateTemplate: data.updateTemplate }) : null;

                if (!updatedTemplate) {
                    throw new Error(messages.templateUpdateFailed);
                }

                setTemplates((prev) =>
                    prev.map((template) =>
                        template.id === id ? updatedTemplate : template,
                    ),
                );

                setCurrentTemplate(updatedTemplate);

                // Update template in categories tree
                setRegularCategories((prev) =>
                    updateCategoryInTree(prev, {
                        ...currentCategory!,
                        templates: currentCategory?.templates?.map((template) =>
                            template.id === id ? updatedTemplate : template,
                        ) || [],
                    }),
                );

                notifications.show(messages.templateUpdatedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });

                return updatedTemplate;
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.templateUpdateFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.errorUpdatingTemplate, {
                    error: gqlError,
                    templateId: id,
                    updates,
                });

                throw error;
            }
        },
        [messages, notifications, updateTemplateMutation, currentTemplate, currentCategory, setRegularCategories],
    );

    const moveTemplateToDeletionCategory = useCallback(
        async (templateId: string) => {
            try {
                logger.info(messages.movingTemplateToDeletion, templateId);
                const { data } = await moveTemplateToDeletionCategoryMutation({
                    templateId,
                });

                const movedTemplate = data?.moveTemplateToDeletionCategory 
                    ? mapSingleTemplate({ moveToDeletionCategory: data.moveTemplateToDeletionCategory }) 
                    : null;

                if (!movedTemplate) {
                    throw new Error(messages.templateMoveToDeletionFailed);
                }

                // Remove from current templates list
                setTemplates((prev) =>
                    prev.filter((temp) => temp.id !== templateId),
                );

                // Clear current template if it was moved
                if (currentTemplate?.id === templateId) {
                    setCurrentTemplate(null);
                }

                // Remove from regular categories and add to deletion category
                if (deletedCategory) {
                    setRegularCategories((prev) =>
                        updateCategoryInTree(prev, {
                            ...currentCategory!,
                            templates: currentCategory?.templates?.filter(
                                (temp) => temp.id !== templateId,
                            ) || [],
                        }),
                    );

                    setDeletedCategory({
                        ...deletedCategory,
                        templates: [...(deletedCategory.templates || []), movedTemplate],
                    });

                    notifications.show(messages.templateMovedToDeletionSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                }
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.templateMoveToDeletionFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.errorMovingToDeletion, {
                    error: gqlError,
                    templateId,
                });

                throw error;
            }
        },
        [
            messages,
            notifications,
            moveTemplateToDeletionCategoryMutation,
            currentTemplate,
            currentCategory,
            deletedCategory,
            setRegularCategories,
            setDeletedCategory,
        ],
    );

    const restoreTemplate = useCallback(
        async (templateId: string) => {
            try {            logger.info("Restoring template", templateId);
            const { data } = await restoreTemplateMutation({
                templateId,
            });

                const restoredTemplate = data?.restoreTemplate 
                    ? mapSingleTemplate({ restoreTemplate: data.restoreTemplate }) 
                    : null;

                if (!restoredTemplate) {
                    throw new Error(messages.templateRestoreFailed);
                }

                // Remove from deletion category
                if (deletedCategory) {
                    setDeletedCategory({
                        ...deletedCategory,
                        templates: deletedCategory.templates?.filter(
                            (temp) => temp.id !== templateId,
                        ) || [],
                    });
                }

                // Add to regular categories
                setRegularCategories((prev) => {
                    const targetCategory = prev.find(cat => cat.id === restoredTemplate.category.id);
                    if (targetCategory) {
                        return updateCategoryInTree(prev, {
                            ...targetCategory,
                            templates: [...(targetCategory.templates || []), restoredTemplate],
                        });
                    }
                    return prev;
                });

                // Update current template and templates list if we're in the target category
                if (currentCategory?.id === restoredTemplate.category.id) {
                    setTemplates(prev => [...prev, restoredTemplate]);
                    setCurrentTemplate(restoredTemplate);
                }

                notifications.show(messages.templateRestoredSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                const gqlError = error as {
                    message?: string;
                    graphQLErrors?: Array<{ message: string }>;
                };
                const errorMessage =
                    gqlError.graphQLErrors?.[0]?.message ||
                    gqlError.message ||
                    messages.templateRestoreFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.errorRestoringTemplate, {
                    error: gqlError,
                    templateId,
                });

                throw error;
            }
        },
        [
            messages,
            notifications,
            restoreTemplateMutation,
            currentCategory,
            deletedCategory,
            setRegularCategories,
            setDeletedCategory,
        ],
    );

    // Sorting functions
    const sortCategories = useCallback(
        (sortBy: "name" | "id", order: "asc" | "desc") => {
            setRegularCategories((prev) =>
                [...prev].sort((a, b) => {
                    const modifier = order === "asc" ? 1 : -1;
                    if (sortBy === "name") {
                        return modifier * a.name.localeCompare(b.name);
                    }
                    return modifier * (Number(a.id) - Number(b.id));
                }),
            );
        },
        [],
    );

    const sortTemplates = useCallback(
        (sortBy: "name" | "id", order: "asc" | "desc") => {
            setTemplates((prev) =>
                [...prev].sort((a, b) => {
                    const modifier = order === "asc" ? 1 : -1;
                    if (sortBy === "name") {
                        return modifier * a.name.localeCompare(b.name);
                    }
                    return modifier * (Number(a.id) - Number(b.id));
                }),
            );
        },
        [],
    );

    // Category switching logic
    const trySelectCategory = useCallback(
        async (category: TemplateCategory | null): Promise<boolean> => {
            if (isAddingTemplate) {
                setIsSwitchWarningOpen(true);
                setPendingCategory(category);
                return false;
            }

            setCurrentCategory(category);
            if (category) {
                setTemplates(category.templates || []);
            } else {
                setTemplates([]);
            }
            return true;
        },
        [isAddingTemplate],
    );

    const closeSwitchWarning = useCallback(() => {
        setIsSwitchWarningOpen(false);
        setPendingCategory(null);
    }, []);

    const confirmSwitch = useCallback(() => {
        if (onNewTemplateCancel) {
            onNewTemplateCancel();
        }
        setIsAddingTemplate(false);
        setCurrentCategory(pendingCategory);
        if (pendingCategory) {
            setTemplates(pendingCategory.templates || []);
        } else {
            setTemplates([]);
        }
        closeSwitchWarning();
    }, [pendingCategory, onNewTemplateCancel, closeSwitchWarning]);

    // Initial fetch
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const value = useMemo(
        () => ({
            fetchCategories,
            fetchError,
            regularCategories,
            deletedCategory,
            currentCategory,
            setCurrentCategory,
            trySelectCategory,
            isSwitchWarningOpen,
            closeSwitchWarning,
            confirmSwitch,
            addCategory,
            updateCategory,
            deleteCategory,
            moveTemplateToDeletionCategory,
            restoreTemplate,
            sortCategories,
            templates,
            currentTemplate,
            setCurrentTemplate,
            addTemplate,
            updateTemplate,
            sortTemplates,
            isAddingTemplate,
            setIsAddingTemplate,
            onNewTemplateCancel,
            setOnNewTemplateCancel,
        }),
        [
            fetchCategories,
            fetchError,
            regularCategories,
            deletedCategory,
            currentCategory,
            trySelectCategory,
            isSwitchWarningOpen,
            closeSwitchWarning,
            confirmSwitch,
            addCategory,
            updateCategory,
            deleteCategory,
            moveTemplateToDeletionCategory,
            restoreTemplate,
            sortCategories,
            templates,
            currentTemplate,
            addTemplate,
            updateTemplate,
            sortTemplates,
            isAddingTemplate,
            onNewTemplateCancel,
        ],
    );

    return (
        <>
            {isLoading || !regularCategories ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <TemplateCategoryManagementContext.Provider value={value}>
                        {children}
                    </TemplateCategoryManagementContext.Provider>
                    <Dialog
                        open={isSwitchWarningOpen}
                        onClose={closeSwitchWarning}
                    >
                        <DialogTitle>
                            {messages.confirmSwitchCategory}
                        </DialogTitle>
                        <DialogContent>
                            {messages.switchCategoryWhileAddingTemplate}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeSwitchWarning}>
                                {messages.cancel}
                            </Button>
                            <Button onClick={confirmSwitch} color="primary">
                                {messages.confirm}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
};

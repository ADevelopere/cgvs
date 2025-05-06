"use client";

import React, {
    useMemo,
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import { CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import useAppTranslation from "@/locale/useAppTranslation";
import { useNotifications } from "@toolpad/core/useNotifications";
import axios from "@/utils/axios";
import { TemplateCategory } from "@/graphql/generated/types";
import { Template } from "./template.types";

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
    deletedCategory: TemplateCategory | null;
    /**
     * An array containing all the available template categories.
     * This list is populated by `fetchCategories` and updated dynamically when categories are added, updated, or deleted.
     */
    categories: TemplateCategory[];
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
     * This removes the template from the backend and updates the local `templates` and `categories` states. If the deleted template was the `currentTemplate`, the selection is cleared.
     */
    deleteTemplate(templateId: string): void;
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
    const context = useContext(TemplateCategoryManagementContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
};

export const TemplateCategoryManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const messages = useAppTranslation("templateCategoryTranslations");
    const notifications = useNotifications();

    const [categories, setCategories] = useState<TemplateCategory[]>([]);
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

    // Memoized callbacks for category operations
    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            logger.log(messages.fetchingCategories);
            const response = await axios.get("/admin/template-categories");
            logger.log(messages.rawApiResponse, response);
            logger.log(messages.responseDataType, typeof response.data);
            logger.log(messages.responseData, response.data);
            if (!Array.isArray(response.data)) {
                logger.error(messages.expectedArrayButReceived, response.data);
                throw new Error(messages.invalidDataFormat);
            }
            const { data } = response;

            // Separate deleted category from regular categories
            const deleted = data.find((cat) => cat.special_type === "deleted");
            const regular = data.filter(
                (cat) => cat.special_type !== "deleted",
            );

            setCategories(data); // Keep original state for backward compatibility
            setDeletedCategory(deleted || null);
            setRegularCategories(regular);
            setFetchError(null);
        } catch (error) {
            setFetchError(error as Error);
            notifications.show(messages.errorLoadingCategories, {
                severity: "error",
                autoHideDuration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [messages.errorLoadingCategories, notifications]);

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
                const { data: newCategory } =
                    await axios.post<TemplateCategory>(
                        "/admin/template-categories",
                        {
                            name,
                            parent_category_id: parentId,
                            visible: true,
                        },
                    );

                setCategories((prev) => [...prev, newCategory]);
                setCurrentCategory(newCategory);
                notifications.show(messages.categoryAddedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    apiError.response?.data?.errors?.name?.[0] ||
                    apiError.response?.data?.errors?.parent_category_id?.[0] ||
                    apiError.response?.data?.errors?.special_type?.[0] ||
                    messages.categoryAddFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToCreateCategory, {
                    error: apiError.response?.data,
                    name,
                    parentId,
                });
            }
        },
        [messages, notifications],
    );

    const updateCategory = useCallback(
        async (categoryId: string, name: string) => {
            try {
                const category = categories.find(
                    (cat) => cat.id === categoryId,
                );
                if (!category) {
                    throw new Error(messages.categoryNotFound);
                }

                const { data: updatedCategory } =
                    await axios.put<TemplateCategory>(
                        `/admin/template-categories/${categoryId}`,
                        {
                            ...category,
                            name,
                        },
                    );

                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.id === updatedCategory.id ? updatedCategory : cat,
                    ),
                );
                notifications.show(messages.categoryUpdatedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    apiError.response?.data?.errors?.name?.[0] ||
                    apiError.response?.data?.errors?.parent_category_id?.[0] ||
                    messages.categoryUpdateFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToUpdateCategory, {
                    error: apiError.response?.data,
                    categoryId,
                    name,
                });
            }
        },
        [categories, messages, notifications],
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
                const response = await axios.delete(
                    `/admin/template-categories/${categoryId}`,
                );

                if (response.status >= 200 && response.status < 300) {
                    setCategories((prev) =>
                        prev.filter((cat) => cat.id !== categoryId),
                    );
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
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    messages.categoryDeleteFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });

                logger.error("Failed to delete category:", {
                    categoryId,
                    error: apiError.response?.data,
                });
            }
        },
        [currentCategory, messages, notifications],
    );

    // Memoized callbacks for template operations
    const addTemplate = useCallback(
        async (
            name: string,
            categoryId: string,
            description?: string,
            background?: File,
        ) => {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("category_id", categoryId.toString());
                if (description) {
                    formData.append("description", description);
                }
                if (background) {
                    formData.append("background", background);
                }

                const { data: newTemplate } = await axios.post<Template>(
                    "/admin/templates",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                setTemplates((prev) => [...prev, newTemplate]);
                setCurrentTemplate(newTemplate);
                notifications.show(messages.templateAddedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });

                return newTemplate;
            } catch (error: unknown) {
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    apiError.response?.data?.errors?.name?.[0] ||
                    apiError.response?.data?.errors?.description?.[0] ||
                    apiError.response?.data?.errors?.category_id?.[0] ||
                    apiError.response?.data?.errors?.background?.[0] ||
                    messages.templateAddFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error(messages.failedToCreateCategory, {
                    error: apiError.response?.data,
                    name,
                    categoryId,
                    hasDescription: !!description,
                    hasBackground: !!background,
                });

                throw error; // Re-throw to allow caller to handle the error
            }
        },
        [messages, notifications],
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
                const formData = new FormData();

                // Append each update field to formData
                Object.entries(updates).forEach(([key, value]) => {
                    if (value !== undefined) {
                        if (value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, value.toString());
                        }
                    }
                });

                const { data: updatedTemplate } = await axios.put<Template>(
                    `/admin/templates/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                setTemplates((prev) =>
                    prev.map((temp) =>
                        temp.id === updatedTemplate.id ? updatedTemplate : temp,
                    ),
                );

                if (currentTemplate?.id === updatedTemplate.id) {
                    setCurrentTemplate(updatedTemplate);
                }

                notifications.show(messages.templateUpdatedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });

                return updatedTemplate;
            } catch (error: unknown) {
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    apiError.response?.data?.errors?.name?.[0] ||
                    apiError.response?.data?.errors?.description?.[0] ||
                    apiError.response?.data?.errors?.category_id?.[0] ||
                    apiError.response?.data?.errors?.background?.[0] ||
                    apiError.response?.data?.errors?.order?.[0] ||
                    messages.templateUpdateFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error("Failed to update template:", {
                    error: apiError.response?.data,
                    id,
                    updates,
                });

                throw error; // Re-throw to allow caller to handle the error
            }
        },
        [messages, notifications, currentTemplate],
    );

    const deleteTemplate = useCallback(
        async (templateId: string) => {
            try {
                logger.info("Attempting to delete template:", templateId);
                const response = await axios.delete(
                    `/admin/templates/${templateId}`,
                );

                if (response.status >= 200 && response.status < 300) {
                    setTemplates((prev) =>
                        prev.filter(
                            (temp) => temp.id.toString() !== templateId,
                        ),
                    );

                    if (currentTemplate?.id.toString() === templateId) {
                        setCurrentTemplate(null);
                    }

                    // Add template to deleted category if it exists
                    if (response.data?.template && deletedCategory) {
                        const deletedTemplate = response.data.template;
                        const parentCategoryId = deletedTemplate.category_id;
                        
                        // Update only the parent category by removing the template
                        setRegularCategories((prev) =>
                            prev.map((cat) => {
                                if (cat.id === parentCategoryId) {
                                    return {
                                        ...cat,
                                        templates: (cat.templates || []).filter(
                                            (temp) => temp.id.toString() !== templateId
                                        ),
                                    };
                                }
                                return cat;
                            })
                        );

                        // Update the deleted category state
                        setDeletedCategory((prev) => prev ? {
                            ...prev,
                            templates: [...(prev.templates || []), deletedTemplate],
                        } : prev);

                        // Update all categories (maintain backward compatibility)
                        setCategories((prev) =>
                            prev.map((cat) =>
                                cat.specialType === "DELETION"
                                    ? {
                                          ...cat,
                                          templates: [
                                              ...(cat.templates || []),
                                              deletedTemplate,
                                          ],
                                      }
                                    : cat.id === parentCategoryId
                                        ? {
                                            ...cat,
                                            templates: (cat.templates || []).filter(
                                                (temp) => temp.id.toString() !== templateId
                                            ),
                                        }
                                        : cat
                            ),
                        );
                    }

                    notifications.show(messages.templateDeletedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });

                    logger.info("Template deleted successfully:", templateId);
                } else {
                    throw new Error("Failed to delete template");
                }
            } catch (error: unknown) {
                const apiError = error as {
                    response?: { data: ApiErrorResponse };
                };
                const errorMessage =
                    apiError.response?.data?.message ||
                    apiError.response?.data?.errors?.general?.[0] ||
                    messages.templateDeleteFailed;

                notifications.show(errorMessage, {
                    severity: "error",
                    autoHideDuration: 5000,
                });
                logger.error("Failed to delete template:", {
                    error: apiError.response?.data,
                    templateId,
                });

                throw error; // Re-throw to allow caller to handle the error
            }
        },
        [currentTemplate, messages, notifications, deletedCategory],
    );

    // Sorting functions
    const sortCategories = useCallback(
        (sortBy: "name" | "id", order: "asc" | "desc") => {
            setCategories((prev) =>
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
            categories,
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
            sortCategories,
            templates,
            currentTemplate,
            setCurrentTemplate,
            addTemplate,
            updateTemplate,
            deleteTemplate,
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
            categories,
            currentCategory,
            trySelectCategory,
            isSwitchWarningOpen,
            closeSwitchWarning,
            confirmSwitch,
            addCategory,
            updateCategory,
            deleteCategory,
            sortCategories,
            templates,
            currentTemplate,
            addTemplate,
            updateTemplate,
            deleteTemplate,
            sortTemplates,
            isAddingTemplate,
            onNewTemplateCancel,
        ],
    );

    return (
        <>
            {isLoading || !categories ? (
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

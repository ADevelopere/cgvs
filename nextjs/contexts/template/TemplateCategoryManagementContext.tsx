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
    UpdateTemplateMutationVariables,
    useTemplateCategoriesQuery,
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
    buildCategoryHierarchy,
    getSerializableCategories,
    getSerializableTemplateCategory,
    mapTemplateCategories,
    mapTemplateCategory,
} from "@/utils/template/template-category-mapper";
import { useTemplateCategoryGraphQL } from "./TemplateCategoryGraphQLContext";
import { useTemplateGraphQL } from "./TemplateGraphQLContext";
import { mapSingleTemplate } from "@/utils/template/template-mappers";
import { useRouter } from "next/navigation";

// Logger utility
const logger = {
    enabled: process.env.NODE_ENV === "development" && false,
    log: (...args: any[]) => {
        if (logger.enabled) {
            logger.log(...args);
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

// Helper function to find a category in a hierarchical tree by ID
const findCategoryInTreeById = (
    categories: TemplateCategory[],
    categoryId: number,
): TemplateCategory | null => {
    for (const category of categories) {
        if (category.id === categoryId) {
            return category;
        }
        if (category.childCategories && category.childCategories.length > 0) {
            const foundInChildren = findCategoryInTreeById(
                category.childCategories,
                categoryId,
            );
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }
    return null;
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
     * An array containing all the template categories fetched from the backend.
     * This list is populated by `fetchCategories` and updated dynamically when categories are added, updated, or deleted.
     */
    allTemplates: Template[];
    /**
     * An array containing all the regular template categories (excluding the deleted category).
     * This list is populated by `fetchCategories` and updated dynamically when categories are added, updated, or deleted.
     */
    regularCategories: TemplateCategory[];
    /**
     * Represents the special deleted category (special_type='deleted') that holds trashed templates.
     * This is a single category object that serves as a parent for all deleted templates.
     */
    suspensionCategory: TemplateCategory | null;
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
    createCategory: (name: string, parentId?: number) => void;
    /**
     * Updates the name of an existing template category identified by its ID.
     * This modifies the category's name in the backend and updates the corresponding category in the local `categories` state.
     */
    updateCategory: (
        category: TemplateCategory,
        parentCategoryId?: number | null,
    ) => void;
    /**
     * Deletes a template category identified by its ID.
     * This removes the category from the backend and the local `categories` state. If the deleted category was the `currentCategory`, the selection is cleared.
     */
    deleteCategory: (categoryId: number) => void;
    /**
     * Sorts the `categories` array based on the specified field ('name' or 'id') and order ('asc' or 'desc').
     * This function reorders the categories list displayed to the user.
     */
    // sortCategories: (sortBy: "name" | "id", order: "asc" | "desc") => void;

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
    createTemplate: (name: string, categoryId: number) => void;
    /**
     * Updates the name of an existing template identified by its ID.
     * This modifies the template's name in the backend and updates the corresponding template in the local `templates` and `categories` states.
     */
    updateTemplate: (
        input: UpdateTemplateMutationVariables,
    ) => Promise<Template | null>;

    /**
     * Deletes a template identified by its ID.
     * This changes the templates's parent category to the deletion category.
     */
    suspendTemplate(templateId: number): void;
    /**
     * Restores a template from the deletion category back to its original category.
     * This will move the template from the deletion category to the specified category and update both categories.
     */
    unsuspendTemplate: (templateId: number) => Promise<void>;

    /**
     * Sorts the `templates` array (associated with the `currentCategory`) based on the specified field ('name' or 'id') and order ('asc' or 'desc').
     * This function reorders the templates list displayed to the user for the selected category.
     */
    // sortTemplates: (sortBy: "name" | "id", order: "asc" | "desc") => void;

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

    templateToManage?: Template;
    manageTemplate: (templateId: number) => void;
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

    const router = useRouter();
    const [templateToManage, setTemplateToManage] = useState<
        Template | undefined
    >(undefined);

    const {
        data: apolloCategoryData,
        loading: apolloLoading,
        error: apolloError,
        refetch: refetchCategoriesQuery,
    } = useTemplateCategoriesQuery();

    const [currentCategoryState, setCurrentCategoryState] =
        useState<TemplateCategory | null>(null);

    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(
        null,
    );
    const [isSwitchWarningOpen, setIsSwitchWarningOpen] = useState(false);
    const [pendingCategory, setPendingCategory] =
        useState<TemplateCategory | null>(null);
    const [isAddingTemplate, setIsAddingTemplate] = useState(false);
    const [onNewTemplateCancel, setOnNewTemplateCancel] = useState<
        (() => void) | undefined
    >(undefined);

    const [categorySortConfig, setCategorySortConfig] = useState<{
        sortBy: "name" | "id" | "order";
        order: "asc" | "desc";
    }>({ sortBy: "order", order: "asc" });

    const [templateSortConfig, setTemplateSortConfig] = useState<{
        sortBy: "name" | "id" | "order";
        order: "asc" | "desc";
    }>({ sortBy: "order", order: "asc" });

    const allCategoriesFromCache = useMemo(() => {
        if (!apolloCategoryData?.templateCategories) {
            return [];
        }
        const mapped = mapTemplateCategories({
            templateCategories: apolloCategoryData.templateCategories,
        });
        return buildCategoryHierarchy(mapped);
    }, [apolloCategoryData]);

    const allTemplatesFromCache = useMemo(() => {
        if (!apolloCategoryData?.templateCategories) {
            return [];
        }
        const mapped = mapTemplateCategories({
            templateCategories: apolloCategoryData.templateCategories,
        });
        const allTemplates = mapped.flatMap((category) => {
            if (category.templates) {
                return category.templates.map((template) => ({
                    ...template,
                    category: category,
                }));
            }

            console.log(
                "No templates found in category:",
                JSON.stringify(
                    getSerializableTemplateCategory(category),
                    null,
                    2,
                ),
            );
            return [];
        });

        logger.log("All templates from cache:", allTemplates);
        return allTemplates;
    }, [apolloCategoryData]);

    const regularCategoriesFromCache = useMemo(() => {
        const regularCategories = allCategoriesFromCache.filter(
            (cat) => cat.categorySpecialType !== "Suspension",
        );
        logger.log(
            "Regular categories from cache:",
            JSON.stringify(
                getSerializableCategories(regularCategories),
                null,
                2,
            ),
        );
        return regularCategories;
    }, [allCategoriesFromCache]);

    const suspensionCategoryFromCache = useMemo(() => {
        const suspensionCategory =
            allCategoriesFromCache.find(
                (cat) => cat.categorySpecialType === "Suspension",
            ) || null;
        if (suspensionCategory) {
            logger.log(
                "Deletion category from cache:",
                JSON.stringify(
                    getSerializableTemplateCategory(suspensionCategory),
                    null,
                    2,
                ),
            );
        } else {
            logger.log("No deletion category found in cache.");
        }
        return suspensionCategory;
    }, [allCategoriesFromCache]);

    const sortedRegularCategories = useMemo(() => {
        return [...regularCategoriesFromCache].sort((a, b) => {
            const modifier = categorySortConfig.order === "asc" ? 1 : -1;
            if (categorySortConfig.sortBy === "name") {
                return modifier * a.name.localeCompare(b.name);
            }
            return modifier * (Number(a.id) - Number(b.id));
        });
    }, [regularCategoriesFromCache, categorySortConfig]);

    // Effect to keep currentCategoryState synchronized with the actual object from the cache
    useEffect(() => {
        if (currentCategoryState?.id && allCategoriesFromCache.length > 0) {
            const freshCategory = findCategoryInTreeById(
                allCategoriesFromCache,
                currentCategoryState.id,
            );
            if (freshCategory && freshCategory !== currentCategoryState) {
                // Only update if the reference differs, assuming cache provides stable references
                // or if a deep comparison indicates changes. For simplicity, we check reference.
                // A more robust check might involve JSON.stringify or a version number if available.
                const freshCategorySerialized =
                    getSerializableTemplateCategory(freshCategory);
                const currentCategorySerialized =
                    getSerializableTemplateCategory(currentCategoryState);

                logger.log(
                    "Fresh category:",
                    JSON.stringify(freshCategorySerialized, null, 2),
                );
                logger.log(
                    "Current category:",
                    JSON.stringify(currentCategorySerialized, null, 2),
                );
                if (
                    JSON.stringify(freshCategorySerialized, null, 2) !==
                    JSON.stringify(currentCategorySerialized, null, 2)
                ) {
                    setCurrentCategoryState(freshCategory);
                }
            } else if (!freshCategory && currentCategoryState) {
                // Category no longer exists in cache (e.g., deleted)
                setCurrentCategoryState(null);
            }
        }
    }, [allCategoriesFromCache, currentCategoryState?.id]); // currentCategoryState itself is not in dep array to avoid loops

    const {
        createTemplateCategoryMutation,
        updateTemplateCategoryMutation,
        deleteTemplateCategoryMutation,
    } = useTemplateCategoryGraphQL();

    const fetchCategories = useCallback(async () => {
        try {
            await refetchCategoriesQuery();
        } catch (error) {
            logger.error(messages.errorLoadingCategories, error);
            // apolloError from useQuery will also reflect this
        }
    }, [refetchCategoriesQuery, messages]);

    const setCurrentCategory = useCallback(
        (category: TemplateCategory | null) => {
            setCurrentCategoryState(category);
            setCurrentTemplate(null); // Reset template when category changes
        },
        [],
    );

    const createCategory = useCallback(
        async (name: string, parentId?: number) => {
            try {
                const response = await createTemplateCategoryMutation({
                    input: { name, parentCategoryId: parentId },
                });
                const newCategoryData = response.data?.createTemplateCategory;
                if (newCategoryData) {
                    // The cache is updated by the mutation's `update` function.
                    // The useEffect for currentCategoryState will sync if it becomes current.
                    // For now, we map and set. A more robust way is to find it from the updated allCategoriesFromCache.
                    const newCategoryObject = mapTemplateCategory({
                        createTemplateCategory: newCategoryData,
                    });
                    if (newCategoryObject) {
                        setCurrentCategory(newCategoryObject);
                    }
                    notifications.show(messages.categoryAddedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                } else {
                    throw new Error(messages.categoryAddFailed);
                }
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
        [
            createTemplateCategoryMutation,
            setCurrentCategory,
            notifications,
            messages,
        ],
    );

    const updateCategory = useCallback(
        async (
            category: TemplateCategory,
            parentCategoryId?: number | null,
        ) => {
            try {
                const response = await updateTemplateCategoryMutation({
                    input: {
                        id: category.id,
                        name: category.name,
                        description: category.description,
                        parentCategoryId: parentCategoryId,
                    },
                });
                // Cache updated by Apollo.
                // The useEffect for currentCategoryState will refresh its instance if it's the one updated.
                if (
                    response.data?.updateTemplateCategory &&
                    currentCategoryState?.id === category.id
                ) {
                    // Optionally, explicitly set current category if it was the one updated,
                    // though the useEffect should handle it.
                    // const updatedCat = mapTemplateCategory({updateTemplateCategory: response.data.updateTemplateCategory});
                    // if(updatedCat) setCurrentCategory(updatedCat);
                }
                notifications.show(messages.categoryUpdatedSuccessfully, {
                    severity: "success",
                    autoHideDuration: 3000,
                });
            } catch (error: unknown) {
                // ... (existing error handling)
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
                    category: category,
                    parentCategoryId: parentCategoryId,
                });
            }
        },
        [
            updateTemplateCategoryMutation,
            currentCategoryState?.id,
            notifications,
            messages /*, setCurrentCategory (if used)*/,
        ],
    );

    const deleteCategory = useCallback(
        async (categoryId: number) => {
            try {
                logger.info(messages.attemptingToDeleteCategory, categoryId);
                await deleteTemplateCategoryMutation({ id: categoryId });
                // Cache updated by Apollo.
                if (currentCategoryState?.id === categoryId) {
                    setCurrentCategory(null);
                }
                notifications.show(messages.categoryDeletedSuccessfully, {
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
            deleteTemplateCategoryMutation,
            currentCategoryState?.id,
            setCurrentCategory,
            notifications,
            messages,
        ],
    );

    const templatesForCurrentCategory = useMemo(() => {
        if (!currentCategoryState?.templates) return [];
        const unsortedTemplates = Array.isArray(currentCategoryState.templates)
            ? [...currentCategoryState.templates]
            : [];

        unsortedTemplates.forEach((template) => {
            template.category = currentCategoryState;
        });

        return unsortedTemplates.sort((a, b) => {
            const modifier = templateSortConfig.order === "asc" ? 1 : -1;
            if (templateSortConfig.sortBy === "name") {
                return modifier * a.name.localeCompare(b.name);
            }
            return modifier * (Number(a.id) - Number(b.id));
        });
    }, [currentCategoryState?.templates, templateSortConfig]);

    const {
        createTemplateMutation,
        updateTemplateMutation,
        suspendTemplateMutation,
        unsuspendTemplateMutation,
    } = useTemplateGraphQL();
    const createTemplate = useCallback(
        async (name: string, categoryId: number, description?: string) => {
            try {
                const response = await createTemplateMutation({
                    input: {
                        name,
                        categoryId,
                        description,
                    },
                });
                // Cache updated by Apollo. currentCategoryState.templates should reflect this.
                const newTemplateData = response.data?.createTemplate;
                if (newTemplateData) {
                    const newTemplate = mapSingleTemplate({
                        createTemplate: newTemplateData,
                    });
                    if (newTemplate) {
                        setCurrentTemplate(newTemplate);
                    }
                    notifications.show(messages.templateAddedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return newTemplate;
                } else {
                    throw new Error(messages.templateAddFailed);
                }
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
                });

                throw error;
            }
        },
        [createTemplateMutation, setCurrentTemplate, notifications, messages],
    );

    const updateTemplate = useCallback(
        async (variables: UpdateTemplateMutationVariables) => {
            try {
                const templateToUpdate = templatesForCurrentCategory.find(
                    (temp) => temp.id === variables.input.id,
                );
                const response = await updateTemplateMutation(variables);
                // Cache updated by Apollo.
                const updatedTemplateData = response.data?.updateTemplate;
                if (updatedTemplateData) {
                    const updatedTemplate = mapSingleTemplate(
                        { updateTemplate: updatedTemplateData },
                        templateToUpdate || undefined,
                    );
                    if (updatedTemplate) {
                        setCurrentTemplate(updatedTemplate);
                    }
                    notifications.show(messages.templateUpdatedSuccessfully, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });

                    return updatedTemplate;
                } else {
                    throw new Error(messages.templateUpdateFailed);
                }
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
                    variables: variables,
                });

                return null;
            }
        },
        [
            updateTemplateMutation,
            templatesForCurrentCategory,
            currentTemplate,
            setCurrentTemplate,
            notifications,
            messages,
        ],
    );

    const suspendTemplate = useCallback(
        async (templateId: number) => {
            try {
                logger.info(messages.movingTemplateToDeletion, templateId);
                await suspendTemplateMutation({ id: templateId });
                // Cache updated by Apollo.
                if (currentTemplate?.id === templateId) {
                    setCurrentTemplate(null);
                }
                notifications.show(
                    messages.templateMovedToDeletionSuccessfully,
                    {
                        severity: "success",
                        autoHideDuration: 3000,
                    },
                );
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
            suspendTemplateMutation,
            currentTemplate?.id,
            setCurrentTemplate,
            notifications,
            messages,
        ],
    );

    const unsuspendTemplate = useCallback(
        async (templateId: number) => {
            try {
                logger.info("Restoring template", templateId);
                await unsuspendTemplateMutation({ id: templateId });
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
            unsuspendTemplateMutation,
            currentCategoryState?.id,
            setCurrentTemplate,
            notifications,
            messages,
        ],
    );

    const manageTemplate = useCallback(
        (templateId: number) => {
            const template = allTemplatesFromCache.find(
                (t) => t.id === templateId,
            );
            if (!template) {
                console.error("Template not found");
                return;
            }
            setTemplateToManage(template);
            router.push(`/admin/templates/${templateId}/manage`);
        },
        [router, allTemplatesFromCache],
    );

    // Sorting functions
    const sortCategories = useCallback(
        (sortBy: "name" | "id", order: "asc" | "desc") => {
            setCategorySortConfig({ sortBy, order });
        },
        [],
    );

    const sortTemplates = useCallback(
        (sortBy: "name" | "id", order: "asc" | "desc") => {
            setTemplateSortConfig({ sortBy, order });
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
            setCurrentCategory(category); // category object should be from sortedRegularCategories
            return true;
        },
        [isAddingTemplate, setCurrentCategory],
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
        setCurrentCategory(pendingCategory); // pendingCategory object should be from sortedRegularCategories
        closeSwitchWarning();
    }, [
        pendingCategory,
        onNewTemplateCancel,
        closeSwitchWarning,
        setCurrentCategory,
    ]);

    // Initial fetch
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const value: TemplateCategoryManagementContextType = useMemo(
        () => ({
            fetchCategories,
            fetchError: apolloError || null,
            regularCategories: sortedRegularCategories,
            suspensionCategory: suspensionCategoryFromCache,
            currentCategory: currentCategoryState,
            setCurrentCategory,
            trySelectCategory,
            isSwitchWarningOpen,
            closeSwitchWarning,
            confirmSwitch,
            createCategory,
            updateCategory,
            deleteCategory,
            suspendTemplate,
            unsuspendTemplate,
            // sortCategories,
            allTemplates: allTemplatesFromCache,
            currentTemplate,
            setCurrentTemplate,
            createTemplate,
            updateTemplate,
            // sortTemplates,
            isAddingTemplate,
            setIsAddingTemplate,
            onNewTemplateCancel,
            setOnNewTemplateCancel,
            manageTemplate,
            templateToManage,
        }),
        [
            fetchCategories,
            apolloError,
            sortedRegularCategories,
            suspensionCategoryFromCache,
            currentCategoryState,
            setCurrentCategory,
            trySelectCategory,
            isSwitchWarningOpen,
            closeSwitchWarning,
            confirmSwitch,
            createCategory,
            updateCategory,
            deleteCategory,
            suspendTemplate,
            unsuspendTemplate,
            // sortCategories,
            allTemplatesFromCache,
            templatesForCurrentCategory,
            currentTemplate, // setCurrentTemplate is stable
            createTemplate,
            updateTemplate,
            // sortTemplates,
            isAddingTemplate, // setIsAddingTemplate is stable
            onNewTemplateCancel, // setOnNewTemplateCancel is stable
            manageTemplate,
            templateToManage,
        ],
    );

    return (
        <>
            {apolloLoading || !sortedRegularCategories ? (
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

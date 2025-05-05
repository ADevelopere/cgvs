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
import { Template, TemplateCategory } from "./template.types";
import useAppTranslation from "@/locale/useAppTranslation";
import axios from "@/utils/axios";
import { useNotifications } from "@toolpad/core/useNotifications";

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
    // category
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
     * Toggles the visibility status of a specific template category identified by its ID.
     * This updates the category's `visible` property in the backend and reflects the change in the local `categories` state.
     */
    toggleCategoryVisibility: (categoryId: string) => void;
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
    updateTemplate: (id: string, name: string) => void;
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
    const messeges = useAppTranslation("templateCategoryTranslations");
    const notifications = useNotifications();

    const [categories, setCategories] = useState<TemplateCategory[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [currentCategory, setCurrentCategory] =
        useState<TemplateCategory | null>(null);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<Error | null>(null);
    const [isAddingTemplate, setIsAddingTemplate] = useState(false);
    const [isSwitchWarningOpen, setIsSwitchWarningOpen] = useState(false);
    const [pendingCategory, setPendingCategory] =
        useState<TemplateCategory | null>(null);
    const [onNewTemplateCancel, setOnNewTemplateCancel] = useState<
        (() => void) | undefined
    >(undefined);

    const onSelectCategory = useCallback(
        (category: TemplateCategory | null) => {
            setCurrentCategory(category);
            if (category) {
                setTemplates(
                    (category.templates ?? []).filter(
                        (template): template is Template => template !== null,
                    ),
                );
            } else {
                setTemplates([]);
            }
            setCurrentTemplate(null);
        },
        [setCurrentCategory],
    );

    const closeSwitchWarning = useCallback(() => {
        setIsSwitchWarningOpen(false);
        setPendingCategory(null);
    }, []);

    const confirmSwitch = useCallback(() => {
        onNewTemplateCancel?.(); // Call cancel callback if exists
        setIsAddingTemplate(false);
        onSelectCategory(pendingCategory);
        setIsSwitchWarningOpen(false);
        setPendingCategory(null);
        setOnNewTemplateCancel(undefined); // Clear the callback
    }, [onSelectCategory, pendingCategory, onNewTemplateCancel]);

    const value = useMemo(() => {}, []);

    return (
        <>
            {isLoading ? (
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
                            {messeges.confirmSwitchCategory}
                        </DialogTitle>
                        <DialogContent>
                            {messeges.switchCategoryWhileAddingTemplate}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeSwitchWarning}>
                                {messeges.cancel}
                            </Button>
                            <Button onClick={confirmSwitch} color="primary">
                                {messeges.confirm}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
};

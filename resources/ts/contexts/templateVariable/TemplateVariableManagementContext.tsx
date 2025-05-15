"use client";

import * as Graphql from "@/graphql/generated/types";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from "react";
import { useBlocker } from "react-router-dom";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    TemplateVariableGraphQLProvider,
    useTemplateVariableGraphQL,
} from "./TemplateVariableGraphQLContext";
import { useTemplateManagement } from "../template/TemplateManagementContext";
import { TemplateVariableType } from "@/graphql/generated/types";

type FormMode = "create" | "edit";

type EditingVariable = {
    id: string;
    type: TemplateVariableType;
};

type FormPaneState = {
    mode: FormMode;
    // For edit mode
    editingVariable: EditingVariable | null;
    // For create mode
    createType: TemplateVariableType | null;
};

export type TemplateVariableTemporaryValue =
    | Partial<Graphql.UpdateTextTemplateVariableInput>
    | Partial<Graphql.UpdateNumberTemplateVariableInput>
    | Partial<Graphql.UpdateDateTemplateVariableInput>
    | Partial<Graphql.UpdateSelectTemplateVariableInput>;

type CreateFormValuesType =
    | Partial<Graphql.CreateTextTemplateVariableInput>
    | Partial<Graphql.CreateNumberTemplateVariableInput>
    | Partial<Graphql.CreateDateTemplateVariableInput>
    | Partial<Graphql.CreateSelectTemplateVariableInput>;

type CreateFormData = {
    type: TemplateVariableType | null;
    values: CreateFormValuesType | null;
};

type TemplateVariableManagementContextType = {
    // States
    loading: boolean;
    createFormData: CreateFormData;
    formPaneState: FormPaneState;

    // Form pane state management
    trySetEditMode: (id: string, type: TemplateVariableType) => void;
    trySetCreateMode: (type: TemplateVariableType) => void;

    // Create form state management
    setCreateFormData: (data: CreateFormData) => void;
    resetCreateForm: () => void;

    // Temporary value management
    getTemporaryValue: (id: string) => TemplateVariableTemporaryValue | undefined;
    setTemporaryValue: (
        id: string,
        value: TemplateVariableTemporaryValue | null,
    ) => void;

    // Creation mutations for different variable types
    createTextTemplateVariable: (
        variables: Graphql.CreateTextTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    createNumberTemplateVariable: (
        variables: Graphql.CreateNumberTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    createDateTemplateVariable: (
        variables: Graphql.CreateDateTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    createSelectTemplateVariable: (
        variables: Graphql.CreateSelectTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    // Update mutations for different variable types
    updateTextTemplateVariable: (
        variables: Graphql.UpdateTextTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    updateNumberTemplateVariable: (
        variables: Graphql.UpdateNumberTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    updateDateTemplateVariable: (
        variables: Graphql.UpdateDateTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    updateSelectTemplateVariable: (
        variables: Graphql.UpdateSelectTemplateVariableMutationVariables,
    ) => Promise<boolean>;

    // Delete mutation (common for all types)
    deleteTemplateVariable: (id: string) => Promise<boolean>;
};

const TemplateVariableManagementContext = createContext<
    TemplateVariableManagementContextType | undefined
>(undefined);

export const useTemplateVariableManagement = () => {
    const context = useContext(TemplateVariableManagementContext);
    if (!context) {
        throw new Error(
            "useTemplateVariableManagement must be used within a TemplateVariableManagementProvider",
        );
    }
    return context;
};

const ManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const notifications = useNotifications();
    const { template } = useTemplateManagement();

    const [loading, setLoading] = useState(false);
    const [temporaryValues, setTemporaryValues] = useState<
        Map<string, TemplateVariableTemporaryValue>
    >(new Map());
    const [createFormData, setCreateFormData] = useState<CreateFormData>({
        type: null,
        values: null,
    });
    const [formPaneState, setFormPaneState] = useState<FormPaneState>({
        mode: "create",
        editingVariable: null,
        createType: null,
    });

    // Dialog and navigation state
    const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
        useState(false);
    const [pendingChange, setPendingChange] = useState<{
        type: TemplateVariableType;
        id?: string;
    } | null>(null);
    const [pendingNavigation, setPendingNavigation] = useState<{
        pathname: string;
    } | null>(null);

    const setTemporaryValue = useCallback(
        (id: string, value: TemplateVariableTemporaryValue | null) => {
            if (!id) return;

            if (value === null) {
                // Remove the entry if value is null
                setTemporaryValues((prev) => {
                    const newMap = new Map(prev);
                    newMap.delete(id);
                    return newMap;
                });
            } else {
                setTemporaryValues((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(id, value);
                    return newMap;
                });
            }
        },
        [setTemporaryValues],
    );

    const hasUnsavedChanges = useCallback(() => {
        // Case 1: Check if creating new variable
        if (createFormData.type || createFormData.values) {
            return true;
        }

        // Case 2: Check for modifications to existing variables
        if (!template?.variables) return false;

        for (const [id, tempValue] of temporaryValues.entries()) {
            if (!id) continue; // Skip entries without ID (new variables)

            // Find original variable
            const originalVariable = template.variables.find(
                (v) => v.id === id,
            );
            if (!originalVariable) continue;

            // Compare temporary value with original
            const hasChanges =
                JSON.stringify(tempValue) !== JSON.stringify(originalVariable);
            if (hasChanges) return true;
        }

        return false;
    }, [createFormData, temporaryValues, template?.variables]);

    const blocker = useBlocker(hasUnsavedChanges());

    useEffect(() => {
        if (blocker.state === "blocked") {
            setShowUnsavedChangesDialog(true);
            setPendingNavigation({ pathname: blocker.location.pathname });
        }
    }, [blocker]);

    const handleConfirmNavigation = useCallback(() => {
        // Clear all temporary data
        setTemporaryValues(new Map());
        setCreateFormData({ type: null, values: null });

        // Allow navigation to proceed
        if (blocker.proceed) {
            blocker.proceed();
        }

        setShowUnsavedChangesDialog(false);
        setPendingNavigation(null);
    }, [blocker]);

    const handleCancelNavigation = useCallback(() => {
        // Stay on current page
        if (blocker.reset) {
            blocker.reset();
        }
        setShowUnsavedChangesDialog(false);
        setPendingNavigation(null);
    }, [blocker]);

    const getTemporaryValue = useCallback(
        (id: string) => temporaryValues.get(id),
        [temporaryValues],
    );

    const {
        createTextTemplateVariableMutation,
        updateTextTemplateVariableMutation,
        createNumberTemplateVariableMutation,
        updateNumberTemplateVariableMutation,
        createDateTemplateVariableMutation,
        updateDateTemplateVariableMutation,
        createSelectTemplateVariableMutation,
        updateSelectTemplateVariableMutation,
        deleteTemplateVariableMutation,
    } = useTemplateVariableGraphQL();

    // Text template variable handlers
    const handleCreateTextTemplateVariable = useCallback(
        async (
            variables: Graphql.CreateTextTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            console.log("Creating text variable", variables);
            setLoading(true);
            try {
                const maxCurrentOrderOFVariablesOfTemplate =
                    template?.variables?.reduce((max, variable) => {
                        if (variable.order > max) {
                            return variable.order;
                        }
                        return max;
                    }, 0) ?? 0;
                const newOrderOfVariable =
                    maxCurrentOrderOFVariablesOfTemplate + 1;

                const result = await createTextTemplateVariableMutation({
                    input: {
                        ...variables.input,
                        order: newOrderOfVariable,
                    },
                });

                if (result.data?.createTextTemplateVariable) {
                    notifications.show("Text variable created successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to create text variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error creating text variable:", error);
                notifications.show("Failed to create text variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createTextTemplateVariableMutation],
    );

    const handleUpdateTextTemplateVariable = useCallback(
        async (
            variables: Graphql.UpdateTextTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result =
                    await updateTextTemplateVariableMutation(variables);
                if (result.data?.updateTextTemplateVariable) {
                    notifications.show("Text variable updated successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to update text variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error updating text variable:", error);
                notifications.show("Failed to update text variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateTextTemplateVariableMutation],
    );

    // Number template variable handlers
    const handleCreateNumberTemplateVariable = useCallback(
        async (
            variables: Graphql.CreateNumberTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const maxCurrentOrderOFVariablesOfTemplate =
                    template?.variables?.reduce((max, variable) => {
                        if (variable.order > max) {
                            return variable.order;
                        }
                        return max;
                    }, 0) ?? 0;
                const newOrderOfVariable =
                    maxCurrentOrderOFVariablesOfTemplate + 1;
                const result = await createNumberTemplateVariableMutation({
                    input: {
                        ...variables.input,
                        order: newOrderOfVariable,
                    },
                });
                if (result.data?.createNumberTemplateVariable) {
                    notifications.show("Number variable created successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to create number variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error creating number variable:", error);
                notifications.show("Failed to create number variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createNumberTemplateVariableMutation],
    );

    const handleUpdateNumberTemplateVariable = useCallback(
        async (
            variables: Graphql.UpdateNumberTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result =
                    await updateNumberTemplateVariableMutation(variables);
                if (result.data?.updateNumberTemplateVariable) {
                    notifications.show("Number variable updated successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to update number variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error updating number variable:", error);
                notifications.show("Failed to update number variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateNumberTemplateVariableMutation],
    );

    // Date template variable handlers
    const handleCreateDateTemplateVariable = useCallback(
        async (
            variables: Graphql.CreateDateTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const maxCurrentOrderOFVariablesOfTemplate =
                    template?.variables?.reduce((max, variable) => {
                        if (variable.order > max) {
                            return variable.order;
                        }
                        return max;
                    }, 0) ?? 0;
                const newOrderOfVariable =
                    maxCurrentOrderOFVariablesOfTemplate + 1;
                const result = await createDateTemplateVariableMutation({
                    input: {
                        ...variables.input,
                        order: newOrderOfVariable,
                    },
                });
                if (result.data?.createDateTemplateVariable) {
                    notifications.show("Date variable created successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to create date variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error creating date variable:", error);
                notifications.show("Failed to create date variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createDateTemplateVariableMutation],
    );

    const handleUpdateDateTemplateVariable = useCallback(
        async (
            variables: Graphql.UpdateDateTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result =
                    await updateDateTemplateVariableMutation(variables);
                if (result.data?.updateDateTemplateVariable) {
                    notifications.show("Date variable updated successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to update date variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error updating date variable:", error);
                notifications.show("Failed to update date variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateDateTemplateVariableMutation],
    );

    // Select template variable handlers
    const handleCreateSelectTemplateVariable = useCallback(
        async (
            variables: Graphql.CreateSelectTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const maxCurrentOrderOFVariablesOfTemplate =
                    template?.variables?.reduce((max, variable) => {
                        if (variable.order > max) {
                            return variable.order;
                        }
                        return max;
                    }, 0) ?? 0;
                const newOrderOfVariable =
                    maxCurrentOrderOFVariablesOfTemplate + 1;
                const result = await createSelectTemplateVariableMutation({
                    input: {
                        ...variables.input,
                        order: newOrderOfVariable,
                    },
                });
                if (result.data?.createSelectTemplateVariable) {
                    notifications.show("Select variable created successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to create select variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error creating select variable:", error);
                notifications.show("Failed to create select variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createSelectTemplateVariableMutation],
    );

    const handleUpdateSelectTemplateVariable = useCallback(
        async (
            variables: Graphql.UpdateSelectTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result =
                    await updateSelectTemplateVariableMutation(variables);
                if (result.data?.updateSelectTemplateVariable) {
                    notifications.show("Select variable updated successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to update select variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error updating select variable:", error);
                notifications.show("Failed to update select variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [updateSelectTemplateVariableMutation],
    );

    // Delete template variable handler
    const handleDeleteTemplateVariable = useCallback(
        async (id: string): Promise<boolean> => {
            setLoading(true);
            try {
                const result = await deleteTemplateVariableMutation({ id });
                if (result.data?.deleteTemplateVariable) {
                    notifications.show("Variable deleted successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to delete variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                console.error("Error deleting variable:", error);
                notifications.show("Failed to delete variable", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [deleteTemplateVariableMutation],
    );

    const trySetCreateMode = useCallback(
        (type: TemplateVariableType) => {
            // Check if current create form has unsaved changes
            if (createFormData.type || createFormData.values) {
                setPendingChange({ type });
                setShowUnsavedChangesDialog(true);
                return;
            }

            // No unsaved changes, switch directly
            setFormPaneState({
                mode: "create",
                editingVariable: null,
                createType: type,
            });
            setCreateFormData({ type, values: null });
        },
        [createFormData],
    );

    const trySetEditMode = useCallback(
        (id: string, type: TemplateVariableType) => {
            // Check if current create form has unsaved changes
            if (createFormData.type || createFormData.values) {
                setPendingChange({ type, id });
                setShowUnsavedChangesDialog(true);
                return;
            }

            // No unsaved changes, switch directly
            setFormPaneState({
                mode: "edit",
                editingVariable: { id, type },
                createType: null,
            });
            setCreateFormData({ type: null, values: null });
        },
        [createFormData],
    );

    const handleConfirmChange = useCallback(() => {
        if (!pendingChange) return;

        if (pendingChange.id) {
            // Switching to edit mode
            setFormPaneState({
                mode: "edit",
                editingVariable: {
                    id: pendingChange.id,
                    type: pendingChange.type,
                },
                createType: null,
            });
        } else {
            // Switching to create mode
            setFormPaneState({
                mode: "create",
                editingVariable: null,
                createType: pendingChange.type,
            });
        }

        // Reset create form data
        setCreateFormData({ type: null, values: null });
        setShowUnsavedChangesDialog(false);
        setPendingChange(null);
    }, [pendingChange]);

    const handleCancelChange = useCallback(() => {
        setShowUnsavedChangesDialog(false);
        setPendingChange(null);
    }, []);

    const value = useMemo(
        () => ({
            loading,
            createFormData,
            formPaneState,
            getTemporaryValue,
            setTemporaryValue,
            setCreateFormData,
            resetCreateForm: () =>
                setCreateFormData({ type: null, values: null }),
            createTextTemplateVariable: handleCreateTextTemplateVariable,
            updateTextTemplateVariable: handleUpdateTextTemplateVariable,
            createNumberTemplateVariable: handleCreateNumberTemplateVariable,
            updateNumberTemplateVariable: handleUpdateNumberTemplateVariable,
            createDateTemplateVariable: handleCreateDateTemplateVariable,
            updateDateTemplateVariable: handleUpdateDateTemplateVariable,
            createSelectTemplateVariable: handleCreateSelectTemplateVariable,
            updateSelectTemplateVariable: handleUpdateSelectTemplateVariable,
            deleteTemplateVariable: handleDeleteTemplateVariable,
            trySetEditMode,
            trySetCreateMode,
        }),
        [
            loading,
            createFormData,
            setCreateFormData,
            getTemporaryValue,
            setTemporaryValue,
            handleCreateTextTemplateVariable,
            handleUpdateTextTemplateVariable,
            handleCreateNumberTemplateVariable,
            handleUpdateNumberTemplateVariable,
            handleCreateDateTemplateVariable,
            handleUpdateDateTemplateVariable,
            handleCreateSelectTemplateVariable,
            handleUpdateSelectTemplateVariable,
            handleDeleteTemplateVariable,
            formPaneState,
            trySetEditMode,
            trySetCreateMode,
            setTemporaryValue,
        ],
    );

    return (
        <TemplateVariableManagementContext.Provider value={value}>
            {children}
            <Dialog
                open={showUnsavedChangesDialog}
                onClose={handleCancelNavigation}
            >
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes. Do you want to discard them
                        and continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelNavigation}>Cancel</Button>
                    <Button onClick={handleConfirmNavigation} color="primary">
                        Discard & Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </TemplateVariableManagementContext.Provider>
    );
};

const WithGraphQL: React.FC<{
    children: React.ReactNode;
    templateId: string;
}> = ({ children, templateId }) => {
    return (
        <TemplateVariableGraphQLProvider templateId={templateId}>
            <ManagementProvider>{children}</ManagementProvider>
        </TemplateVariableGraphQLProvider>
    );
};

// TemplateVariableManagementProvider
export const TemplateVariableManagementProvider = WithGraphQL;

"use client";

import * as Graphql from "@/graphql/generated/types";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    TemplateVariableGraphQLProvider,
    useTemplateVariableGraphQL,
} from "./TemplateVariableGraphQLContext";
import { useTemplateManagement } from "../template/TemplateManagementContext";

type TemplateVariableManagementContextType = {
    // States
    loading: boolean;

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
    deleteTemplateVariable: (id: number) => Promise<boolean>;
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
                const result = await createTextTemplateVariableMutation({
                    input: {
                        ...variables.input,
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
        [
            createTextTemplateVariableMutation,
            template?.variables,
            notifications,
        ],
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
        [notifications, updateTextTemplateVariableMutation],
    );

    // Number template variable handlers
    const handleCreateNumberTemplateVariable = useCallback(
        async (
            variables: Graphql.CreateNumberTemplateVariableMutationVariables,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result = await createNumberTemplateVariableMutation({
                    input: {
                        ...variables.input,
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
        [
            createNumberTemplateVariableMutation,
            notifications,
            template?.variables,
        ],
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
                const result = await createDateTemplateVariableMutation({
                    input: {
                        ...variables.input,
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
        [
            createDateTemplateVariableMutation,
            template?.variables,
            notifications,
        ],
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
                const result = await createSelectTemplateVariableMutation({
                    input: {
                        ...variables.input,
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
        [
            createSelectTemplateVariableMutation,
            template?.variables,
            notifications,
        ],
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
        async (id: number): Promise<boolean> => {
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

    const value: TemplateVariableManagementContextType = useMemo(
        () => ({
            loading,
            createTextTemplateVariable: handleCreateTextTemplateVariable,
            updateTextTemplateVariable: handleUpdateTextTemplateVariable,
            createNumberTemplateVariable: handleCreateNumberTemplateVariable,
            updateNumberTemplateVariable: handleUpdateNumberTemplateVariable,
            createDateTemplateVariable: handleCreateDateTemplateVariable,
            updateDateTemplateVariable: handleUpdateDateTemplateVariable,
            createSelectTemplateVariable: handleCreateSelectTemplateVariable,
            updateSelectTemplateVariable: handleUpdateSelectTemplateVariable,
            deleteTemplateVariable: handleDeleteTemplateVariable,
        }),
        [
            loading,
            handleCreateTextTemplateVariable,
            handleUpdateTextTemplateVariable,
            handleCreateNumberTemplateVariable,
            handleUpdateNumberTemplateVariable,
            handleCreateDateTemplateVariable,
            handleUpdateDateTemplateVariable,
            handleCreateSelectTemplateVariable,
            handleUpdateSelectTemplateVariable,
            handleDeleteTemplateVariable,
        ],
    );

    return (
        <TemplateVariableManagementContext.Provider value={value}>
            {children}
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

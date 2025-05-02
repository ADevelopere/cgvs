import { ReactNode, useState, useCallback, useEffect, useMemo } from "react";
import axios from "@/utils/axios";
import { TemplateVariable } from "./template.types";
import { createContext, useContext } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useTemplateManagement } from "./TemplateManagementContext";

interface Notification {
    message: string;
    severity: "success" | "error";
}

export interface TemplateVariablesContext {
    variables: TemplateVariable[];
    loading: boolean;
    error: string | null;
    reorderInProgress: boolean;
    fetchVariables: (templateId: number) => Promise<void>;
    createVariable: (
        templateId: number,
        data: Omit<
            TemplateVariable,
            "id" | "template_id" | "created_at" | "updated_at"
        >
    ) => Promise<void>;
    updateVariable: (
        templateId: number,
        variableId: number,
        data: Omit<
            TemplateVariable,
            "id" | "template_id" | "created_at" | "updated_at"
        >
    ) => Promise<void>;
    deleteVariable: (templateId: number, variableId: number) => Promise<void>;
    reorderVariables: (templateId: number, variableIds: number[]) => Promise<void>;
    moveVariableUp: (templateId: number, variableId: number) => Promise<void>;
    moveVariableDown: (templateId: number, variableId: number) => Promise<void>;
}

export const TemplateVariablesContext = createContext<
    TemplateVariablesContext | undefined
>(undefined);

interface VariablesProviderProps {
    children: ReactNode;
}

export function TemplateVariablesProvider({
    children,
}: VariablesProviderProps) {
    const { template } = useTemplateManagement();
    const templateId = useMemo(() => template?.id, [template?.id]);

    const [variables, setVariables] = useState<TemplateVariable[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [reorderInProgress, setReorderInProgress] = useState(false);

    const showNotification = (
        message: string,
        severity: "success" | "error"
    ) => {
        setNotification({ message, severity });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const fetchVariables = useCallback(async (templateId: number) => {
        setLoading(true);
        try {
            const response = await axios.get<TemplateVariable[]>(
                `/admin/templates/${templateId}/variables`
            );
            // Sort variables by order before setting them
            const sortedVariables = [...response.data].sort((a, b) => a.order - b.order);
            setVariables(sortedVariables);
            setError(null); // Clear any previous errors
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Failed to fetch variables";
            setError(errorMessage);
            showNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (templateId) {
            fetchVariables(templateId);
        }
    }, [templateId, fetchVariables]);

    const createVariable = useCallback(
        async (
            templateId: number,
            data: Omit<
                TemplateVariable,
                "id" | "template_id" | "created_at" | "updated_at"
            >
        ) => {
            try {
                const response = await axios.post<TemplateVariable>(
                    `/admin/templates/${templateId}/variables`,
                    data
                );
                setVariables((prev) => {
                    const newVariables = [...prev, response.data];
                    return newVariables.sort((a, b) => a.order - b.order);
                });
                showNotification("Variable created successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to create variable";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        []
    );

    const updateVariable = useCallback(
        async (
            templateId: number,
            variableId: number,
            data: Omit<
                TemplateVariable,
                "id" | "template_id" | "created_at" | "updated_at"
            >
        ) => {
            try {
                const response = await axios.put<TemplateVariable>(
                    `/admin/variables/${variableId}`,
                    data
                );
                setVariables((prev) => {
                    const updatedVariables = prev.map((variable) =>
                        variable.id === variableId ? response.data : variable
                    );
                    return updatedVariables.sort((a, b) => a.order - b.order);
                });
                showNotification("Variable updated successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to update variable";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        []
    );

    const deleteVariable = useCallback(
        async (templateId: number, variableId: number) => {
            try {
                await axios.delete(`/admin/variables/${variableId}`);
                setVariables((prev) =>
                    prev.filter((variable) => variable.id !== variableId)
                );
                showNotification("Variable deleted successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to delete variable";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        []
    );

    const reorderVariables = useCallback(
        async (templateId: number, variableIds: number[]) => {
            try {
                setReorderInProgress(true);
                await axios.post(
                    `/admin/templates/${templateId}/variables/reorder`,
                    { variables: variableIds }
                );
                
                // Update the local state to match the new order
                setVariables((prev) => {
                    const orderedVariables = [...prev];
                    orderedVariables.sort((a, b) => {
                        const aIndex = variableIds.indexOf(a.id);
                        const bIndex = variableIds.indexOf(b.id);
                        return aIndex - bIndex;
                    });
                    return orderedVariables;
                });

                showNotification("Variables reordered successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to reorder variables";
                showNotification(errorMessage, "error");
                throw error;
            } finally {
                setReorderInProgress(false);
            }
        },
        []
    );

    const moveVariableUp = useCallback(
        async (templateId: number, variableId: number) => {
            const currentIndex = variables.findIndex((v) => v.id === variableId);
            if (currentIndex <= 0) return; // Already at the top

            const newVariableIds = variables.map((v) => v.id);
            // Swap with the previous item
            [newVariableIds[currentIndex - 1], newVariableIds[currentIndex]] = 
            [newVariableIds[currentIndex], newVariableIds[currentIndex - 1]];

            await reorderVariables(templateId, newVariableIds);
        },
        [variables, reorderVariables]
    );

    const moveVariableDown = useCallback(
        async (templateId: number, variableId: number) => {
            const currentIndex = variables.findIndex((v) => v.id === variableId);
            if (currentIndex === -1 || currentIndex >= variables.length - 1) return; // Already at the bottom

            const newVariableIds = variables.map((v) => v.id);
            // Swap with the next item
            [newVariableIds[currentIndex], newVariableIds[currentIndex + 1]] = 
            [newVariableIds[currentIndex + 1], newVariableIds[currentIndex]];

            await reorderVariables(templateId, newVariableIds);
        },
        [variables, reorderVariables]
    );

    const value = {
        variables,
        loading,
        error,
        reorderInProgress,
        fetchVariables,
        createVariable,
        updateVariable,
        deleteVariable,
        reorderVariables,
        moveVariableUp,
        moveVariableDown,
    };

    return (
        <TemplateVariablesContext.Provider value={value}>
            {children}
            {notification && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        variant="filled"
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
        </TemplateVariablesContext.Provider>
    );
}

export const useTemplateVariables = () => {
    const context = useContext(TemplateVariablesContext);
    if (context === undefined) {
        throw new Error("useTemplateVariables must be used within a TemplateVariablesProvider");
    }
    return context;
}
